/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LearningResource } from '@/src/types/learning';
import ResourceCard from '@/src/components/learning/ResourceCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Star: () => <div data-testid='star-icon'>Star</div>,
  Clock: () => <div data-testid='clock-icon'>Clock</div>,
  Users: () => <div data-testid='users-icon'>Users</div>,
  BookOpen: () => <div data-testid='book-icon'>Book</div>,
  Video: () => <div data-testid='video-icon'>Video</div>,
  FileText: () => <div data-testid='file-icon'>File</div>,
  Award: () => <div data-testid='award-icon'>Award</div>,
  Globe: () => <div data-testid='globe-icon'>Globe</div>,
}));

const mockResource: LearningResource = {
  id: 'lr_test_001',
  title: 'Test Learning Resource',
  description: 'This is a test learning resource for unit testing purposes.',
  type: 'video',
  category: 'tutorial',
  difficulty: 'beginner',
  status: 'published',
  tags: ['test', 'learning', 'react'],
  author: 'Test Author',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  version: '1.0.0',
  learningObjectives: ['Learn testing', 'Understand components'],
  prerequisites: [],
  viewCount: 150,
  completionCount: 89,
  averageRating: 4.5,
  reviewCount: 23,
  duration: 45,
  thumbnailUrl: '/test-thumbnail.jpg',
};

describe('ResourceCard', () => {
  it('renders resource information correctly', () => {
    render(<ResourceCard resource={mockResource} />);

    expect(screen.getByText('Test Learning Resource')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText(/This is a test learning resource/)).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('video')).toBeInTheDocument();
    expect(screen.getByText('150 views')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays progress bar when showProgress is true', () => {
    render(<ResourceCard resource={mockResource} showProgress={true} progress={75} />);

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();

    const progressBar = screen.getByRole('progressbar', { hidden: true });
    expect(progressBar).toHaveStyle('width: 75%');
  });

  it('handles resource click', () => {
    const mockOnClick = jest.fn();
    render(<ResourceCard resource={mockResource} onResourceClick={mockOnClick} />);

    const card = screen.getByText('Test Learning Resource').closest('div');
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith(mockResource);
  });

  it('handles bookmark toggle', () => {
    const mockOnBookmark = jest.fn();
    render(<ResourceCard resource={mockResource} onBookmark={mockOnBookmark} isBookmarked={false} />);

    const bookmarkButton = screen.getByRole('button');
    fireEvent.click(bookmarkButton);

    expect(mockOnBookmark).toHaveBeenCalledWith(mockResource.id);
  });

  it('shows bookmarked state correctly', () => {
    render(<ResourceCard resource={mockResource} onBookmark={jest.fn()} isBookmarked={true} />);

    const bookmarkButton = screen.getByRole('button');
    expect(bookmarkButton).toHaveClass('bg-yellow-500');
  });

  it('formats duration correctly', () => {
    const shortResource = { ...mockResource, duration: 30 };
    const { rerender } = render(<ResourceCard resource={shortResource} />);
    expect(screen.getByText('30m')).toBeInTheDocument();

    const longResource = { ...mockResource, duration: 120 };
    rerender(<ResourceCard resource={longResource} />);
    expect(screen.getByText('2h')).toBeInTheDocument();

    const mixedResource = { ...mockResource, duration: 90 };
    rerender(<ResourceCard resource={mixedResource} />);
    expect(screen.getByText('1h 30m')).toBeInTheDocument();
  });

  it('displays tags correctly', () => {
    render(<ResourceCard resource={mockResource} />);

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('learning')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
  });

  it('shows limited tags with overflow indicator', () => {
    const resourceWithManyTags = {
      ...mockResource,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };

    render(<ResourceCard resource={resourceWithManyTags} />);

    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ResourceCard resource={mockResource} className='custom-class' />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders without thumbnail', () => {
    const resourceWithoutThumbnail = { ...mockResource, thumbnailUrl: undefined };
    render(<ResourceCard resource={resourceWithoutThumbnail} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Test Learning Resource')).toBeInTheDocument();
  });
});
