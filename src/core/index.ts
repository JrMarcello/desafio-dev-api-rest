import Server from './server';

try {
  const server: Server = new Server({
    port: 3000,
    host: '0.0.0.0',
  });

  server.start();
} catch (error) {
  console.log('[SERVER ERROR]', error);
}
