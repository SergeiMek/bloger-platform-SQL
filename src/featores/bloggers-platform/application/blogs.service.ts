import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogDto, UpdateBlogDto } from '../dto/create-blog.dto';
import { isValidObjectId } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const blog = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    await this.blogsRepository.createBlog(blog);
    return blog.id;
  }
  async updateBlog(id: string, body: UpdateBlogDto): Promise<void> {
    const blog = await this.blogsRepository.findOrNotFoundFail(id);
    // @ts-ignore
    blog.update(body);
    await this.blogsRepository.save(blog);
  }
  async deleteBlog(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('user not found');
    }
    const blog = await this.blogsRepository.findOrNotFoundFail(id);
    // @ts-ignore
    blog.makeDeleted();
    await this.blogsRepository.save(blog);
  }
}
