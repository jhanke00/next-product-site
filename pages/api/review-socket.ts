// pages/api/review-socket.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { registerSocketIO } from '@/src/lib/reviewEvents';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: any;
  }
) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new IOServer(httpServer, {
      path: '/api/review-socket',
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
    registerSocketIO(io);
  }

  res.end();
}
