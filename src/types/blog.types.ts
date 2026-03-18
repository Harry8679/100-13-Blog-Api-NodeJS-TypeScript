export enum PostStatus {
  DRAFT     = 'draft',
  PUBLISHED = 'published',
  ARCHIVED  = 'archived',
}

export interface Category {
  id:          string;
  name:        string;
  slug:        string;
  description: string;
  createdAt:   string;
  updatedAt:   string;
}

export interface Post {
  id:           string;
  title:        string;
  slug:         string;
  excerpt:      string;
  content:      string;
  status:       PostStatus;
  categoryId:   string;
  tags:         string[];
  author:       string;
  readingTime:  number;      // minutes
  views:        number;
  createdAt:    string;
  updatedAt:    string;
  publishedAt:  string | null;
}

export interface Comment {
  id:        string;
  postId:    string;
  author:    string;
  email:     string;
  content:   string;
  approved:  boolean;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export type CreateCategoryDTO = Omit<Category, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryDTO = Partial<Omit<Category, 'id' | 'slug' | 'createdAt'>>;

export type CreatePostDTO = Omit<Post, 'id' | 'slug' | 'views' | 'readingTime' | 'createdAt' | 'updatedAt' | 'publishedAt'>;
export type UpdatePostDTO = Partial<Omit<Post, 'id' | 'slug' | 'createdAt'>>;

export type CreateCommentDTO = Omit<Comment, 'id' | 'approved' | 'createdAt' | 'updatedAt'>;

// Filtres
export interface PostFilters {
  status?:     PostStatus;
  categoryId?: string;
  tag?:        string;
  author?:     string;
  search?:     string;
}

// Post enrichi avec sa catégorie
export interface PostWithCategory extends Post {
  category: Category | null;
  commentCount: number;
}

// Pagination
export interface Paginated<T> {
  data:       T[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}