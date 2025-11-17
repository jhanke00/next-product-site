/**
 * @jest-environment node
 */
import { GET as getCollection, POST } from '@/app/api/learning/route';
import { GET as getItem, PUT, DELETE } from '@/app/api/learning/[resourceId]/route';
import {
  GET as getByProduct,
  PUT as updateByProduct,
  DELETE as deleteByProduct,
} from '@/app/api/learning/product/[productId]/route';
import { NextRequest } from 'next/server';
import fs from 'node:fs/promises';

// Mock the file system
jest.mock('node:fs/promises');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('Learning Content API', () => {
  const mockSmallData = [
    {
      resourceId: 'learn-001',
      productId: 'prod-123',
      name: 'Getting Started Guide',
      description: 'A comprehensive guide to get you started',
      resourceURI: 'https://example.com/getting-started',
      popularityScore: 95,
    },
    {
      resourceId: 'learn-002',
      productId: 'prod-456',
      name: 'Advanced Tutorial',
      description: 'Advanced techniques and best practices',
      resourceURI: 'https://example.com/advanced',
      popularityScore: 87,
    },
  ];

  const mockLargeData = [
    {
      resourceId: 'learn-003',
      productId: 'prod-123',
      name: 'Advanced Guide',
      description: 'Advanced guide from large dataset',
      resourceURI: 'https://example.com/advanced-guide',
      popularityScore: 90,
    },
    {
      resourceId: 'learn-004',
      productId: 'prod-789',
      name: 'Expert Tutorial',
      description: 'Expert level tutorial',
      resourceURI: 'https://example.com/expert',
      popularityScore: 88,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/learning', () => {
    it('should return combined array of all learning content from both files', async () => {
      // Mock returns different data based on file path (small vs large)
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getCollection();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(4);
      // API returns large data first, then small data
      expect(data.data).toEqual([...mockLargeData, ...mockSmallData]);
    });

    it('should handle empty learning content array', async () => {
      mockFs.readFile.mockImplementation(() => Promise.resolve(JSON.stringify([])));

      const response = await getCollection();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should handle file read errors gracefully', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(getCollection()).rejects.toThrow('File not found');
    });
  });

  describe('POST /api/learning', () => {
    it('should create new learning resource in small file', async () => {
      const newResource = {
        resourceId: 'learn-005',
        productId: 'prod-789',
        name: 'API Reference',
        description: 'Complete API documentation',
        resourceURI: 'https://example.com/api-reference',
        popularityScore: 92,
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning', {
        method: 'POST',
        body: JSON.stringify(newResource),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.message).toBe('Resource added successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      const writeCall = mockFs.writeFile.mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData).toHaveLength(3); // mockSmallData (2) + new resource (1)
      expect(writtenData[2]).toEqual(newResource);
    });

    it('should handle invalid JSON in POST request', async () => {
      const request = new NextRequest('http://localhost:3000/api/learning', {
        method: 'POST',
        body: 'invalid json',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to add resource');
    });

    it('should handle file write errors', async () => {
      const newResource = {
        resourceId: 'learn-005',
        productId: 'prod-789',
        name: 'API Reference',
        description: 'Complete API documentation',
        resourceURI: 'https://example.com/api-reference',
        popularityScore: 92,
      };

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));
      mockFs.writeFile.mockRejectedValue(new Error('Write permission denied'));

      const request = new NextRequest('http://localhost:3000/api/learning', {
        method: 'POST',
        body: JSON.stringify(newResource),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to add resource');
    });
  });

  describe('GET /api/learning/[resourceId]', () => {
    it('should return correct resource by resourceId from small file', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getItem(new NextRequest('http://localhost:3000/api/learning/learn-001'), {
        params: Promise.resolve({ resourceId: 'learn-001' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockSmallData[0]);
      expect(data.data.resourceId).toBe('learn-001');
    });

    it('should return correct resource by resourceId from large file', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getItem(new NextRequest('http://localhost:3000/api/learning/learn-003'), {
        params: Promise.resolve({ resourceId: 'learn-003' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual(mockLargeData[0]);
      expect(data.data.resourceId).toBe('learn-003');
    });

    it('should return null for non-existent resource', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getItem(new NextRequest('http://localhost:3000/api/learning/learn-999'), {
        params: Promise.resolve({ resourceId: 'learn-999' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toBeNull();
    });

    it('should handle file read errors', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(
        getItem(new NextRequest('http://localhost:3000/api/learning/learn-001'), {
          params: Promise.resolve({ resourceId: 'learn-001' }),
        })
      ).rejects.toThrow('File not found');
    });
  });

  describe('PUT /api/learning/[resourceId]', () => {
    it('should update existing learning resource in small file', async () => {
      const updatedFields = {
        name: 'Updated Getting Started Guide',
        popularityScore: 98,
      };

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning/learn-001', {
        method: 'PUT',
        body: JSON.stringify(updatedFields),
      });

      const response = await PUT(request, { params: Promise.resolve({ resourceId: 'learn-001' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Resource updated successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      const writeCall = mockFs.writeFile.mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData[0].name).toBe('Updated Getting Started Guide');
      expect(writtenData[0].popularityScore).toBe(98);
      expect(writtenData[0].resourceId).toBe('learn-001'); // Should preserve resourceId
    });

    it('should update existing learning resource in large file', async () => {
      const updatedFields = {
        name: 'Updated Advanced Guide',
        popularityScore: 95,
      };

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning/learn-003', {
        method: 'PUT',
        body: JSON.stringify(updatedFields),
      });

      const response = await PUT(request, { params: Promise.resolve({ resourceId: 'learn-003' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Resource updated successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      // Should write to large file
      const writeCall = mockFs.writeFile.mock.calls[0];
      expect(writeCall[0]).toContain('large');
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData[0].name).toBe('Updated Advanced Guide');
      expect(writtenData[0].popularityScore).toBe(95);
    });

    it('should return 404 for non-existent resource', async () => {
      const updatedFields = {
        name: 'Updated Guide',
      };

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const request = new NextRequest('http://localhost:3000/api/learning/learn-999', {
        method: 'PUT',
        body: JSON.stringify(updatedFields),
      });

      const response = await PUT(request, { params: Promise.resolve({ resourceId: 'learn-999' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Resource not found');
      expect(mockFs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON in PUT request', async () => {
      const request = new NextRequest('http://localhost:3000/api/learning/learn-001', {
        method: 'PUT',
        body: 'invalid json',
      });

      const response = await PUT(request, { params: Promise.resolve({ resourceId: 'learn-001' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to update resource');
    });

    it('should handle file write errors during update', async () => {
      const updatedFields = {
        name: 'Updated Guide',
      };

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });
      mockFs.writeFile.mockRejectedValue(new Error('Write permission denied'));

      const request = new NextRequest('http://localhost:3000/api/learning/learn-001', {
        method: 'PUT',
        body: JSON.stringify(updatedFields),
      });

      const response = await PUT(request, { params: Promise.resolve({ resourceId: 'learn-001' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to update resource');
    });
  });

  describe('DELETE /api/learning/[resourceId]', () => {
    it('should remove learning resource from small file', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning/learn-001', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: Promise.resolve({ resourceId: 'learn-001' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Resource deleted successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      const writeCall = mockFs.writeFile.mock.calls[0];
      expect(writeCall[0]).toContain('small');
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData).toHaveLength(1);
      expect(writtenData[0].resourceId).toBe('learn-002');
    });

    it('should remove learning resource from large file', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning/learn-003', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: Promise.resolve({ resourceId: 'learn-003' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Resource deleted successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      const writeCall = mockFs.writeFile.mock.calls[0];
      expect(writeCall[0]).toContain('large');
      const writtenData = JSON.parse(writeCall[1] as string);
      expect(writtenData).toHaveLength(1);
      expect(writtenData[0].resourceId).toBe('learn-004');
    });

    it('should return 404 for non-existent resource', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const request = new NextRequest('http://localhost:3000/api/learning/learn-999', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: Promise.resolve({ resourceId: 'learn-999' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Resource not found');
      expect(mockFs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle file write errors during delete', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });
      mockFs.writeFile.mockRejectedValue(new Error('Write permission denied'));

      const request = new NextRequest('http://localhost:3000/api/learning/learn-001', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params: Promise.resolve({ resourceId: 'learn-001' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to delete resource');
    });
  });

  describe('GET /api/learning/product/[productId]', () => {
    it('should return all resources for a specific product', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getByProduct(new NextRequest('http://localhost:3000/api/learning/product/prod-123'), {
        params: Promise.resolve({ productId: 'prod-123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data).toHaveLength(2); // learn-001 from small, learn-003 from large
      expect(data.data.every((item: any) => item.productId === 'prod-123')).toBe(true);
    });

    it('should return empty array for product with no resources', async () => {
      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockSmallData));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getByProduct(new NextRequest('http://localhost:3000/api/learning/product/prod-999'), {
        params: Promise.resolve({ productId: 'prod-999' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('should handle deduplication when same resourceId exists in both files', async () => {
      const smallWithDuplicate = [
        ...mockSmallData,
        {
          resourceId: 'learn-003', // Same ID as in large file
          productId: 'prod-123',
          name: 'Duplicate Resource from Small',
          description: 'This should take precedence',
          resourceURI: 'https://example.com/duplicate',
          popularityScore: 99,
        },
      ];

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(smallWithDuplicate));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      const response = await getByProduct(new NextRequest('http://localhost:3000/api/learning/product/prod-123'), {
        params: Promise.resolve({ productId: 'prod-123' }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2); // Should deduplicate learn-003

      // Find the learn-003 resource
      const resource003 = data.data.find((item: any) => item.resourceId === 'learn-003');
      expect(resource003.name).toBe('Duplicate Resource from Small'); // Small file takes precedence
    });

    it('should handle file read errors', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(
        getByProduct(new NextRequest('http://localhost:3000/api/learning/product/prod-123'), {
          params: Promise.resolve({ productId: 'prod-123' }),
        })
      ).rejects.toThrow('File not found');
    });
  });

  describe('PUT /api/learning/product/[productId]', () => {
    it('should replace all resources for a product', async () => {
      const newResources = [
        {
          resourceId: 'learn-010',
          productId: 'prod-123',
          name: 'New Resource 1',
          description: 'First new resource',
          resourceURI: 'https://example.com/new1',
          popularityScore: 85,
        },
        {
          resourceId: 'learn-011',
          productId: 'prod-123',
          name: 'New Resource 2',
          description: 'Second new resource',
          resourceURI: 'https://example.com/new2',
          popularityScore: 90,
        },
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning/product/prod-123', {
        method: 'PUT',
        body: JSON.stringify(newResources),
      });

      const response = await updateByProduct(request, { params: Promise.resolve({ productId: 'prod-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Resources updated successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      const writeCall = mockFs.writeFile.mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);

      // Should remove old prod-123 resources and add new ones
      const prod123Resources = writtenData.filter((item: any) => item.productId === 'prod-123');
      expect(prod123Resources).toHaveLength(2);
      expect(prod123Resources[0].resourceId).toBe('learn-010');
      expect(prod123Resources[1].resourceId).toBe('learn-011');
    });

    it('should handle invalid JSON in PUT request', async () => {
      const request = new NextRequest('http://localhost:3000/api/learning/product/prod-123', {
        method: 'PUT',
        body: 'invalid json',
      });

      const response = await updateByProduct(request, { params: Promise.resolve({ productId: 'prod-123' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to update resources');
    });

    it('should handle file write errors', async () => {
      const newResources = [
        {
          resourceId: 'learn-010',
          productId: 'prod-123',
          name: 'New Resource',
          description: 'Test resource',
          resourceURI: 'https://example.com/new',
          popularityScore: 85,
        },
      ];

      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));
      mockFs.writeFile.mockRejectedValue(new Error('Write permission denied'));

      const request = new NextRequest('http://localhost:3000/api/learning/product/prod-123', {
        method: 'PUT',
        body: JSON.stringify(newResources),
      });

      const response = await updateByProduct(request, { params: Promise.resolve({ productId: 'prod-123' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to update resources');
    });
  });

  describe('DELETE /api/learning/product/[productId]', () => {
    it('should delete all resources for a product', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));
      mockFs.writeFile.mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/learning/product/prod-123', {
        method: 'DELETE',
      });

      const response = await deleteByProduct(request, { params: Promise.resolve({ productId: 'prod-123' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Resources deleted successfully');
      expect(mockFs.writeFile).toHaveBeenCalled();

      const writeCall = mockFs.writeFile.mock.calls[0];
      const writtenData = JSON.parse(writeCall[1] as string);

      // Should only have learn-002 left (prod-456)
      expect(writtenData).toHaveLength(1);
      expect(writtenData[0].productId).toBe('prod-456');
    });

    it('should return 404 when no resources found for product', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));

      const request = new NextRequest('http://localhost:3000/api/learning/product/prod-999', {
        method: 'DELETE',
      });

      const response = await deleteByProduct(request, { params: Promise.resolve({ productId: 'prod-999' }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('No resources found for this product');
      expect(mockFs.writeFile).not.toHaveBeenCalled();
    });

    it('should handle file write errors', async () => {
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockSmallData));
      mockFs.writeFile.mockRejectedValue(new Error('Write permission denied'));

      const request = new NextRequest('http://localhost:3000/api/learning/product/prod-123', {
        method: 'DELETE',
      });

      const response = await deleteByProduct(request, { params: Promise.resolve({ productId: 'prod-123' }) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to delete resources');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full CRUD cycle', async () => {
      let mockDataSmall = [...mockSmallData];
      let mockDataLarge = [...mockLargeData];

      // Create
      const newResource = {
        resourceId: 'learn-005',
        productId: 'prod-789',
        name: 'API Reference',
        description: 'Complete API documentation',
        resourceURI: 'https://example.com/api-reference',
        popularityScore: 92,
      };

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockDataSmall));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockDataLarge));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      mockFs.writeFile.mockImplementation(async (path: any, data: any) => {
        if (path.includes('small')) {
          mockDataSmall = JSON.parse(data as string);
        } else if (path.includes('large')) {
          mockDataLarge = JSON.parse(data as string);
        }
      });

      const createRequest = new NextRequest('http://localhost:3000/api/learning', {
        method: 'POST',
        body: JSON.stringify(newResource),
      });
      const createResponse = await POST(createRequest);
      expect(createResponse.status).toBe(201);

      // Read (after create)
      const readResponse = await getItem(new NextRequest('http://localhost:3000/api/learning/learn-005'), {
        params: Promise.resolve({ resourceId: 'learn-005' }),
      });
      const readData = await readResponse.json();
      expect(readData.data.resourceId).toBe('learn-005');

      // Update
      const updateRequest = new NextRequest('http://localhost:3000/api/learning/learn-005', {
        method: 'PUT',
        body: JSON.stringify({ popularityScore: 99 }),
      });
      const updateResponse = await PUT(updateRequest, { params: Promise.resolve({ resourceId: 'learn-005' }) });
      expect(updateResponse.status).toBe(200);

      // Delete
      const deleteRequest = new NextRequest('http://localhost:3000/api/learning/learn-005', {
        method: 'DELETE',
      });
      const deleteResponse = await DELETE(deleteRequest, { params: Promise.resolve({ resourceId: 'learn-005' }) });
      expect(deleteResponse.status).toBe(200);
    });

    it('should handle empty data files', async () => {
      mockFs.readFile.mockImplementation(() => Promise.resolve(JSON.stringify([])));

      const response = await getCollection();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
    });

    it('should handle product-based operations', async () => {
      let mockDataSmall = [...mockSmallData];

      mockFs.readFile.mockImplementation((path: any) => {
        if (path.includes('small')) {
          return Promise.resolve(JSON.stringify(mockDataSmall));
        } else if (path.includes('large')) {
          return Promise.resolve(JSON.stringify(mockLargeData));
        }
        return Promise.resolve(JSON.stringify([]));
      });

      mockFs.writeFile.mockImplementation(async (path: any, data: any) => {
        if (path.includes('small')) {
          mockDataSmall = JSON.parse(data as string);
        }
      });

      // Get resources by product
      const getResponse = await getByProduct(new NextRequest('http://localhost:3000/api/learning/product/prod-123'), {
        params: Promise.resolve({ productId: 'prod-123' }),
      });
      const getData = await getResponse.json();
      expect(getData.data).toHaveLength(2); // One from small, one from large

      // Update all resources for a product
      const newResources = [
        {
          resourceId: 'learn-020',
          productId: 'prod-123',
          name: 'Completely New Guide',
          description: 'Brand new documentation',
          resourceURI: 'https://example.com/brand-new',
          popularityScore: 100,
        },
      ];

      const updateRequest = new NextRequest('http://localhost:3000/api/learning/product/prod-123', {
        method: 'PUT',
        body: JSON.stringify(newResources),
      });
      const updateResponse = await updateByProduct(updateRequest, {
        params: Promise.resolve({ productId: 'prod-123' }),
      });
      expect(updateResponse.status).toBe(200);

      // Verify the update
      const verifyResponse = await getByProduct(
        new NextRequest('http://localhost:3000/api/learning/product/prod-123'),
        { params: Promise.resolve({ productId: 'prod-123' }) }
      );
      const verifyData = await verifyResponse.json();
      // Only the new resource from small file should exist (large file is unchanged)
      const smallFileResources = verifyData.data.filter((item: any) => item.resourceId === 'learn-020');
      expect(smallFileResources).toHaveLength(1);
    });
  });
});
