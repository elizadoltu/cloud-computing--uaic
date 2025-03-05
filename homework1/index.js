const http = require('http');
const { connectToDatabase } = require('./config/database');
const handleCarRoutes = require('./routes/carRoutes');

const PORT = 3000;

const server = http.createServer((req, res) => {
  handleCarRoutes(req, res);
});

async function startServer() {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
