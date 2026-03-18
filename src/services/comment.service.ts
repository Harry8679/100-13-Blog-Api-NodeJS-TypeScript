import { v4 as uuidv4 }      from 'uuid';
import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository }    from '../repositories/post.repository';
import {
  Comment,
  CreateCommentDTO,
} from '../types/blog.types';

export class CommentService {
  private commentRepo: CommentRepository;
  private postRepo:    PostRepository;

  constructor() {
    this.commentRepo = new CommentRepository();
    this.postRepo    = new PostRepository();
  }

  async init(): Promise<void> {
    await this.commentRepo.init();
    await this.postRepo.init();
  }

  async getByPostId(postId: string): Promise<Comment[]> {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new Error('POST_NOT_FOUND');
    const comments = await this.commentRepo.findByPostId(postId);
    return comments.filter((c) => c.approved);
  }

  async create(dto: CreateCommentDTO): Promise<Comment> {
    const post = await this.postRepo.findById(dto.postId);
    if (!post) throw new Error('POST_NOT_FOUND');

    const now: string  = new Date().toISOString();
    const comment: Comment = {
      id:        uuidv4(),
      approved:  false,
      createdAt: now,
      updatedAt: now,
      ...dto,
    };

    await this.commentRepo.save(comment);
    return comment;
  }

  async approve(id: string): Promise<Comment | null> {
    const comment = await this.commentRepo.findById(id);
    if (!comment) return null;

    const updated: Comment = {
      ...comment,
      approved:  true,
      updatedAt: new Date().toISOString(),
    };

    await this.commentRepo.save(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.commentRepo.delete(id);
  }

  async getPending(): Promise<Comment[]> {
    const all = await this.commentRepo.findAll();
    return all.filter((c) => !c.approved);
  }
}