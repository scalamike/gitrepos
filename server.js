const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3113;

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/test.html') {
    // Serve test HTML
    const filePath = path.join(__dirname, 'test.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading test.html');
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  } else {
    // For any non-upgraded request, ask for upgrade
    res.writeHead(426, { 'Content-Type': 'text/plain' });
    res.end('Upgrade required for WebSocket');
  }
});

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`✅ WebSocket connected from ${ip}`);

  ws.send('👋 Hello from server');

  ws.on('message', (message) => {
    console.log('📨 Received:', message.toString());
    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log(`❌ WebSocket disconnected from ${ip}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
