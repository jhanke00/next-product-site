import { NextRequest, NextResponse } from 'next/server';
import { Order, OrderItem, ShippingAddress } from '@/src/type/orders';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// In-memory storage for demo purposes
// In production, you would use a proper database
let orders: Order[] = [];
interface StoredCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  lastOrderId: string;
  orderHistory: string[];
  createdAt: string;
  updatedAt: string;
}

let customers: StoredCustomer[] = [];

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'mock', 'generated', 'orders.json');
const CUSTOMERS_FILE_PATH = path.join(process.cwd(), 'src', 'mock', 'generated', 'customers.json');

function hydrateOrder(order: any): Order {
  return {
    ...order,
    createdAt: new Date(order.createdAt),
    updatedAt: new Date(order.updatedAt),
  };
}

function loadOrdersFromFile() {
  try {
    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      return;
    }

    const fileContents = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
    const parsed: Order[] = JSON.parse(fileContents);
    orders = parsed.map(hydrateOrder);
  } catch (error) {
    console.error('Failed to load orders from file:', error);
  }
}

function persistOrdersToFile() {
  try {
    const directory = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const serialisable = orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));

    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(serialisable, null, 2));
  } catch (error) {
    console.error('Failed to persist orders to file:', error);
  }
}

function loadCustomersFromFile() {
  try {
    if (!fs.existsSync(CUSTOMERS_FILE_PATH)) {
      return;
    }

    const fileContents = fs.readFileSync(CUSTOMERS_FILE_PATH, 'utf-8');
    customers = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load customers from file:', error);
  }
}

function persistCustomersToFile() {
  try {
    const directory = path.dirname(CUSTOMERS_FILE_PATH);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(CUSTOMERS_FILE_PATH, JSON.stringify(customers, null, 2));
  } catch (error) {
    console.error('Failed to persist customers to file:', error);
  }
}

function upsertCustomerFromShipping(shippingAddress: ShippingAddress, orderId: string) {
  loadCustomersFromFile();

  const existing = customers.find((customer) => customer.email === shippingAddress.email);
  const nowIso = new Date().toISOString();

  if (existing) {
    existing.firstName = shippingAddress.firstName;
    existing.lastName = shippingAddress.lastName;
    existing.phone = shippingAddress.phone;
    existing.address = shippingAddress.address;
    existing.city = shippingAddress.city;
    existing.state = shippingAddress.state;
    existing.zipCode = shippingAddress.zipCode;
    existing.country = shippingAddress.country;
    existing.lastOrderId = orderId;
    existing.updatedAt = nowIso;

    if (!existing.orderHistory.includes(orderId)) {
      existing.orderHistory.push(orderId);
    }
  } else {
    const newCustomer: StoredCustomer = {
      id: randomUUID(),
      firstName: shippingAddress.firstName,
      lastName: shippingAddress.lastName,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zipCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      lastOrderId: orderId,
      orderHistory: [orderId],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    customers.push(newCustomer);
  }

  persistCustomersToFile();
}

loadOrdersFromFile();
loadCustomersFromFile();

function generateOrderId(): string {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function generateOrderNumber(): string {
  const prefix = 'PS';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    if (paymentMethod !== 'cod') {
      return NextResponse.json({ error: 'Only Cash on Delivery payment method is supported' }, { status: 400 });
    }

    // Validate shipping address fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return NextResponse.json({ error: `Shipping address ${field} is required` }, { status: 400 });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingAddress.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Validate totals
    if (typeof subtotal !== 'number' || subtotal <= 0) {
      return NextResponse.json({ error: 'Invalid subtotal' }, { status: 400 });
    }

    // Create new order
    const orderId = generateOrderId();
    const orderNumber = generateOrderNumber();
    const now = new Date();

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      items: items.map(
        (item: any): OrderItem => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
          image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center&sig=${item.id}`,
        })
      ),
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country || 'United States',
      },
      paymentMethod: 'cod',
      subtotal: Number(subtotal.toFixed(2)),
      shipping: Number((shipping || 0).toFixed(2)),
      tax: Number((tax || 0).toFixed(2)),
      total: Number(total.toFixed(2)),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    // Store the order
    orders.push(newOrder);
    persistOrdersToFile();
    upsertCustomerFromShipping(newOrder.shippingAddress, newOrder.id);

    // Log order creation (in production, you'd want proper logging)
    console.log(`Order created: ${orderNumber} for ${shippingAddress.email}`);

    // In a real application, you would:
    // 1. Save to database
    // 2. Process payment
    // 3. Send confirmation email
    // 4. Update inventory
    // 5. Trigger fulfillment process

    // Return the order
    const responseOrder = {
      ...newOrder,
    };

    return NextResponse.json(responseOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    loadOrdersFromFile();
    loadCustomersFromFile();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      // Get specific order
      const order = orders.find((o) => o.id === orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Return order
      const responseOrder = {
        ...order,
      };

      return NextResponse.json(responseOrder);
    } else {
      // Get all orders (for admin purposes)
      const responseOrders = orders.map((order) => ({
        ...order,
      }));

      return NextResponse.json({
        orders: responseOrders,
        total: orders.length,
      });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
