import { v4 as uuidv4 }        from 'uuid';
import { CategoryRepository }  from '../repositories/category.repository';
import {
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../types/blog.types';
import { generateUniqueSlug } from '../utils/slug';

export class CategoryService {
  private repo: CategoryRepository;

  constructor() { this.repo = new CategoryRepository(); }

  async init(): Promise<void> { await this.repo.init(); }

  async getAll(): Promise<Category[]> {
    return this.repo.findAll();
  }

  async getById(id: string): Promise<Category | null> {
    return this.repo.findById(id);
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return this.repo.findBySlug(slug);
  }

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const slugs = await this.repo.getSlugs();
    const now   = new Date().toISOString();

    const category: Category = {
      id:          uuidv4(),
      name:        dto.name,
      slug:        generateUniqueSlug(dto.name, slugs),
      description: dto.description,
      createdAt:   now,
      updatedAt:   now,
    };

    await this.repo.save(category);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDTO): Promise<Category | null> {
    const category = await this.repo.findById(id);
    if (!category) return null;

    const updated: Category = {
      ...category,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await this.repo.save(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}