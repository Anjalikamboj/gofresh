import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../api';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await API.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'badge-stock-out' };
    if (stock < 20) return { label: `Low Stock (${stock})`, class: 'badge-stock-low' };
    return { label: `In Stock (${stock})`, class: 'badge-stock-in' };
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="product-card animate-pulse">
              <div className="h-48 bg-muted rounded-xl mb-4"></div>
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <div className="hero-gradient rounded-3xl p-8 sm:p-12 mb-12 noise-overlay">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            Fresh from Farm to Your Home
          </h1>
          <p className="text-base md:text-lg font-medium text-muted-foreground mb-6">
            Subscribe to fresh produce and never worry about running out. Daily or weekly deliveries based on your needs.
          </p>
          <button
            onClick={() => navigate('/create-subscription')}
            data-testid="create-subscription-button"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors duration-200 hover:bg-primary/90 active:scale-[0.98] flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Create Subscription
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-6">Available Products</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.stock_on_hand);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="product-card"
                  data-testid={`product-card-${product.sku}`}
                >
                  <div className="bg-secondary rounded-xl h-48 mb-4 overflow-hidden">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Leaf className="w-20 h-20 text-primary/30" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.class}`} data-testid={`stock-badge-${product.sku}`}>
                      {stockStatus.label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {product.description || 'Fresh and organic'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-semibold">₹{product.price}</p>
                      <p className="text-xs text-muted-foreground">per {product.unit}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
