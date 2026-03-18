import { Request, Response, NextFunction } from 'express';
import { PostService }  from '../services/post.service';
import { AppError }     from '../middlewares/error.middleware';
import { sendSuccess }  from '../utils/response';
import { PostStatus }   from '../types/blog.types';

export class PostController {
  constructor(private service: PostService) {}

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, categoryId, tag, author, search, page, limit }
        = req.query as Record<string, string>;

      const result = await this.service.getPosts(
        { status: status as PostStatus, categoryId, tag, author, search },
        parseInt(page)  || 1,
        parseInt(limit) || 10
      );
      sendSuccess(res, result);
    } catch (err) { next(err); }
  };

  getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.getStats());
    } catch (err) { next(err); }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.getBySlug(String(req.params.slug));
      if (!post) throw new AppError('Article introuvable', 404);
      sendSuccess(res, post);
    } catch (err) { next(err); }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.getById(String(req.params.id));
      if (!post) throw new AppError('Article introuvable', 404);
      sendSuccess(res, post);
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.create(req.body), 201);
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.update(String(req.params.id), req.body);
      if (!post) throw new AppError('Article introuvable', 404);
      sendSuccess(res, post);
    } catch (err) { next(err); }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.delete(String(req.params.id));
      if (!deleted) throw new AppError('Article introuvable', 404);
      sendSuccess(res, { message: 'Article supprimé' });
    } catch (err) { next(err); }
  };

  publish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.publish(String(req.params.id));
      if (!post) throw new AppError('Article introuvable', 404);
      sendSuccess(res, post);
    } catch (err) { next(err); }
  };

  archive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const post = await this.service.archive(String(req.params.id));
      if (!post) throw new AppError('Article introuvable', 404);
      sendSuccess(res, post);
    } catch (err) { next(err); }
  };
}