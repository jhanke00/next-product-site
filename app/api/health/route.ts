import { NextResponse } from 'next/server';
import { HealthCheckResponse } from '../types';

export async function GET() {
  const response: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  };

  return NextResponse.json(response, { status: 200 });
}
