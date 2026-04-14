import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Calendar as CalendarIcon, Check } from 'lucide-react';
import API from '../api';

function CreateSubscriptionPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await API.getProducts();
      setProducts(data.filter(p => p.stock_on_hand > 0));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = (sku, delta) => {
    setSelectedItems(prev => {
      const current = prev[sku] || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        const { [sku]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [sku]: newQty };
    });
  };

  const handleCreateSubscription = async () => {
    const items = Object.entries(selectedItems).map(([sku, quantity]) => ({
      sku,
      quantity
    }));

    if (items.length === 0) {
      setError('Please select at least one product');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await API.createSubscription({
        items,
        frequency
      });
      navigate('/subscriptions');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.keys(selectedItems).length;
  const totalPrice = products.reduce((sum, product) => {
    const qty = selectedItems[product.sku] || 0;
    return sum + (product.price * qty);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-testid="back-button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Create Subscription</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm font-medium">Select Products</span>
          </div>
          <div className="w-12 h-0.5 bg-border mx-4"></div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Choose Frequency</span>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-6">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Select Products */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Products & Quantities</h2>
            <div className="space-y-4 mb-6">
              {products.map(product => {
                const qty = selectedItems[product.sku] || 0;
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
                    data-testid={`product-select-${product.sku}`}
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{product.price} per {product.unit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(product.sku, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors"
                        data-testid={`decrease-${product.sku}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium" data-testid={`quantity-${product.sku}`}>{qty}</span>
                      <button
                        onClick={() => updateQuantity(product.sku, 1)}
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                        data-testid={`increase-${product.sku}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground">{selectedCount} items selected</p>
                <p className="text-lg font-semibold">Total: ₹{totalPrice.toFixed(2)} per delivery</p>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={selectedCount === 0}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-colors hover:bg-primary/90"
                data-testid="next-to-frequency"
              >
                Next: Choose Frequency
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Frequency */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Choose Delivery Frequency</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setFrequency('daily')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  frequency === 'daily'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid="frequency-daily"
              >
                <CalendarIcon className="w-8 h-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-1">Daily Delivery</h3>
                <p className="text-sm text-muted-foreground">Get fresh products every day</p>
              </button>
              <button
                onClick={() => setFrequency('weekly')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  frequency === 'weekly'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid="frequency-weekly"
              >
                <CalendarIcon className="w-8 h-8 mb-3 text-primary" />
                <h3 className="font-semibold mb-1">Weekly Delivery</h3>
                <p className="text-sm text-muted-foreground">Get fresh products once a week</p>
              </button>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 mb-6">
              <h3 className="font-medium mb-2">Subscription Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{selectedCount} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="capitalize">{frequency}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Cost per delivery:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl font-medium border border-border hover:bg-secondary transition-colors"
                data-testid="back-to-products"
              >
                Back
              </button>
              <button
                onClick={handleCreateSubscription}
                disabled={loading}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium disabled:opacity-50 transition-colors hover:bg-primary/90"
                data-testid="confirm-subscription"
              >
                {loading ? 'Creating...' : 'Create Subscription'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateSubscriptionPage;
