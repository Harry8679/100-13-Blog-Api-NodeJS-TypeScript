import { v4 as uuidv4 }       from 'uuid';
import { PostRepository }     from '../repositories/post.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { CommentRepository }  from '../repositories/comment.repository';
import {
  Post,
  PostStatus,
  CreatePostDTO,
  UpdatePostDTO,
  PostFilters,
  PostWithCategory,
  Paginated,
} from '../types/blog.types';
import {
  generateUniqueSlug,
  calculateReadingTime,
} from '../utils/slug';

export class PostService {
  private postRepo:     PostRepository;
  private categoryRepo: CategoryRepository;
  private commentRepo:  CommentRepository;

  constructor() {
    this.postRepo     = new PostRepository();
    this.categoryRepo = new CategoryRepository();
    this.commentRepo  = new CommentRepository();
  }

  async init(): Promise<void> {
    await this.postRepo.init();
    await this.categoryRepo.init();
    await this.commentRepo.init();
  }

  // Enrichit un post avec sa catégorie et son nombre de commentaires
  private async enrich(post: Post): Promise<PostWithCategory> {
    const category     = await this.categoryRepo.findById(post.categoryId);
    const commentCount = await this.commentRepo.countByPostId(post.id);
    return { ...post, category, commentCount };
  }

  async getPosts(
    filters: PostFilters = {},
    page:  number = 1,
    limit: number = 10
  ): Promise<Paginated<PostWithCategory>> {
    let posts = await this.postRepo.findAll();

    // Filtres
    if (filters.status)     posts = posts.filter((p) => p.status     === filters.status);
    if (filters.categoryId) posts = posts.filter((p) => p.categoryId === filters.categoryId);
    if (filters.author)     posts = posts.filter((p) => p.author     === filters.author);
    if (filters.tag)        posts = posts.filter((p) => p.tags.includes(filters.tag!));
    if (filters.search) {
      const q = filters.search.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    // Tri — plus récents en premier
    posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const total      = posts.length;
    const totalPages = Math.ceil(total / limit);
    const paginated  = posts.slice((page - 1) * limit, page * limit);

    // Enrichit chaque post
    const data = await Promise.all(paginated.map((p) => this.enrich(p)));

    return { data, total, page, limit, totalPages };
  }

  async getById(id: string): Promise<PostWithCategory | null> {
    const post = await this.postRepo.findById(id);
    if (!post) return null;
    return this.enrich(post);
  }

  async getBySlug(slug: string): Promise<PostWithCategory | null> {
    const post = await this.postRepo.findBySlug(slug);
    if (!post) return null;
    await this.postRepo.incrementViews(post.id);
    return this.enrich(post);
  }

  async create(dto: CreatePostDTO): Promise<PostWithCategory> {
    const slugs = await this.postRepo.getSlugs();
    const now   = new Date().toISOString();

    const post: Post = {
      id:          uuidv4(),
      slug:        generateUniqueSlug(dto.title, slugs),
      views:       0,
      readingTime: calculateReadingTime(dto.content),
      publishedAt: dto.status === PostStatus.PUBLISHED ? now : null,
      createdAt:   now,
      updatedAt:   now,
      ...dto,
    };

    await this.postRepo.save(post);
    return this.enrich(post);
  }

  async update(id: string, dto: UpdatePostDTO): Promise<PostWithCategory | null> {
    const post = await this.postRepo.findById(id);
    if (!post) return null;

    const wasPublished = post.status === PostStatus.PUBLISHED;
    const isPublishing = dto.status  === PostStatus.PUBLISHED;

    const updated: Post = {
      ...post,
      ...dto,
      readingTime: dto.content
        ? calculateReadingTime(dto.content)
        : post.readingTime,
      publishedAt: isPublishing && !wasPublished
        ? new Date().toISOString()
        : post.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    await this.postRepo.save(updated);
    return this.enrich(updated);
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.postRepo.delete(id);
    if (deleted) {
      // Supprime aussi les commentaires associés
      await this.commentRepo.deleteByPostId(id);
    }
    return deleted;
  }

  async publish(id: string): Promise<PostWithCategory | null> {
    return this.update(id, { status: PostStatus.PUBLISHED });
  }

  async archive(id: string): Promise<PostWithCategory | null> {
    return this.update(id, { status: PostStatus.ARCHIVED });
  }

  async getStats(): Promise<Record<string, unknown>> {
    const posts = await this.postRepo.findAll();
    return {
      total:     posts.length,
      published: posts.filter((p) => p.status === PostStatus.PUBLISHED).length,
      draft:     posts.filter((p) => p.status === PostStatus.DRAFT).length,
      archived:  posts.filter((p) => p.status === PostStatus.ARCHIVED).length,
      totalViews: posts.reduce((sum, p) => sum + p.views, 0),
      topPosts:  [...posts]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5)
        .map((p) => ({ id: p.id, title: p.title, views: p.views })),
    };
  }
}