import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface Client {
  ws: WebSocket;
  subscriptions: Set<string>;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<Client> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      const client: Client = {
        ws,
        subscriptions: new Set(),
      };

      this.clients.add(client);
      console.log('WebSocket client connected');

      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(client, message);
        } catch (error) {
          console.error('Invalid WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(client);
        console.log('WebSocket client disconnected');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private handleMessage(client: Client, message: any) {
    const { type, data } = message;

    switch (type) {
      case 'subscribe':
        if (data.marketId) {
          client.subscriptions.add(`market:${data.marketId}`);
        }
        break;
      case 'unsubscribe':
        if (data.marketId) {
          client.subscriptions.delete(`market:${data.marketId}`);
        }
        break;
      case 'ping':
        client.ws.send(JSON.stringify({ type: 'pong' }));
        break;
    }
  }

  // Broadcast to all clients subscribed to a specific channel
  broadcast(channel: string, data: any) {
    const message = JSON.stringify({ channel, data });
    
    this.clients.forEach((client) => {
      if (client.subscriptions.has(channel) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  // Broadcast market updates
  broadcastMarketUpdate(marketId: number, data: any) {
    this.broadcast(`market:${marketId}`, {
      type: 'market_update',
      marketId,
      ...data,
    });
  }

  // Broadcast new order
  broadcastNewOrder(marketId: number, order: any) {
    this.broadcast(`market:${marketId}`, {
      type: 'new_order',
      order,
    });
  }

  // Broadcast new trade
  broadcastNewTrade(marketId: number, trade: any) {
    this.broadcast(`market:${marketId}`, {
      type: 'new_trade',
      trade,
    });
  }

  // Broadcast market resolution
  broadcastMarketResolution(marketId: number, winningOutcomeId: number) {
    this.broadcast(`market:${marketId}`, {
      type: 'market_resolved',
      marketId,
      winningOutcomeId,
    });
  }
}

let wsService: WebSocketService | null = null;

export function initWebSocket(server: Server): WebSocketService {
  if (!wsService) {
    wsService = new WebSocketService(server);
  }
  return wsService;
}

export function getWebSocketService(): WebSocketService | null {
  return wsService;
}
