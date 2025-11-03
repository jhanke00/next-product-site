'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAdminMode } from '@/src/context/AdminContext';
import { Product } from '@/src/type/products';
import { Order } from '@/src/type/orders';
import { LearningResource } from '@/src/type/resources';

type StatusState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string };

const initialStatus: StatusState = { type: 'idle' };

export const AdminPanel: React.FC = () => {
  const { isAdmin, setAdminMode } = useAdminMode();
  const [activeSection, setActiveSection] = useState<'products' | 'add-product' | 'orders' | 'resources'>('products');

  const [productIdInput, setProductIdInput] = useState('');
  const [newStockCount, setNewStockCount] = useState('');
  const [loadedProduct, setLoadedProduct] = useState<Product | null>(null);
  const [productStatus, setProductStatus] = useState<StatusState>(initialStatus);

  const [addProductForm, setAddProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    countInStock: '',
  });
  const [addProductStatus, setAddProductStatus] = useState<StatusState>(initialStatus);
  const [customCategory, setCustomCategory] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersStatus, setOrdersStatus] = useState<StatusState>(initialStatus);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesStatus, setCategoriesStatus] = useState<StatusState>(initialStatus);
  const [resourceProductId, setResourceProductId] = useState('');
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [resourceStatus, setResourceStatus] = useState<StatusState>(initialStatus);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    url: '',
    description: '',
  });

  useEffect(() => {
    if (!isAdmin) {
      setLoadedProduct(null);
      setOrders([]);
      setProductStatus(initialStatus);
      setAddProductStatus(initialStatus);
      setCategories([]);
      setResourceProductId('');
      setResources([]);
      setResourceStatus(initialStatus);
      setResourceForm({ title: '', url: '', description: '' });
      return;
    }

    const fetchCategories = async () => {
      setCategoriesStatus({ type: 'loading' });
      try {
        const response = await fetch('/api/categories', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const data = await response.json();
        const names: string[] = (data.categories || [])
          .map((cat: { name: string }) => cat.name)
          .sort((a: string, b: string) => a.localeCompare(b));
        setCategories(names);
        if (!addProductForm.category && names.length > 0) {
          setAddProductForm((prev) => ({ ...prev, category: names[0] }));
        }
        setCategoriesStatus({ type: 'success', message: 'Categories loaded' });
      } catch (error) {
        console.error(error);
        setCategoriesStatus({ type: 'error', message: 'Unable to load categories' });
      }
    };

    const fetchOrders = async () => {
      setOrdersStatus({ type: 'loading' });
      try {
        const response = await fetch('/api/orders', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load orders');
        }
        const data = await response.json();
        const sortedOrders: Order[] = (data.orders || [])
          .map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
          }))
          .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(sortedOrders);
        setOrdersStatus({ type: 'success', message: 'Orders loaded' });
      } catch (error) {
        console.error(error);
        setOrdersStatus({ type: 'error', message: 'Unable to load orders' });
      }
    };

    fetchCategories();
    fetchOrders();
  }, [isAdmin, addProductForm.category]);

  const refreshCategories = async () => {
    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      const data = await response.json();
      const names: string[] = (data.categories || [])
        .map((cat: { name: string }) => cat.name)
        .sort((a: string, b: string) => a.localeCompare(b));
      setCategories(names);
    } catch (error) {
      console.error('Failed to refresh categories:', error);
    }
  };

  const handleLoadProduct = async () => {
    if (!productIdInput.trim()) {
      setProductStatus({ type: 'error', message: 'Enter a product ID first' });
      return;
    }

    setProductStatus({ type: 'loading' });
    try {
      const response = await fetch(`/api/products?id=${encodeURIComponent(productIdInput.trim())}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        setLoadedProduct(null);
        throw new Error(response.status === 404 ? 'Product not found' : 'Failed to load product');
      }
      const data = await response.json();
      const product: Product = data.product;
      setLoadedProduct(product);
      setNewStockCount(String(product.countInStock));
      setProductStatus({ type: 'success', message: 'Product loaded' });
    } catch (error) {
      console.error(error);
      setProductStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to load product' });
    }
  };

  const handleUpdateStock = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loadedProduct) {
      setProductStatus({ type: 'error', message: 'Load a product before updating' });
      return;
    }

    const parsedCount = Number(newStockCount);
    if (Number.isNaN(parsedCount) || parsedCount < 0) {
      setProductStatus({ type: 'error', message: 'Stock must be a non-negative number' });
      return;
    }

    setProductStatus({ type: 'loading' });
    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: loadedProduct.id, countInStock: parsedCount }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const data = await response.json();
      setLoadedProduct(data);
      setProductStatus({ type: 'success', message: 'Product stock updated successfully' });
    } catch (error) {
      console.error(error);
      setProductStatus({ type: 'error', message: 'Unable to update product stock' });
    }
  };

  const handleAddProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    const { name, price, description, category, countInStock } = addProductForm;
    const resolvedCategory = category === '__new__' ? customCategory.trim() : category;

    if (!name || !price || !description || !resolvedCategory || !countInStock) {
      setAddProductStatus({ type: 'error', message: 'All fields are required' });
      return;
    }

    const priceValue = Number(price);
    const stockValue = Number(countInStock);
    if (Number.isNaN(priceValue) || Number.isNaN(stockValue)) {
      setAddProductStatus({ type: 'error', message: 'Price and stock must be valid numbers' });
      return;
    }

    if (resolvedCategory.length === 0) {
      setAddProductStatus({ type: 'error', message: 'Please provide a category' });
      return;
    }

    setAddProductStatus({ type: 'loading' });
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price: priceValue,
          description,
          category: resolvedCategory,
          countInStock: stockValue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new product');
      }

      const created = await response.json();

      setAddProductStatus({ type: 'success', message: 'Product added successfully' });
      setAddProductForm({ name: '', price: '', description: '', category: '', countInStock: '' });
      setCustomCategory('');
      setCategories((prev) => {
        if (prev.includes(created.category)) {
          return prev;
        }
        const updated = [...prev, created.category];
        updated.sort((a: string, b: string) => a.localeCompare(b));
        return updated;
      });
      await refreshCategories();
    } catch (error) {
      console.error(error);
      setAddProductStatus({ type: 'error', message: 'Unable to add product' });
    }
  };

  const loadResourcesForProduct = async () => {
    if (!resourceProductId.trim()) {
      setResourceStatus({ type: 'error', message: 'Enter a product ID first' });
      return;
    }

    setResourceStatus({ type: 'loading' });
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(resourceProductId.trim())}/resources`, {
        cache: 'no-store',
      });

      if (response.status === 404) {
        setResources([]);
        throw new Error('Product not found');
      }

      if (!response.ok) {
        throw new Error('Failed to load resources');
      }

      const data = await response.json();
      setResources((data.resources || []) as LearningResource[]);
      setResourceStatus({ type: 'success', message: 'Resources loaded' });
    } catch (error) {
      console.error(error);
      setResourceStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to load resources',
      });
    }
  };

  const handleCreateResource = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!resourceProductId.trim()) {
      setResourceStatus({ type: 'error', message: 'Enter a product ID first' });
      return;
    }

    const { title, url, description } = resourceForm;

    if (!title || !url) {
      setResourceStatus({ type: 'error', message: 'Title and URL are required' });
      return;
    }

    setResourceStatus({ type: 'loading' });
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(resourceProductId.trim())}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          url,
          description,
        }),
      });

      if (response.status === 404) {
        setResources([]);
        throw new Error('Product not found');
      }

      if (!response.ok) {
        throw new Error('Failed to add resource');
      }

      const data = await response.json();
      const resource = data.resource as LearningResource;
      setResources((prev) => [resource, ...prev]);
      setResourceForm({ title: '', url: '', description: '' });
      setResourceStatus({ type: 'success', message: 'Resource added successfully' });
    } catch (error) {
      console.error(error);
      setResourceStatus({ type: 'error', message: error instanceof Error ? error.message : 'Unable to add resource' });
    }
  };

  const ordersToDisplay = useMemo(() => orders.slice(0, 5), [orders]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className='bg-slate-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <div>
            <h2 className='text-lg font-semibold'>Admin Dashboard</h2>
            <p className='text-sm text-slate-300'>Manage products and review recent orders.</p>
          </div>
          <div className='flex items-center gap-2 text-sm'>
            <button
              type='button'
              onClick={() => setActiveSection('products')}
              className={`px-3 py-1 rounded-md border ${activeSection === 'products' ? 'bg-white text-slate-900 border-white' : 'border-slate-600 hover:border-white'}`}
            >
              Update Products
            </button>
            <button
              type='button'
              onClick={() => setActiveSection('add-product')}
              className={`px-3 py-1 rounded-md border ${activeSection === 'add-product' ? 'bg-white text-slate-900 border-white' : 'border-slate-600 hover:border-white'}`}
            >
              Add Product
            </button>
            <button
              type='button'
              onClick={() => setActiveSection('orders')}
              className={`px-3 py-1 rounded-md border ${activeSection === 'orders' ? 'bg-white text-slate-900 border-white' : 'border-slate-600 hover:border-white'}`}
            >
              Recent Orders
            </button>
            <button
              type='button'
              onClick={() => setActiveSection('resources')}
              className={`px-3 py-1 rounded-md border ${activeSection === 'resources' ? 'bg-white text-slate-900 border-white' : 'border-slate-600 hover:border-white'}`}
            >
              Learning Resources
            </button>
            <button
              type='button'
              onClick={() => setAdminMode(false)}
              className='px-3 py-1 rounded-md border border-red-500 text-red-300 hover:bg-red-600/20'
            >
              Exit Admin
            </button>
          </div>
        </div>

        <div className='mt-4 bg-slate-800 rounded-xl border border-slate-700 p-4'>
          {activeSection === 'products' && (
            <div className='space-y-4'>
              <div>
                <h3 className='text-base font-semibold'>Update Product Inventory</h3>
                <p className='text-sm text-slate-300'>Load a product by ID and update its stock count.</p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <input
                  type='text'
                  value={productIdInput}
                  onChange={(event) => setProductIdInput(event.target.value)}
                  placeholder='Enter product ID'
                  className='flex-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
                <button
                  type='button'
                  onClick={handleLoadProduct}
                  className='px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold'
                >
                  Load Product
                </button>
              </div>

              {loadedProduct && (
                <form
                  onSubmit={handleUpdateStock}
                  className='bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3'
                >
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                    <div>
                      <h4 className='font-semibold text-white'>{loadedProduct.name}</h4>
                      <p className='text-xs text-slate-300'>Current stock: {loadedProduct.countInStock}</p>
                      <p className='text-xs text-slate-400'>Price: ${parseFloat(loadedProduct.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <input
                      type='number'
                      min={0}
                      value={newStockCount}
                      onChange={(event) => setNewStockCount(event.target.value)}
                      className='flex-1 px-3 py-2 rounded-md bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                      placeholder='New stock quantity'
                    />
                    <button
                      type='submit'
                      className='px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md font-semibold'
                    >
                      Update Stock
                    </button>
                  </div>
                </form>
              )}

              {productStatus.type === 'loading' && <p className='text-sm text-blue-300'>Processing...</p>}
              {productStatus.type === 'success' && <p className='text-sm text-emerald-300'>{productStatus.message}</p>}
              {productStatus.type === 'error' && <p className='text-sm text-red-300'>{productStatus.message}</p>}
            </div>
          )}

          {activeSection === 'add-product' && (
            <form onSubmit={handleAddProduct} className='space-y-3'>
              <div>
                <h3 className='text-base font-semibold'>Add a New Product</h3>
                <p className='text-sm text-slate-300'>Provide product details to add to the catalogue.</p>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <input
                  type='text'
                  value={addProductForm.name}
                  onChange={(event) => setAddProductForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder='Product name'
                  className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
                <input
                  type='number'
                  step='0.01'
                  value={addProductForm.price}
                  onChange={(event) => setAddProductForm((prev) => ({ ...prev, price: event.target.value }))}
                  placeholder='Price'
                  className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
                <div className='col-span-1'>
                  <select
                    value={addProductForm.category}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAddProductForm((prev) => ({ ...prev, category: value }));
                      if (value !== '__new__') {
                        setCustomCategory('');
                      }
                    }}
                    className='w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                  >
                    <option value='' disabled>
                      {categoriesStatus.type === 'loading' ? 'Loading categories...' : 'Select category'}
                    </option>
                    {categories.map((categoryName) => (
                      <option key={categoryName} value={categoryName}>
                        {categoryName}
                      </option>
                    ))}
                    <option value='__new__'>Add new category…</option>
                  </select>
                </div>
                <input
                  type='number'
                  min={0}
                  value={addProductForm.countInStock}
                  onChange={(event) => setAddProductForm((prev) => ({ ...prev, countInStock: event.target.value }))}
                  placeholder='Stock quantity'
                  className='px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
              </div>
              {addProductForm.category === '__new__' && (
                <input
                  type='text'
                  value={customCategory}
                  onChange={(event) => setCustomCategory(event.target.value)}
                  placeholder='Enter new category name'
                  className='w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
              )}
              <textarea
                value={addProductForm.description}
                onChange={(event) => setAddProductForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder='Product description'
                rows={3}
                className='w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
              />
              <button type='submit' className='px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md font-semibold'>
                Add Product
              </button>

              {addProductStatus.type === 'loading' && <p className='text-sm text-blue-300'>Adding product…</p>}
              {addProductStatus.type === 'success' && (
                <p className='text-sm text-emerald-300'>{addProductStatus.message}</p>
              )}
              {addProductStatus.type === 'error' && <p className='text-sm text-red-300'>{addProductStatus.message}</p>}
            </form>
          )}

          {activeSection === 'orders' && (
            <div className='space-y-3'>
              <div>
                <h3 className='text-base font-semibold'>Recent Orders</h3>
                <p className='text-sm text-slate-300'>Showing up to five most recent orders from users.</p>
              </div>

              {ordersStatus.type === 'loading' && <p className='text-sm text-blue-300'>Loading orders…</p>}

              {ordersStatus.type === 'error' && <p className='text-sm text-red-300'>{ordersStatus.message}</p>}

              {ordersToDisplay.length > 0 && (
                <div className='space-y-3'>
                  {ordersToDisplay.map((order) => (
                    <div key={order.id} className='bg-slate-900 border border-slate-700 rounded-lg p-4'>
                      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                        <div>
                          <p className='text-sm font-semibold'>Order #{order.orderNumber}</p>
                          <p className='text-xs text-slate-400'>Placed {new Date(order.createdAt).toLocaleString()}</p>
                          <p className='text-xs text-slate-400'>
                            Customer: {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-semibold text-emerald-300'>${order.total.toFixed(2)}</p>
                          <p className='text-xs text-slate-300 capitalize'>Status: {order.status}</p>
                        </div>
                      </div>
                      <div className='mt-3 text-xs text-slate-300'>
                        <p className='font-semibold mb-1'>Items:</p>
                        <ul className='space-y-1'>
                          {order.items.map((item) => (
                            <li key={item.id} className='flex justify-between'>
                              <span className='truncate pr-2'>
                                {item.name} × {item.quantity}
                              </span>
                              <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {ordersToDisplay.length === 0 && ordersStatus.type === 'success' && (
                <p className='text-sm text-slate-300'>No orders available yet.</p>
              )}
            </div>
          )}

          {activeSection === 'resources' && (
            <div className='space-y-4'>
              <div>
                <h3 className='text-base font-semibold'>Learning Resources</h3>
                <p className='text-sm text-slate-300'>
                  Attach tutorials and guides to help customers learn about products.
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-3'>
                <input
                  type='text'
                  value={resourceProductId}
                  onChange={(event) => setResourceProductId(event.target.value)}
                  placeholder='Enter product ID'
                  className='flex-1 px-3 py-2 rounded-md bg-slate-900 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
                <button
                  type='button'
                  onClick={loadResourcesForProduct}
                  className='px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold'
                >
                  Load Resources
                </button>
              </div>

              <form
                onSubmit={handleCreateResource}
                className='bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3'
              >
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <input
                    type='text'
                    value={resourceForm.title}
                    onChange={(event) => setResourceForm((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder='Resource title'
                    className='px-3 py-2 rounded-md bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                  />
                  <input
                    type='url'
                    value={resourceForm.url}
                    onChange={(event) => setResourceForm((prev) => ({ ...prev, url: event.target.value }))}
                    placeholder='Resource URL'
                    className='px-3 py-2 rounded-md bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                  />
                </div>
                <textarea
                  value={resourceForm.description}
                  onChange={(event) => setResourceForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder='Short description (optional)'
                  rows={3}
                  className='w-full px-3 py-2 rounded-md bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white'
                />
                <button
                  type='submit'
                  className='px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md font-semibold'
                >
                  Add Resource
                </button>
              </form>

              {resourceStatus.type === 'loading' && <p className='text-sm text-blue-300'>Processing…</p>}
              {resourceStatus.type === 'success' && (
                <p className='text-sm text-emerald-300'>{resourceStatus.message}</p>
              )}
              {resourceStatus.type === 'error' && <p className='text-sm text-red-300'>{resourceStatus.message}</p>}

              {resources.length > 0 && (
                <div className='space-y-3'>
                  <h4 className='text-sm font-semibold text-slate-200'>
                    Resources for Product {resourceProductId.trim()}
                  </h4>
                  {resources.map((resource) => (
                    <div key={resource.id} className='bg-slate-900 border border-slate-700 rounded-lg p-4'>
                      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                        <div>
                          <p className='text-sm font-semibold text-white'>{resource.title}</p>
                          <p className='text-xs text-slate-300 mt-1'>
                            {resource.description || 'No description provided.'}
                          </p>
                          <a
                            href={resource.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs text-blue-300 hover:text-blue-200 mt-2 inline-flex items-center'
                          >
                            View Tutorial
                          </a>
                        </div>
                        <div className='text-xs text-slate-400 whitespace-nowrap'>
                          Added {new Date(resource.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
