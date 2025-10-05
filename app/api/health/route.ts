import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if the application is healthy
    // You could add more comprehensive health checks here:
    // - Database connectivity
    // - External service availability
    // - File system access
    // - Memory usage, etc.

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        api: 'operational',
        storage: 'operational',
        // Add more service checks as needed
      },
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
    };

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    const errorStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorStatus, { status: 503 });
  }
}
