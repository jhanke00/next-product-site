'use client';
import { Product } from '@/src/type/products';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { ProductResource } from '@/src/type/products';

const ProductDetails = (product: Product) => {
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const [learningResources, setLearningResources] = useState(product.learningResources ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sortedResources = useMemo(() => {
    return [...learningResources].sort((a, b) => b.popularityScore - a.popularityScore);
  }, [learningResources]);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const resourceURI = formData.get('url') as string;
    const description = formData.get('description') as string;
    const resourceId = crypto.randomUUID();

    if (name && resourceURI) {
      handleAddResource(name, description, resourceURI, resourceId);
      dialogRef.current?.close();
    }
  };

  const handleAddResource = async (name: string, description: string, resourceURI: string, resourceId: string) => {
    const newResource = {
      productId: product.id,
      resourceId,
      name,
      description,
      resourceURI,
      popularityScore: 50, // default score for new resources
    };

    setIsLoading(true);
    try {
      // POST to add new resource
      const response = await fetch('/api/learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResource),
      });

      if (response.ok) {
        setLearningResources([...learningResources, newResource]);
      } else {
        console.error('Failed to add resource');
        alert('Failed to add resource. Please try again.');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Error adding resource. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLearningResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/learning/product/${product.id}`);
      if (response.ok) {
        const { data } = await response.json();
        setLearningResources(data);
      } else {
        console.error('Failed to fetch learning resources');
      }
    } catch (error) {
      console.error('Error fetching learning resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch learning resources on component mount
  useEffect(() => {
    fetchLearningResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const deleteResource = async (resourceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/learning/${resourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the list after deletion
        await fetchLearningResources();
      } else {
        console.error('Failed to delete resource');
        alert('Failed to delete resource. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Error deleting resource. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLearningResources = async (updatedResources: ProductResource[]) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/learning/product/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedResources),
      });

      if (response.ok) {
        setLearningResources(updatedResources);
      } else {
        console.error('Failed to update resources');
        alert('Failed to update resources. Please try again.');
      }
    } catch (error) {
      console.error('Error updating resources:', error);
      alert('Error updating resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col p-24'>
      <h1 className='text-2xl font-semibold'>Product Description</h1>
      <h3 className={`mb-3 text-xl `}>{product.name}</h3>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
      <button
        className='m-0 max-w-[30ch] text-sm opacity-50 font-bold hover:opacity-70 transition-opacity text-left border border-gray-300 rounded px-2 py-1'
        onClick={() => setIsPopoutOpen(!isPopoutOpen)}
      >
        Learning Resources ({learningResources.length})
      </button>
      {isPopoutOpen && (
        <div className='mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow-md max-w-md'>
          <div className='flex justify-between items-center mb-3'>
            <div className='flex items-center gap-2'>
              <h4 className='font-semibold text-gray-800 dark:text-gray-200'>Learning Resources:</h4>
              <button
                onClick={fetchLearningResources}
                disabled={isLoading}
                className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                title='Refresh learning resources'
              >
                {isLoading ? '⟳' : '↻'}
              </button>
            </div>
            <button
              onClick={() => setIsPopoutOpen(false)}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold'
            >
              ✕
            </button>
          </div>

          {sortedResources.length > 0 ? (
            <ul className='space-y-2 mb-3'>
              {sortedResources.map((resource) => (
                <li
                  key={resource.resourceId}
                  className='text-gray-700 dark:text-gray-300 flex items-center justify-between'
                >
                  <a
                    href={resource.resourceURI}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline'
                  >
                    {resource.name}
                  </a>
                  <button
                    onClick={() => deleteResource(resource.resourceId)}
                    disabled={isLoading}
                    className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm ml-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    title='Delete resource'
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 dark:text-gray-400 italic mb-3'>No resources yet. Add one below!</p>
          )}

          <button
            onClick={openDialog}
            disabled={isLoading}
            className='w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isLoading ? 'Loading...' : '+ Add new learning resource'}
          </button>
          <dialog
            ref={dialogRef}
            className='border-0 p-6 rounded-lg shadow-2xl backdrop:bg-black backdrop:bg-opacity-50 max-w-md w-full bg-white dark:bg-gray-900'
          >
            <form method='dialog' onSubmit={handleSubmit}>
              <h3 className='font-medium mb-2 text-gray-900 dark:text-gray-100'>Add New Learning Resource</h3>
              <label className='block mb-3'>
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Name:</span>
                <input
                  type='text'
                  name='name'
                  className='border border-gray-300 dark:border-gray-600 p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  required
                />
              </label>
              <label className='block mb-3'>
                <span className='text-gray-700 dark:text-gray-300 font-medium'>Description:</span>
                <textarea
                  name='description'
                  className='border border-gray-300 dark:border-gray-600 p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  rows={3}
                ></textarea>
              </label>
              <label className='block mb-4'>
                <span className='text-gray-700 dark:text-gray-300 font-medium'>URL:</span>
                <input
                  type='url'
                  name='url'
                  className='border border-gray-300 dark:border-gray-600 p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  required
                />
              </label>
              <div className='flex justify-end gap-2 mt-4'>
                <button
                  type='button'
                  className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-900 dark:text-gray-100'
                  onClick={closeDialog}
                >
                  Cancel
                </button>
                <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'>
                  Add Resource
                </button>
              </div>
            </form>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
