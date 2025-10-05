/**
 * @jest-environment node
 */

import { GET, POST } from '@/app/api/learning-resources/route';
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Mock fs module
jest.mock('fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('/api/learning-resources', () => {
  const mockLearningResources = [
    {
      id: 'lr_test_001',
      title: 'Test Resource',
      description: 'A test learning resource',
      type: 'video' as const,
      category: 'tutorial' as const,
      difficulty: 'beginner' as const,
      status: 'published' as const,
      tags: ['test', 'mock'],
      author: 'Test Author',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      version: '1.0.0',
      learningObjectives: ['Test objective'],
      prerequisites: [],
      viewCount: 10,
      completionCount: 5,
      averageRating: 4.5,
      reviewCount: 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/learning-resources', () => {
    it('should return learning resources successfully', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockLearningResources));
      mockFs.access.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning-resources');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.resources).toHaveLength(1);
      expect(data.data.resources[0].title).toBe('Test Resource');
    });

    it('should handle search query', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockLearningResources));
      mockFs.access.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning-resources?query=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.resources).toHaveLength(1);
    });

    it('should filter by type', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockLearningResources));
      mockFs.access.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning-resources?types=video');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.resources).toHaveLength(1);
    });

    it('should return empty array when no file exists', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));
      mockFs.access.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning-resources');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.resources).toHaveLength(0);
    });

    it('should handle file system errors', async () => {
      mockFs.access.mockRejectedValue(new Error('Permission denied'));

      const request = new NextRequest('http://localhost:3000/api/learning-resources');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error?.code).toBe('FETCH_ERROR');
    });
  });

  describe('POST /api/learning-resources', () => {
    it('should create a new learning resource', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify([]));
      mockFs.access.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const newResource = {
        title: 'New Test Resource',
        description: 'A new test resource',
        type: 'pdf',
        category: 'guide',
        difficulty: 'intermediate',
        author: 'Test Author',
      };

      const request = new NextRequest('http://localhost:3000/api/learning-resources', {
        method: 'POST',
        body: JSON.stringify(newResource),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('New Test Resource');
      expect(data.data.id).toBeDefined();
      expect(data.data.createdAt).toBeDefined();
    });

    it('should validate required fields', async () => {
      const incompleteResource = {
        title: 'Incomplete Resource',
        // Missing required fields
      };

      const request = new NextRequest('http://localhost:3000/api/learning-resources', {
        method: 'POST',
        body: JSON.stringify(incompleteResource),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error?.code).toBe('VALIDATION_ERROR');
      expect(data.error?.details.missingFields).toContain('description');
    });

    it('should handle file system errors during creation', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify([]));
      mockFs.access.mockResolvedValue(undefined);
      mockFs.writeFile.mockRejectedValue(new Error('Disk full'));

      const newResource = {
        title: 'Test Resource',
        description: 'A test resource',
        type: 'video',
        category: 'tutorial',
        difficulty: 'beginner',
        author: 'Test Author',
      };

      const request = new NextRequest('http://localhost:3000/api/learning-resources', {
        method: 'POST',
        body: JSON.stringify(newResource),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error?.code).toBe('CREATE_ERROR');
    });
  });
});
