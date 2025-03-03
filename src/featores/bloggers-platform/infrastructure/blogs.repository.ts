import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogDocument } from '../domain/blogs.entity';
import { isValidObjectId } from 'mongoose';
import { BlogViewDto } from '../api/view-dto/blogs.view-dto';
import { BadRequestDomainException } from '../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createBlog(dto: BlogViewDto): Promise<void> {
    try {
      await this.dataSource.query(`INSERT INTO public."Blogs"(
        id, name, description, "websiteUrl", "createdAt", "isMembership")
      VALUES ('${dto.id}', '${dto.name}', '${dto.description}', '${dto.websiteUrl}', '${dto.createdAt}', '${dto.isMembership}')`);
    } catch (error: any) {
      throw BadRequestDomainException.create(error);
    }
  }

  async findOrNotFoundFail(id: string): Promise<BlogDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('user not found');
    }

    // @ts-ignore
    return true;
  }
  async save(user: BlogDocument) {}
  async findBlogOfValidation(id: string): Promise<boolean> {
    debugger;
    if (!isValidObjectId(id)) {
      return false;
    }
    return true;
  }
}
