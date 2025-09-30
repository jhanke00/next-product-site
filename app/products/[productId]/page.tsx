import React from 'react';
import { ProductDetails, LearningResource, Product } from '@/src/type/products';
import { View } from './view';

// Function to transform basic product to detailed product
function createProductDetails(baseProduct: Product): ProductDetails {
  return {
    ...baseProduct,
    detailedDescription: `${baseProduct.description} This product is manufactured at our state-of-the-art facility with the highest quality standards and environmental safety protocols.`,
    usageInstructions:
      'Please follow all safety guidelines and local regulations when using this product. Consult with agricultural specialists for optimal application rates and timing.',
    activeIngredients: [
      {
        name: baseProduct.name,
        description: `Primary active component in ${baseProduct.name}`,
        percentage: 85,
      },
    ],
    manufacturingSite: {
      name: 'Bayer Vapi',
      location: 'Vapi, India',
      plantsCount: 13,
      activeIngredientsCount: 11,
      intermediatesCount: 11,
    },
  };
}

async function getProduct(productId: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${productId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getAssignedResources(
  productId: string
): Promise<{ resources: LearningResource[]; customGuide: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Get assignments for the product
    const assignmentResponse = await fetch(`${baseUrl}/api/products/${productId}/assignments`, {
      cache: 'no-store',
    });

    if (!assignmentResponse.ok) {
      return { resources: [], customGuide: '' };
    }

    const assignment = await assignmentResponse.json();

    // Get all available resources
    const resourcesResponse = await fetch(`${baseUrl}/api/learning-resources`, {
      cache: 'no-store',
    });

    if (!resourcesResponse.ok) {
      return { resources: [], customGuide: assignment.customGuide || '' };
    }

    const allResources = await resourcesResponse.json();

    // Filter only assigned resources, exclude non-existing ones
    const assignedResources = allResources.filter((resource: LearningResource) =>
      assignment.assignedResources.includes(resource.id)
    );

    // Check for missing resources for debugging
    const missingResources = assignment.assignedResources.filter(
      (resourceId: string) => !allResources.some((resource: LearningResource) => resource.id === resourceId)
    );

    if (missingResources.length > 0) {
      console.warn(`Product ${productId} has missing resources:`, missingResources);
    }

    return {
      resources: assignedResources,
      customGuide: assignment.customGuide || '',
    };
  } catch (error) {
    console.error('Error fetching assigned resources:', error);
    return { resources: [], customGuide: '' };
  }
}

const ProductDetail = async ({ params }: { params: Promise<{ productId: string }> }) => {
  const resolvedParams = await params;

  // Get basic product from API
  const baseProduct = await getProduct(resolvedParams.productId);

  if (!baseProduct) {
    return <p>Product not Found</p>;
  }

  // Transform to detailed product
  const detailedProduct = createProductDetails(baseProduct);

  // Get assigned resources
  const { resources, customGuide } = await getAssignedResources(resolvedParams.productId);

  // Add resources to product
  const productWithResources = {
    ...detailedProduct,
    learningResources: resources,
    customGuide,
  };

  return <View product={productWithResources} />;
};

export default ProductDetail;
