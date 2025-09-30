import React from 'react';
import { LearningResource } from '@/src/type/products';
import { View } from './view';

interface ProductAssignment {
  productId: number;
  assignedResources: string[];
  customGuide?: string;
  updatedAt: string;
}

async function getResources(): Promise<LearningResource[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/learning-resources`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    return [];
  }
}

async function getProductAssignment(productId: string): Promise<ProductAssignment> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${productId}/assignments`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product assignment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product assignment:', error);
    return {
      productId: parseInt(productId),
      assignedResources: [],
      customGuide: '',
      updatedAt: new Date().toISOString(),
    };
  }
}

const AssignResourcesPage = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = await params;
  const { productId } = resolvedParams;

  const [resources, assignment] = await Promise.all([getResources(), getProductAssignment(productId)]);

  return <View productId={parseInt(productId)} resources={resources} assignment={assignment} />;
};

export default AssignResourcesPage;
