import React, { useState, useEffect } from 'react';
import { Pencil, Save, X, Plus, AlertCircle, Trash2 } from 'lucide-react';
import API from '../api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    unit: 'kg',
    price: '',
    stock_on_hand: '',
    description: '',
    image_url: '',
    benefits: [''],
    storage: ''
  });

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

  const handleEditStart = (product) => {
    setEditingId(product.id);
    setEditStock(product.stock_on_hand.toString());
  };

  const handleEditSave = async (productId) => {
    try {
      await API.updateProductStock(productId, parseInt(editStock));
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditStock('');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty benefits
      const filteredBenefits = newProduct.benefits.filter(b => b.trim() !== '');
      
      await API.createProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock_on_hand: parseInt(newProduct.stock_on_hand),
        benefits: filteredBenefits.length > 0 ? filteredBenefits : undefined,
        storage: newProduct.storage.trim() || undefined
      });
      setShowAddForm(false);
      setNewProduct({
        sku: '',
        name: '',
        unit: 'kg',
        price: '',
        stock_on_hand: '',
        description: '',
        image_url: '',
        benefits: [''],
        storage: ''
      });
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await API.deleteProduct(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...newProduct.benefits];
    updatedBenefits[index] = value;
    setNewProduct({ ...newProduct, benefits: updatedBenefits });
  };

  const addBenefitField = () => {
    setNewProduct({ ...newProduct, benefits: [...newProduct.benefits, ''] });
  };

  const removeBenefitField = (index) => {
    const updatedBenefits = newProduct.benefits.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, benefits: updatedBenefits.length > 0 ? updatedBenefits : [''] });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Products & Inventory</h1>
        <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Products & Inventory</h1>
          <p className="text-muted-foreground">Manage your product catalog and stock levels</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium transition-colors hover:bg-primary/90"
          data-testid="add-product-button"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">SKU *</label>
                <input
                  type="text"
                  required
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  placeholder="e.g., MILK001"
                  data-testid="new-product-sku"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  placeholder="e.g., Fresh Milk"
                  data-testid="new-product-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit *</label>
                <select
                  required
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  data-testid="new-product-unit"
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="liter">Liter</option>
                  <option value="dozen">Dozen</option>
                  <option value="loaf">Loaf</option>
                  <option value="piece">Piece</option>
                  <option value="gram">Gram (g)</option>
                  <option value="pack">Pack</option>
                  <option value="bottle">Bottle</option>
                  <option value="box">Box</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  placeholder="e.g., 60"
                  data-testid="new-product-price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock *</label>
                <input
                  type="number"
                  required
                  value={newProduct.stock_on_hand}
                  onChange={(e) => setNewProduct({ ...newProduct, stock_on_hand: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  placeholder="e.g., 100"
                  data-testid="new-product-stock"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  placeholder="https://example.com/image.jpg"
                  data-testid="new-product-image"
                />
                <p className="text-xs text-muted-foreground mt-1">Optional: URL to product image</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-y min-h-[100px]"
                placeholder="Enter product description, benefits, storage instructions, etc."
                rows="4"
                data-testid="new-product-description"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: Detailed product information</p>
            </div>

            {/* Key Benefits */}
            <div>
              <label className="block text-sm font-medium mb-2">Key Benefits</label>
              <div className="space-y-2">
                {newProduct.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-input bg-background"
                      placeholder={`Benefit ${index + 1}`}
                      data-testid={`new-product-benefit-${index}`}
                    />
                    {newProduct.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefitField(index)}
                        className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive/20 text-destructive transition-colors"
                        data-testid={`remove-benefit-${index}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefitField}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg hover:border-primary transition-colors"
                  data-testid="add-benefit-button"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Benefit
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Optional: List product benefits (e.g., "Rich in Vitamin C", "Locally sourced")</p>
            </div>

            {/* Storage Instructions */}
            <div>
              <label className="block text-sm font-medium mb-1">Storage Instructions</label>
              <textarea
                value={newProduct.storage}
                onChange={(e) => setNewProduct({ ...newProduct, storage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background resize-y min-h-[80px]"
                placeholder="e.g., Store in refrigerator at 2-4°C. Best consumed within 3 days."
                rows="3"
                data-testid="new-product-storage"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: How to store this product for optimal freshness</p>
            </div>
            
            {newProduct.image_url && (
              <div>
                <label className="block text-sm font-medium mb-2">Image Preview</label>
                <div className="bg-secondary rounded-lg p-4 flex items-center justify-center" style={{ maxHeight: '200px' }}>
                  <img 
                    src={newProduct.image_url} 
                    alt="Preview" 
                    className="max-h-[180px] rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <p className="text-muted-foreground text-sm" style={{ display: 'none' }}>
                    Invalid image URL
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                data-testid="cancel-add-product"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors hover:bg-primary/90"
                data-testid="submit-add-product"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="admin-products-table">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium">SKU</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Unit</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Stock</th>
                <th className="text-right px-6 py-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  data-testid={`product-row-${product.sku}`}
                >
                  <td className="px-6 py-4 font-mono text-sm">{product.sku}</td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{product.unit}</td>
                  <td className="px-6 py-4 font-medium">₹{product.price}</td>
                  <td className="px-6 py-4">
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-24 px-2 py-1 rounded border border-input bg-background"
                        data-testid={`edit-stock-input-${product.sku}`}
                        autoFocus
                      />
                    ) : (
                      <span data-testid={`stock-value-${product.sku}`}>{product.stock_on_hand}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === product.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditSave(product.id)}
                          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          data-testid={`save-stock-${product.sku}`}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                          data-testid={`cancel-edit-${product.sku}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditStart(product)}
                          className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                          data-testid={`edit-stock-${product.sku}`}
                          title="Edit stock"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                          data-testid={`delete-product-${product.sku}`}
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{productToDelete?.name}</strong> (SKU: {productToDelete?.sku})?
              <br /><br />
              This action cannot be undone. The product will be permanently removed from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminProductsPage;
