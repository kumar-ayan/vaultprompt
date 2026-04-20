import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.log(`Server is running at http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close((error) => {
    if (error) {
      console.error('Error while closing the server:', error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
