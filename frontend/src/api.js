const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  } : {
    'Content-Type': 'application/json'
  };
};

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
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  }

  async updateProductStock(productId, stockOnHand) {
    const response = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stock_on_hand: stockOnHand })
    });
    if (!response.ok) throw new Error('Failed to update product stock');
    return response.json();
  }

  async deleteProduct(productId) {
    const response = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete product');
    }
    return response.json();
  }

  // Subscriptions
  async getSubscriptions() {
    const response = await fetch(`${BACKEND_URL}/api/subscriptions`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch subscriptions');
    return response.json();
  }

  async createSubscription(subscription) {
    const response = await fetch(`${BACKEND_URL}/api/subscriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(update)
    });
    if (!response.ok) throw new Error('Failed to update subscription');
    return response.json();
  }

  async deleteSubscription(subscriptionId) {
    const response = await fetch(`${BACKEND_URL}/api/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete subscription');
    return response.json();
  }

  // Orders
  async getOrders() {
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  async updateOrderStatus(orderId, status) {
    const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status?status=${status}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to update order status');
    return response.json();
  }

  // Scheduler
  async triggerScheduler() {
    const response = await fetch(`${BACKEND_URL}/api/scheduler/run`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to trigger scheduler');
    return response.json();
  }

  // Profile
  async updateProfile(data) {
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.detail || 'Failed to update profile');
    }
    
    return result;
  }

  // Admin - Users
  async adminGetUsers(page = 1, pageSize = 10) {
    const response = await fetch(`${BACKEND_URL}/api/admin/users?page=${page}&page_size=${pageSize}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
}

export default new API();
