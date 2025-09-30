import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { View as LMSView } from '../../../app/lms/view';
import { LearningResource } from '@/src/type/products';

// Mock the ResourceCard component
jest.mock('@/src/components/learning/ResourceCard', () => ({
  ResourceCard: ({ resource, onDelete, showDeleteButton }: any) => (
    <div data-testid={`resource-card-${resource.id}`}>
      <h3>{resource.title}</h3>
      <p>{resource.description}</p>
      <span>{resource.type}</span>
      {showDeleteButton && <button onClick={() => onDelete(resource.id)}>Delete</button>}
    </div>
  ),
}));

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockResources: LearningResource[] = [
  {
    id: 'resource-1',
    title: 'Test Training Module',
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
    title: 'Test Tutorial',
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

describe('LMSView', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders without crashing', () => {
    render(<LMSView resources={mockResources} />);
    expect(screen.getByText('Learning Management System')).toBeInTheDocument();
    expect(screen.getByText('Manage training modules and tutorials for your products')).toBeInTheDocument();
  });

  it('displays training modules section', () => {
    render(<LMSView resources={mockResources} />);
    expect(screen.getByText('Training Modules')).toBeInTheDocument();
    expect(screen.getByTestId('resource-card-resource-1')).toBeInTheDocument();
  });

  it('displays tutorials section', () => {
    render(<LMSView resources={mockResources} />);
    expect(screen.getByText('Tutorials')).toBeInTheDocument();
    expect(screen.getByTestId('resource-card-resource-2')).toBeInTheDocument();
  });

  it('displays add resource button', () => {
    render(<LMSView resources={mockResources} />);
    expect(screen.getByText('Add Resource')).toBeInTheDocument();
  });

  it('opens create resource modal when add button is clicked', () => {
    render(<LMSView resources={mockResources} />);
    const addButton = screen.getByText('Add Resource');

    fireEvent.click(addButton);

    expect(screen.getByText('Create Learning Resource')).toBeInTheDocument();
  });

  it('closes modal when cancel is clicked', () => {
    render(<LMSView resources={mockResources} />);
    const addButton = screen.getByText('Add Resource');

    fireEvent.click(addButton);
    expect(screen.getByText('Create Learning Resource')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Create Learning Resource')).not.toBeInTheDocument();
  });

  it('displays empty state for training modules when none exist', () => {
    const tutorialOnlyResources = mockResources.filter((r) => r.type === 'tutorial');
    render(<LMSView resources={tutorialOnlyResources} />);

    expect(screen.getByText('No training modules yet. Create your first one!')).toBeInTheDocument();
  });

  it('displays empty state for tutorials when none exist', () => {
    const trainingOnlyResources = mockResources.filter((r) => r.type === 'training');
    render(<LMSView resources={trainingOnlyResources} />);

    expect(screen.getByText('No tutorials yet. Create your first one!')).toBeInTheDocument();
  });
});
