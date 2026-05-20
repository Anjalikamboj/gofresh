#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timedelta
import time

class KhetiSeAPITester:
    def __init__(self, base_url="https://fresh-sub-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_subscription_id = None
        self.created_product_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "health",
            200
        )
        return success

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test(
            "Get Products",
            "GET",
            "products",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} products")
            if len(response) > 0:
                print(f"   Sample product: {response[0].get('name', 'Unknown')}")
        return success, response

    def test_create_product(self):
        """Test creating a new product"""
        test_product = {
            "sku": f"TEST_SKU_{int(time.time())}",
            "name": "Test Product",
            "unit": "kg",
            "price": 25.50,
            "stock_on_hand": 100,
            "description": "Test product for API testing"
        }
        
        success, response = self.run_test(
            "Create Product",
            "POST",
            "products",
            200,
            data=test_product
        )
        
        if success and 'id' in response:
            self.created_product_id = response['id']
            print(f"   Created product ID: {self.created_product_id}")
        
        return success, response

    def test_update_product_stock(self):
        """Test updating product stock"""
        if not self.created_product_id:
            print("❌ Skipping - No product ID available")
            return False
            
        success, response = self.run_test(
            "Update Product Stock",
            "PATCH",
            f"products/{self.created_product_id}",
            200,
            data={"stock_on_hand": 75}
        )
        
        if success and response.get('stock_on_hand') == 75:
            print(f"   Stock updated successfully to 75")
        
        return success

    def test_create_subscription(self):
        """Test creating a subscription"""
        subscription_data = {
            "user_stub_id": "user_default",
            "items": [
                {"sku": "MILK001", "quantity": 2},
                {"sku": "VEG001", "quantity": 1}
            ],
            "frequency": "daily"
        }
        
        success, response = self.run_test(
            "Create Subscription",
            "POST",
            "subscriptions",
            200,
            data=subscription_data
        )
        
        if success and 'id' in response:
            self.created_subscription_id = response['id']
            print(f"   Created subscription ID: {self.created_subscription_id}")
            print(f"   Frequency: {response.get('frequency')}")
            print(f"   Status: {response.get('status')}")
        
        return success, response

    def test_get_subscriptions(self):
        """Test getting subscriptions"""
        success, response = self.run_test(
            "Get Subscriptions",
            "GET",
            "subscriptions",
            200,
            params={"user_stub_id": "user_default"}
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} subscriptions")
        
        return success, response

    def test_pause_resume_subscription(self):
        """Test pausing and resuming subscription"""
        if not self.created_subscription_id:
            print("❌ Skipping - No subscription ID available")
            return False
            
        # Test pause
        success_pause, response_pause = self.run_test(
            "Pause Subscription",
            "PATCH",
            f"subscriptions/{self.created_subscription_id}",
            200,
            data={"status": "paused"}
        )
        
        if not success_pause:
            return False
            
        # Test resume
        success_resume, response_resume = self.run_test(
            "Resume Subscription",
            "PATCH",
            f"subscriptions/{self.created_subscription_id}",
            200,
            data={"status": "active"}
        )
        
        return success_resume

    def test_get_orders(self):
        """Test getting orders"""
        success, response = self.run_test(
            "Get Orders",
            "GET",
            "orders",
            200,
            params={"user_stub_id": "user_default"}
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} orders")
            if len(response) > 0:
                print(f"   Sample order status: {response[0].get('status', 'Unknown')}")
        
        return success, response

    def test_trigger_scheduler(self):
        """Test manually triggering the scheduler"""
        success, response = self.run_test(
            "Trigger Scheduler",
            "POST",
            "scheduler/run",
            200
        )
        
        if success:
            print(f"   Scheduler response: {response.get('message', 'No message')}")
        
        return success

    def test_weekly_subscription(self):
        """Test creating a weekly subscription"""
        subscription_data = {
            "user_stub_id": "user_default",
            "items": [
                {"sku": "FRUIT001", "quantity": 3}
            ],
            "frequency": "weekly"
        }
        
        success, response = self.run_test(
            "Create Weekly Subscription",
            "POST",
            "subscriptions",
            200,
            data=subscription_data
        )
        
        if success:
            print(f"   Weekly subscription created with frequency: {response.get('frequency')}")
        
        return success

    def cleanup(self):
        """Clean up created resources"""
        print(f"\n🧹 Cleaning up...")
        
        # Delete created subscription
        if self.created_subscription_id:
            try:
                self.run_test(
                    "Delete Test Subscription",
                    "DELETE",
                    f"subscriptions/{self.created_subscription_id}",
                    200
                )
            except:
                pass

def main():
    print("🚀 Starting KhetiSe API Tests")
    print("=" * 50)
    
    tester = KhetiSeAPITester()
    
    # Test sequence
    tests = [
        tester.test_health_check,
        tester.test_get_products,
        tester.test_create_product,
        tester.test_update_product_stock,
        tester.test_create_subscription,
        tester.test_get_subscriptions,
        tester.test_pause_resume_subscription,
        tester.test_get_orders,
        tester.test_trigger_scheduler,
        tester.test_weekly_subscription
    ]
    
    # Run all tests
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            tester.tests_run += 1
    
    # Wait a bit and check orders again after scheduler
    print(f"\n⏳ Waiting 3 seconds for scheduler to process...")
    time.sleep(3)
    tester.test_get_orders()
    
    # Cleanup
    tester.cleanup()
    
    # Print results
    print(f"\n📊 Test Results")
    print("=" * 50)
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())