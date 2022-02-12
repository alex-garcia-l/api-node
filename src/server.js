const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { createServer } = require('http');

const {
  APP_PORT,
  SERVER_PATH,
  SERVER_API_PATH,
  RELATIVE_API_PATH
} = require('./config/app');
const { connectDB } = require('./database/configMongoDB');
const { socketController } = require('./sockets/SocketController');

class Server {

  constructor() {
    this.app = express();
    this.port = APP_PORT;
    this.server = createServer(this.app);
    this.io = require('socket.io')(this.server);

    this.paths = {
      auth: this.getPath('/auth'),
      categories: this.getPath('/categories'),
      products: this.getPath('/products'),
      search: this.getPath('/search'),
      uploads: this.getPath('/uploads'),
      users: this.getPath('/users'),
    }

    this.connectDB();
    this.middlewares();
    this.routes();
    this.sockets();
  }

  async connectDB() {
    await connectDB();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: '/uploads/',
      createParentPath: true
    }));
  }

  routes() {
    this.app.use(this.paths.auth, require('./routes/api/authRoutes'));
    this.app.use(this.paths.categories, require('./routes/api/categoryRoutes'));
    this.app.use(this.paths.products, require('./routes/api/productRoutes'));
    this.app.use(this.paths.search, require('./routes/api/searchRoutes'));
    this.app.use(this.paths.uploads, require('./routes/api/uploadRoutes'));
    this.app.use(this.paths.users, require('./routes/api/userRoutes'));

    this.app.use('*', (req, res) => {
      res.send('Not route');
    });
  }

  sockets() {
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log('');
      console.log('############################');
      console.log('###### SERVER RUNNING ######');
      console.log('############################');
      console.log('');
      console.log(`Path: ${SERVER_PATH}`);
      console.log(`Path API: ${SERVER_API_PATH}`);
      console.log(`Application running on port: ${this.port}`);
      console.log('');
    });
  }

  getPath(url) {
    return RELATIVE_API_PATH + url;
  }
}

module.exports = Server;
