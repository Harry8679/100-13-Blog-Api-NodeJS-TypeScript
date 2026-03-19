import dotenv    from 'dotenv';
dotenv.config();
import createApp from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app  = createApp();

app.listen(PORT, () => {
  console.log('╔══════════════════════════════╗');
  console.log('║   📰 Blog API v1.0            ║');
  console.log(`║   http://localhost:${PORT}       ║`);
  console.log('╚══════════════════════════════╝');
});