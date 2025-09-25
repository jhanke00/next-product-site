// import users from '@mock/small/users.json';
// import orders from '@mock/small/orders.json';
import usersLarge from '@mock/large/users.json';
import ordersLarge from '@mock/large/orders.json';
import { User } from '@type/users';
import { Order, Item } from '@type/orders';

interface PaginatedResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Convert string dates to Date objects
const processedOrdersLarge: Order[] = (ordersLarge as any[]).map((order) => ({
  ...order,
  time: new Date(order.time),
  items: order.items.map((item: any) => ({
    ...item,
    price: Number(item.price),
  })),
}));

// Index for faster user lookups
const userIndex = new Map(usersLarge.map((user: User) => [user.id, user]));

// Index for faster order lookups by user
const ordersByUserIndex = processedOrdersLarge.reduce((acc, order) => {
  if (!acc.has(order.user)) {
    acc.set(order.user, []);
  }
  acc.get(order.user)!.push(order);
  return acc;
}, new Map<string, Order[]>());

// Index for faster total spent lookups by user
const totalSpentByUserIndex = processedOrdersLarge.reduce((acc, order) => {
  acc.set(order.user, (acc.get(order.user) || 0) + order.total);
  return acc;
}, new Map<string, number>());

/**
 * Retrieves a user by their ID
 * @param userId - The ID of the user to retrieve
 * @returns A Promise that resolves to the User object or undefined if not found
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  return userIndex.get(userId);
}

/**
 * Retrieves paginated orders for a specific user
 * @param userId - The ID of the user whose orders to retrieve
 * @param page - The page number (default: 1)
 * @param limit - The number of items per page (default: 10)
 * @returns A Promise that resolves to a PaginatedResult containing the user's orders
 */
export async function getOrdersByUserId(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResult<Order>> {
  const userOrders = ordersByUserIndex.get(userId) || [];
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedOrders = userOrders.slice(startIndex, endIndex);

  return {
    data: paginatedOrders,
    currentPage: page,
    totalPages: Math.ceil(userOrders.length / limit),
    totalItems: userOrders.length,
  };
}

/**
 * Calculates the total amount spent by a specific user
 * @param userId - The ID of the user whose total spent to calculate
 * @returns A Promise that resolves to the total amount spent by the user
 */
export async function getTotalSpentByUserId(userId: string): Promise<number> {
  return totalSpentByUserIndex.get(userId) || 0;
}
