const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

class API {
  // Products
  async getProducts() {
    const response = await fetch(`${BACKEND_URL}/api/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  }

  async createProduct(product) {
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  async updateProductStock(productId, stockOnHand) {
    const response = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_on_hand: stockOnHand })
    });
    if (!response.ok) throw new Error('Failed to update product stock');
    return response.json();
  }

  // Subscriptions
  async getSubscriptions(userStubId = null) {
    const url = userStubId
      ? `${BACKEND_URL}/api/subscriptions?user_stub_id=${userStubId}`
      : `${BACKEND_URL}/api/subscriptions`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  }

  async createSubscription(subscription) {
    const response = await fetch(`${BACKEND_URL}/api/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create subscription');
    }
    return response.json();
  }

  async updateSubscription(subscriptionId, update) {
    const response = await fetch(`${BACKEND_URL}/api/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    });
    if (!response.ok) throw new Error('Failed to update subscription');
    return response.json();
  }

  async deleteSubscription(subscriptionId) {
    const response = await fetch(`${BACKEND_URL}/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete subscription');
    return response.json();
  }

  // Orders
  async getOrders(userStubId = null) {
    const url = userStubId
      ? `${BACKEND_URL}/api/orders?user_stub_id=${userStubId}`
      : `${BACKEND_URL}/api/orders`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  async updateOrderStatus(orderId, status) {
    const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status?status=${status}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  }

  // Scheduler
  async triggerScheduler() {
    const response = await fetch(`${BACKEND_URL}/api/scheduler/run`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to trigger scheduler');
    return response.json();
  }
}

export default new API();
