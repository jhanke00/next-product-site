// Utility to filter resources by productId
import { LearningResource } from '../type/products';

export function filterResourcesByProduct(resources: LearningResource[], productId: string) {
  return resources.filter((r) => r.productId === productId);
}
