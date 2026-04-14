import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, PauseCircle, PlayCircle, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import API from '../api';

function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await API.getSubscriptions('user_default');
      setSubscriptions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseResume = async (subscription) => {
    try {
      const newStatus = subscription.status === 'active' ? 'paused' : 'active';
      await API.updateSubscription(subscription.id, { status: newStatus });
      loadSubscriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      await API.deleteSubscription(subscriptionId);
      loadSubscriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">My Subscriptions</h1>
        <button
          onClick={() => navigate('/create-subscription')}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium transition-colors hover:bg-primary/90"
          data-testid="new-subscription-button"
        >
          New Subscription
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {subscriptions.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Subscriptions Yet</h2>
          <p className="text-muted-foreground mb-6">Create your first subscription to get started with regular deliveries</p>
          <button
            onClick={() => navigate('/create-subscription')}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors hover:bg-primary/90"
            data-testid="create-first-subscription"
          >
            Create Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => {
            const isActive = subscription.status === 'active';
            const nextDelivery = new Date(subscription.next_run_at);
            
            return (
              <div
                key={subscription.id}
                className="bg-card rounded-2xl border border-border p-6"
                data-testid={`subscription-card-${subscription.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold capitalize">{subscription.frequency} Subscription</h3>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isActive ? 'badge-status-active' : 'badge-status-paused'
                        }`}
                        data-testid={`status-${subscription.id}`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span data-testid={`next-delivery-${subscription.id}`}>
                        Next delivery: {format(nextDelivery, 'PPP')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePauseResume(subscription)}
                      className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                      data-testid={`pause-resume-${subscription.id}`}
                      title={isActive ? 'Pause subscription' : 'Resume subscription'}
                    >
                      {isActive ? (
                        <PauseCircle className="w-5 h-5" />
                      ) : (
                        <PlayCircle className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(subscription.id)}
                      className="p-2 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                      data-testid={`delete-${subscription.id}`}
                      title="Delete subscription"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium mb-3">Subscribed Items</h4>
                  <div className="space-y-2">
                    {subscription.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                        data-testid={`item-${subscription.id}-${item.sku}`}
                      >
                        <span className="text-muted-foreground">{item.sku}</span>
                        <span className="font-medium">Quantity: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SubscriptionsPage;
