import { z } from 'zod';
import { PostStatus } from '../types/blog.types';

export const CreateCategorySchema = z.object({
  name:        z.string().min(1, 'Nom requis').max(50),
  description: z.string().max(200).optional().default(''),
});

export const UpdateCategorySchema = z.object({
  name:        z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
});

export const CreatePostSchema = z.object({
  title:      z.string().min(1, 'Titre requis').max(150),
  excerpt:    z.string().max(300).optional().default(''),
  content:    z.string().min(1, 'Contenu requis'),
  status:     z.nativeEnum(PostStatus).optional().default(PostStatus.DRAFT),
  categoryId: z.string().min(1, 'Catégorie requise'),
  tags:       z.array(z.string()).optional().default([]),
  author:     z.string().min(1, 'Auteur requis'),
});

export const UpdatePostSchema = z.object({
  title:      z.string().min(1).max(150).optional(),
  excerpt:    z.string().max(300).optional(),
  content:    z.string().min(1).optional(),
  status:     z.nativeEnum(PostStatus).optional(),
  categoryId: z.string().optional(),
  tags:       z.array(z.string()).optional(),
  author:     z.string().optional(),
});

export const CreateCommentSchema = z.object({
  postId:  z.string().min(1),
  author:  z.string().min(1, 'Auteur requis').max(50),
  email:   z.string().email('Email invalide'),
  content: z.string().min(1, 'Contenu requis').max(500),
});

export const PostQuerySchema = z.object({
  status:     z.nativeEnum(PostStatus).optional(),
  categoryId: z.string().optional(),
  tag:        z.string().optional(),
  author:     z.string().optional(),
  search:     z.string().optional(),
  page:       z.string().transform((v) => parseInt(v) || 1).optional(),
  limit:      z.string().transform((v) => parseInt(v) || 10).optional(),
});