import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection } from 'typeorm';

import routes from './routes';

class Server {
  private port: number;
  private host: string;
  private server: express.Application;

  constructor(config: { port: number; host?: string }) {
    console.log('Server starting...');

    this.port = config.port;
    this.host = config.host || 'localhost';
    this.server = express();
  }

  private setMiddlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

    this.server.use(express.static('public'));
  }

  private setRoutes() {
    this.server.use('/', routes);

    // Handlle invalids paths
    this.server.get('*', (req, res) => {
      res.redirect('/api');
    });
  }

  private connectDb(): void {
    console.log('Check database connection...');

    createConnection().then(() => {
      console.log('Connection OK');
    });
  }

  start(): void {
    this.setMiddlewares();
    this.setRoutes();

    this.server.listen(this.port, this.host, () => {
      console.log(`Server started on http://localhost:${this.port}`);
      this.connectDb();
    });
  }
}

export default Server;
