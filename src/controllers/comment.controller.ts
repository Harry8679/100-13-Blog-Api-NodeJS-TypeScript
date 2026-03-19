import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/comment.service';
import { AppError }       from '../middlewares/error.middleware';
import { sendSuccess }    from '../utils/response';

export class CommentController {
  constructor(private service: CommentService) {}

  getByPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.getByPostId(String(req.params.postId)));
    } catch (err) { next(err); }
  };

  getPending = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.getPending());
    } catch (err) { next(err); }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      sendSuccess(res, await this.service.create(req.body), 201);
    } catch (err) { next(err); }
  };

  approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const comment = await this.service.approve(String(req.params.id));
      if (!comment) throw new AppError('Commentaire introuvable', 404);
      sendSuccess(res, comment);
    } catch (err) { next(err); }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.delete(String(req.params.id));
      if (!deleted) throw new AppError('Commentaire introuvable', 404);
      sendSuccess(res, { message: 'Commentaire supprimé' });
    } catch (err) { next(err); }
  };
}