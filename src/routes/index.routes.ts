import { Router }              from 'express';
import { CategoryService }     from '../services/category.service';
import { PostService }         from '../services/post.service';
import { CommentService }      from '../services/comment.service';
import { CategoryController }  from '../controllers/category.controller';
import { PostController }      from '../controllers/post.controller';
import { CommentController }   from '../controllers/comment.controller';
import { validate }            from '../middlewares/validate.middleware';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  CreatePostSchema,
  UpdatePostSchema,
  CreateCommentSchema,
} from '../schemas/blog.schema';

const router = Router();

// ─── Services & Controllers ───────────────────────────
const categoryService    = new CategoryService();
const postService        = new PostService();
const commentService     = new CommentService();

const categoryController = new CategoryController(categoryService);
const postController     = new PostController(postService);
const commentController  = new CommentController(commentService);

// Init
Promise.all([
  categoryService.init(),
  postService.init(),
  commentService.init(),
]);

// ─── Categories ───────────────────────────────────────
router.get('/categories',              categoryController.getAll);
router.get('/categories/:slug',        categoryController.getBySlug);
router.post('/categories',             validate(CreateCategorySchema), categoryController.create);
router.put('/categories/:id',          validate(UpdateCategorySchema), categoryController.update);
router.delete('/categories/:id',       categoryController.delete);

// ─── Posts ────────────────────────────────────────────
router.get('/posts/stats',             postController.getStats);
router.get('/posts',                   postController.getAll);
router.get('/posts/slug/:slug',        postController.getBySlug);
router.get('/posts/:id',               postController.getById);
router.post('/posts',                  validate(CreatePostSchema), postController.create);
router.put('/posts/:id',               validate(UpdatePostSchema), postController.update);
router.delete('/posts/:id',            postController.delete);
router.patch('/posts/:id/publish',     postController.publish);
router.patch('/posts/:id/archive',     postController.archive);

// ─── Comments ─────────────────────────────────────────
router.get('/posts/:postId/comments',  commentController.getByPost);
router.get('/comments/pending',        commentController.getPending);
router.post('/comments',               validate(CreateCommentSchema), commentController.create);
router.patch('/comments/:id/approve',  commentController.approve);
router.delete('/comments/:id',         commentController.delete);

export default router;