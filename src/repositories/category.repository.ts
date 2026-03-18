import * as fs        from 'fs/promises';
import * as path      from 'path';
import { Category }   from '../types/blog.types';

export class CategoryRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data', 'categories.json');
  }

  async init(): Promise<void> {
    await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    try { await fs.access(this.filePath); }
    catch { await fs.writeFile(this.filePath, '[]', 'utf-8'); }
  }

  async findAll(): Promise<Category[]> {
    const content = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(content) as Category[];
  }

  async findById(id: string): Promise<Category | null> {
    const all = await this.findAll();
    return all.find((c) => c.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const all = await this.findAll();
    return all.find((c) => c.slug === slug) ?? null;
  }

  async save(category: Category): Promise<void> {
    const all   = await this.findAll();
    const index = all.findIndex((c) => c.id === category.id);
    if (index === -1) all.push(category);
    else all[index] = category;
    await fs.writeFile(this.filePath, JSON.stringify(all, null, 2), 'utf-8');
  }

  async delete(id: string): Promise<boolean> {
    const all     = await this.findAll();
    const updated = all.filter((c) => c.id !== id);
    if (updated.length === all.length) return false;
    await fs.writeFile(this.filePath, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  }

  async getSlugs(): Promise<string[]> {
    const all = await this.findAll();
    return all.map((c) => c.slug);
  }
}