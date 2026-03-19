import express, { Application } from 'express';
import { loggerMiddleware }     from './middlewares/logger.middleware';
import { errorMiddleware }      from './middlewares/error.middleware';
import routes                   from './routes/index.routes';

const createApp = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);

  app.use('/api', routes);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: '📰 Blog API v1.0',
      endpoints: {
        categories: '/api/categories',
        posts:      '/api/posts',
        comments:   '/api/comments',
        stats:      '/api/posts/stats',
      },
    });
  });

  app.use(errorMiddleware);
  return app;
};

export default createApp;