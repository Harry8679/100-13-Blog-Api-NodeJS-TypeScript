import * as fs    from 'fs/promises';
import * as path  from 'path';
import { Post }   from '../types/blog.types';

export class PostRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'posts.json');
  }

  async init(): Promise<void> {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    try { await fs.access(this.filePath); }
    catch { await fs.writeFile(this.filePath, '[]', 'utf-8'); }
  }

  async findAll(): Promise<Post[]> {
    const content = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(content) as Post[];
  }

  async findById(id: string): Promise<Post | null> {
    const all = await this.findAll();
    return all.find((p) => p.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Post | null> {
    const all = await this.findAll();
    return all.find((p) => p.slug === slug) ?? null;
  }

  async save(post: Post): Promise<void> {
    const all   = await this.findAll();
    const index = all.findIndex((p) => p.id === post.id);
    if (index === -1) all.push(post);
    else all[index] = post;
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), 'utf-8');
  }

  async delete(id: string): Promise<boolean> {
    const all     = await this.findAll();
    const updated = all.filter((p) => p.id !== id);
    if (updated.length === all.length) return false;
    await fs.writeFile(this.filePath, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  }

  async getSlugs(): Promise<string[]> {
    const all = await this.findAll();
    return all.map((p) => p.slug);
  }

  async incrementViews(id: string): Promise<void> {
    const all   = await this.findAll();
    const index = all.findIndex((p) => p.id === id);
    if (index !== -1) {
      all[index].views++;
      await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), 'utf-8');
    }
  }
}