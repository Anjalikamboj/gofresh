'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, CheckCircle, Package, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '@/lib/api';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await API.getProducts();
      const found = data.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
        setSelectedImage(0);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'badge-stock-out', available: false };
    if (stock < 20) return { label: `Low Stock (${stock})`, class: 'badge-stock-low', available: true };
    return { label: `In Stock (${stock})`, class: 'badge-stock-in', available: true };
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-muted rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
          <p className="text-destructive">{error || 'Product not found'}</p>
          <button onClick={() => router.push('/')} className="mt-4 text-primary hover:underline">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.stock_on_hand);
  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        data-testid="back-to-products"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-secondary rounded-2xl overflow-hidden mb-4"
            style={{ aspectRatio: '4/3' }}
          >
            {images[selectedImage] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="main-product-image"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-32 h-32 text-primary/30" />
              </div>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary scale-95'
                      : 'border-transparent hover:border-border'
                  }`}
                  data-testid={`thumbnail-${index}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h1
                className="text-3xl sm:text-4xl font-semibold tracking-tight"
                data-testid="product-name"
              >
                {product.name}
              </h1>
              <span
                className={`text-xs px-3 py-1 rounded-full ${stockStatus.class}`}
                data-testid="stock-status"
              >
                {stockStatus.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-semibold" data-testid="product-price">
                ₹{product.price}
              </span>
              <span className="text-lg text-muted-foreground">per {product.unit}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About this product</h2>
            <p
              className="text-base leading-relaxed text-foreground"
              data-testid="product-description"
            >
              {product.long_description || product.description}
            </p>
          </div>

          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Key Benefits</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm"
                    data-testid={`benefit-${index}`}
                  >
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.storage && (
            <div className="mb-6 bg-muted/50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Storage Instructions</h3>
                  <p className="text-sm text-muted-foreground">{product.storage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/create-subscription')}
              disabled={!stockStatus.available}
              className="flex-1 bg-primary text-primary-foreground px-6 py-4 rounded-xl font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="subscribe-button"
            >
              <ShoppingCart className="w-5 h-5" />
              {stockStatus.available ? 'Add to Subscription' : 'Out of Stock'}
            </button>
          </div>

          <p className="text-xs text-muted-foreground mt-4 text-center">
            Subscribe for daily or weekly deliveries
          </p>
        </div>
      </div>
    </div>
  );
}
