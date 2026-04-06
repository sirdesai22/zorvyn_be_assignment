import 'dotenv/config';
import app from './app';
import { seed } from './data/seed';

const PORT = process.env.PORT || 3000;

async function start(): Promise<void> {
  await seed();
  app.listen(PORT, () => {
    console.log(`Finance Dashboard API running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
