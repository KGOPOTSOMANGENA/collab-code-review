import WebSocket from 'ws';

let wss: WebSocket.Server;

export const setWSS = (server: WebSocket.Server) => {
  wss = server;
};

// Optional: get the WebSocket server if you need it in other files
export const getWSS = () => wss;

// Broadcast to all connected clients
export const broadcast = (type: string, data: any) => {
  if (!wss) return;
  const message = JSON.stringify({ type, data });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

