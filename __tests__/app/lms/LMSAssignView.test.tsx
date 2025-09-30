import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { View as LMSAssignView } from '../../../app/lms/products/[productId]/assign/view';
import { LearningResource } from '@/src/type/products';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockResources: LearningResource[] = [
  {
    id: 'resource-1',
    title: 'Training Module 1',
    description: 'Test training description',
    type: 'training',
    duration: '30 minutes',
    files: [
      {
        id: 'file-1',
        name: 'test-video.mp4',
        url: '/media/test-video.mp4',
        type: 'video',
      },
    ],
    createdAt: new Date('2025-01-26T10:00:00.000Z'),
  },
  {
    id: 'resource-2',
    title: 'Tutorial 1',
    description: 'Test tutorial description',
    type: 'tutorial',
    files: [
      {
        id: 'file-2',
        name: 'test.pdf',
        url: '/media/test.pdf',
        type: 'pdf',
      },
    ],
    createdAt: new Date('2025-01-26T11:00:00.000Z'),
  },
];

const mockAssignment = {
  productId: 1,
  assignedResources: ['resource-1'],
  customGuide: 'Test custom guide',
  updatedAt: '2025-01-26T12:00:00.000Z',
};

describe('LMSAssignView', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders without crashing', () => {
    render(<LMSAssignView productId={1} resources={mockResources} assignment={mockAssignment} />);

    expect(screen.getByText('Assign Learning Resources')).toBeInTheDocument();
  });

  it('displays custom guide textarea with existing value', () => {
    render(<LMSAssignView productId={1} resources={mockResources} assignment={mockAssignment} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Test custom guide');
  });

  it('submits form with updated assignment', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Assignment updated' }),
    });

    render(<LMSAssignView productId={1} resources={mockResources} assignment={mockAssignment} />);

    const saveButton = screen.getByText('Save Assignments');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/products/1/assignments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedResources: ['resource-1'],
          customGuide: 'Test custom guide',
        }),
      });
    });
  });

  it('displays save message on successful save', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Assignment updated' }),
    });

    render(<LMSAssignView productId={1} resources={mockResources} assignment={mockAssignment} />);

    const saveButton = screen.getByText('Save Assignments');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Successfully saved assignments!')).toBeInTheDocument();
    });
  });
});
