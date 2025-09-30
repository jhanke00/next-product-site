import React from 'react';
import { LearningResource } from '@/src/type/products';
import { View } from './view';

// Using dynamic rendering to demonstrate successful build without requiring running backend server
export const dynamic = 'force-dynamic';

async function getResources(): Promise<LearningResource[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/learning-resources`, {
      cache: 'default',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    // Return empty array in case of error
    return [];
  }
}

const LMSPage = async () => {
  const resources = await getResources();
  return <View resources={resources} />;
};

export default LMSPage;
