import * as fs      from 'fs/promises';
import * as path    from 'path';
import { Comment }  from '../types/blog.types';

export class CommentRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'comments.json');
  }

  async init(): Promise<void> {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    try { await fs.access(this.filePath); }
    catch { await fs.writeFile(this.filePath, '[]', 'utf-8'); }
  }

  async findAll(): Promise<Comment[]> {
    const content = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(content) as Comment[];
  }

  async findByPostId(postId: string): Promise<Comment[]> {
    const all = await this.findAll();
    return all.filter((c) => c.postId === postId);
  }

  async findById(id: string): Promise<Comment | null> {
    const all = await this.findAll();
    return all.find((c) => c.id === id) ?? null;
  }

  async save(comment: Comment): Promise<void> {
    const all   = await this.findAll();
    const index = all.findIndex((c) => c.id === comment.id);
    if (index === -1) all.push(comment);
    else all[index] = comment;
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), 'utf-8');
  }

  async delete(id: string): Promise<boolean> {
    const all     = await this.findAll();
    const updated = all.filter((c) => c.id !== id);
    if (updated.length === all.length) return false;
    await fs.writeFile(this.filePath, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  }

  async deleteByPostId(postId: string): Promise<void> {
    const all     = await this.findAll();
    const updated = all.filter((c) => c.postId !== postId);
    await fs.writeFile(this.filePath, JSON.stringify(updated, null, 2), 'utf-8');
  }

  async countByPostId(postId: string): Promise<number> {
    const comments = await this.findByPostId(postId);
    return comments.filter((c) => c.approved).length;
  }
}