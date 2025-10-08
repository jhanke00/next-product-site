'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { LearningResource, ResourceType } from '@type/resources';

const RESOURCE_TYPES: ResourceType[] = ['Article', 'Video', 'Guide', 'Course', 'Reference'];

const emptyFormState = {
  title: '',
  url: '',
  type: RESOURCE_TYPES[0] as ResourceType,
  description: '',
  estimatedMinutes: '',
};

type ProductResourcesProps = {
  productId: string;
  initialResources?: LearningResource[];
};

type FormState = typeof emptyFormState;

type FetchState = 'idle' | 'loading' | 'error';

const ProductResources = ({ productId, initialResources }: ProductResourcesProps) => {
  const [resources, setResources] = useState<LearningResource[]>(() => initialResources ?? []);
  const [fetchState, setFetchState] = useState<FetchState>(initialResources ? 'idle' : 'loading');
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasResources = resources.length > 0;

  const orderedResources = useMemo(
    () => [...resources].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [resources]
  );

  const resetForm = () => {
    setFormState(emptyFormState);
  };

  const fetchResources = async () => {
    setFetchState('loading');
    setFormError(null);

    try {
      const response = await fetch(`/api/products/${productId}/resources`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Unable to load learning resources');
      }

      const data = (await response.json()) as { resources?: LearningResource[] };
      setResources(data.resources ?? []);
      setFetchState('idle');
    } catch (error) {
      setFetchState('error');
      setFormError((error as Error).message);
    }
  };

  useEffect(() => {
    if (!initialResources) {
      fetchResources();
    } else {
      setFetchState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    const payload = {
      title: formState.title.trim(),
      url: formState.url.trim(),
      type: formState.type,
      description: formState.description.trim() || undefined,
      estimatedMinutes: formState.estimatedMinutes !== '' ? Number.parseInt(formState.estimatedMinutes, 10) : undefined,
    };

    try {
      const response = await fetch(`/api/products/${productId}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        const message = errorPayload?.details || errorPayload?.error || 'Unable to save resource';
        throw new Error(message);
      }

      const data = (await response.json()) as { resource: LearningResource };
      setResources((previous: LearningResource[]) => [data.resource, ...previous]);
      setFormSuccess('Learning resource added');
      resetForm();
    } catch (error) {
      setFormError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm shadow-neutral-100'>
      <header>
        <h2 className='text-xl font-semibold text-neutral-900'>Learning Resources</h2>
        <p className='text-sm text-neutral-500'>Surface tutorials, guides, and training modules for this product.</p>
      </header>

      <form className='space-y-4 rounded-md border border-neutral-100 bg-neutral-50 p-4' onSubmit={onSubmit}>
        <div className='flex flex-col gap-2 md:flex-row md:gap-4'>
          <label className='flex-1 text-sm font-medium text-neutral-700'>
            Title
            <input
              required
              className='mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              placeholder='Resource title'
              value={formState.title}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setFormState((state: FormState) => ({ ...state, title: event.target.value }))
              }
            />
          </label>
          <label className='w-full text-sm font-medium text-neutral-700 md:w-44'>
            Format
            <select
              className='mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
              value={formState.type}
              onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                setFormState((state: FormState) => ({ ...state, type: event.target.value as ResourceType }))
              }
            >
              {RESOURCE_TYPES.map((resourceType) => (
                <option key={resourceType} value={resourceType}>
                  {resourceType}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className='block text-sm font-medium text-neutral-700'>
          URL
          <input
            required
            type='url'
            className='mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
            placeholder='https://example.com/tutorial'
            value={formState.url}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFormState((state: FormState) => ({ ...state, url: event.target.value }))
            }
          />
        </label>

        <label className='block text-sm font-medium text-neutral-700'>
          Description <span className='font-normal text-neutral-500'>(optional)</span>
          <textarea
            className='mt-1 min-h-[90px] w-full rounded border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
            placeholder='What can learners expect to gain?'
            value={formState.description}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setFormState((state: FormState) => ({ ...state, description: event.target.value }))
            }
          />
        </label>

        <label className='block text-sm font-medium text-neutral-700'>
          Estimated duration (minutes) <span className='font-normal text-neutral-500'>(optional)</span>
          <input
            type='number'
            min='0'
            className='mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200'
            placeholder='e.g. 15'
            value={formState.estimatedMinutes}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setFormState((state: FormState) => ({ ...state, estimatedMinutes: event.target.value }))
            }
          />
        </label>

        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400'
          >
            {isSubmitting ? 'Saving…' : 'Add resource'}
          </button>
          {formSuccess && <span className='text-sm text-green-600'>{formSuccess}</span>}
        </div>
        {formError && <p className='text-sm text-red-600'>{formError}</p>}
      </form>

      <section className='space-y-3'>
        <h3 className='text-base font-semibold text-neutral-800'>Available tutorials</h3>
        {fetchState === 'loading' && <p className='text-sm text-neutral-500'>Loading resources…</p>}
        {fetchState === 'error' && (
          <p className='text-sm text-red-600'>Unable to load resources. Please try again later.</p>
        )}
        {fetchState === 'idle' && !hasResources && (
          <p className='text-sm text-neutral-500'>No learning resources yet. Be the first to add one!</p>
        )}

        {fetchState === 'idle' && hasResources && (
          <ul className='space-y-3'>
            {orderedResources.map((resource) => (
              <li key={resource.id} className='rounded border border-neutral-200 p-4 shadow-sm'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div>
                    <h4 className='text-sm font-semibold text-neutral-900'>{resource.title}</h4>
                    <p className='text-xs uppercase tracking-wide text-blue-600'>{resource.type}</p>
                  </div>
                  <a
                    className='text-sm font-medium text-blue-600 hover:text-blue-700'
                    href={resource.url}
                    target='_blank'
                    rel='noreferrer'
                  >
                    Open resource
                  </a>
                </div>
                {resource.description && <p className='mt-2 text-sm text-neutral-600'>{resource.description}</p>}
                <div className='mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-500'>
                  {resource.estimatedMinutes !== undefined && <span>{resource.estimatedMinutes} min</span>}
                  <span>
                    Added{' '}
                    {new Date(resource.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProductResources;
