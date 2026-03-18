import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { AppError }        from '../middlewares/error.middleware';
import { sendSuccess }     from '../utils/response';

export class CategoryController {
  constructor(private service: CategoryService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.getAll());
    } catch (err) { next(err); }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.service.getBySlug(String(req.params.slug));
      if (!category) throw new AppError('Catégorie introuvable', 404);
      sendSuccess(res, category);
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.create(req.body), 201);
    } catch (err) { next(err); }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.service.update(String(req.params.id), req.body);
      if (!category) throw new AppError('Catégorie introuvable', 404);
      sendSuccess(res, category);
    } catch (err) { next(err); }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.delete(String(req.params.id));
      if (!deleted) throw new AppError('Catégorie introuvable', 404);
      sendSuccess(res, { message: 'Catégorie supprimée' });
    } catch (err) { next(err); }
  };
}