import { Meta, StoryObj } from '@storybook/nextjs';
import { ResourceCard } from './ResourceCard';
import type { LearningResource } from '@/src/type/products';

const meta = {
  title: 'Components/Learning/ResourceCard',
  component: ResourceCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Learning resource card component used in LMS to display training modules and tutorials with files information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    resource: {
      description: 'Learning resource data object containing title, description, type, duration, and files',
    },
    onDelete: {
      description: 'Callback function called when delete button is clicked',
    },
    showDeleteButton: {
      description: 'Whether to show the delete button',
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ResourceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock function for onDelete
const mockOnDelete = (id: string) => {
  console.log('Delete clicked for resource:', id);
};

// Mock learning resource data
const mockTrainingResource: LearningResource = {
  id: 'resource-1',
  title: 'Advanced Herbicide Application Training',
  description: 'Comprehensive training module covering advanced application techniques and troubleshooting',
  type: 'training',
  duration: '45 minutes',
  files: [
    {
      id: 'file-1',
      name: 'videoplayback-1.mp4',
      url: '/media/videoplayback-1.mp4',
      type: 'video',
    },
  ],
  createdAt: new Date('2025-01-26T10:00:00.000Z'),
};

const mockTutorialResource: LearningResource = {
  id: 'resource-2',
  title: 'Safety Guidelines Manual',
  description: 'Complete safety information and handling procedures for all products',
  type: 'tutorial',
  files: [
    {
      id: 'file-2',
      name: 'pdf-1.pdf',
      url: '/media/pdf-1.pdf',
      type: 'pdf',
    },
    {
      id: 'file-3',
      name: 'pdf-2.pdf',
      url: '/media/pdf-2.pdf',
      type: 'pdf',
    },
  ],
  createdAt: new Date('2025-01-26T09:30:00.000Z'),
};

export const TrainingModule: Story = {
  args: {
    resource: mockTrainingResource,
    onDelete: mockOnDelete,
    showDeleteButton: true,
  },
};

export const Tutorial: Story = {
  args: {
    resource: mockTutorialResource,
    onDelete: mockOnDelete,
    showDeleteButton: true,
  },
};

export const WithoutDeleteButton: Story = {
  args: {
    resource: mockTrainingResource,
    onDelete: mockOnDelete,
    showDeleteButton: false,
  },
};

export const NoFiles: Story = {
  args: {
    resource: {
      ...mockTrainingResource,
      files: [],
    },
    onDelete: mockOnDelete,
    showDeleteButton: true,
  },
};

export const ShortDuration: Story = {
  args: {
    resource: {
      ...mockTrainingResource,
      title: 'Quick Introduction',
      description: 'Brief overview of basic concepts',
      duration: '5 minutes',
    },
    onDelete: mockOnDelete,
    showDeleteButton: true,
  },
};

export const LongDescription: Story = {
  args: {
    resource: {
      ...mockTutorialResource,
      title: 'Comprehensive Safety and Handling Procedures Manual',
      description:
        'This is an extensive and detailed manual covering all aspects of safety protocols, emergency procedures, handling guidelines, storage requirements, and regulatory compliance for pharmaceutical and chemical products. It includes step-by-step instructions and best practices.',
      files: [
        {
          id: 'file-4',
          name: 'comprehensive-safety-manual-v2.pdf',
          url: '/media/comprehensive-safety-manual-v2.pdf',
          type: 'pdf',
        },
      ],
    },
    onDelete: mockOnDelete,
    showDeleteButton: true,
  },
};

export const MultipleFiles: Story = {
  args: {
    resource: {
      ...mockTutorialResource,
      title: 'Complete Product Documentation',
      description:
        'Full documentation package including safety data sheets, technical specifications, and usage guidelines',
      files: [
        {
          id: 'file-5',
          name: 'safety-data-sheet.pdf',
          url: '/media/safety-data-sheet.pdf',
          type: 'pdf',
        },
        {
          id: 'file-6',
          name: 'technical-specifications.pdf',
          url: '/media/technical-specifications.pdf',
          type: 'pdf',
        },
        {
          id: 'file-7',
          name: 'usage-guidelines.pdf',
          url: '/media/usage-guidelines.pdf',
          type: 'pdf',
        },
        {
          id: 'file-8',
          name: 'regulatory-compliance.pdf',
          url: '/media/regulatory-compliance.pdf',
          type: 'pdf',
        },
      ],
    },
    onDelete: mockOnDelete,
    showDeleteButton: true,
  },
};
