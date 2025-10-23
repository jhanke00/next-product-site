'use client';

import { useEffect, useState } from 'react';

type Resource = {
  id: string;
  productId: string;
  title: string;
  type: string;
  url?: string;
  description?: string;
  createdAt?: string;
};

export default function ResourcesClient({ productId }: { productId: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'guide', url: '', description: '' });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/resources`);
      const data = await res.json();
      setResources(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/products/${productId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const created = await res.json();
        setResources((r) => [created, ...r]);
        setForm({ title: '', type: 'guide', url: '', description: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='mt-6 w-full max-w-xl'>
      <h2 className='text-xl font-semibold'>Learning Resources</h2>
      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <p className='text-sm opacity-60'>No learning resources yet.</p>
      ) : (
        <ul className='mt-2 space-y-3'>
          {resources.map((r) => (
            <li key={r.id} className='rounded border p-3'>
              <a href={r.url} target='_blank' rel='noreferrer' className='text-blue-600'>
                {r.title}
              </a>
              <div className='text-sm opacity-60'>{r.type}</div>
              <p className='text-sm'>{r.description}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className='mt-4 space-y-2'>
        <div>
          <label htmlFor='resource-title' className='block text-sm'>
            Title
          </label>
          <input
            id='resource-title'
            className='w-full border p-2'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor='resource-type' className='block text-sm'>
            Type
          </label>
          <select
            id='resource-type'
            className='w-full border p-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white'
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value='guide'>Guide</option>
            <option value='tutorial'>Tutorial</option>
            <option value='video'>Video</option>
            <option value='course'>Course</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor='resource-url' className='block text-sm'>
            URL
          </label>
          <input
            id='resource-url'
            className='w-full border p-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white'
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor='resource-description' className='block text-sm'>
            Description
          </label>
          <textarea
            id='resource-description'
            className='w-full border p-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white'
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <button className='rounded bg-blue-600 px-4 py-2 text-white' type='submit'>
            Add Resource
          </button>
        </div>
      </form>
    </div>
  );
}
