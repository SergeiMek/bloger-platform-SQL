import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogViewDto } from '../../api/view-dto/blogs.view-dto';
import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { FilterQuery, isValidObjectId } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserViewDto } from '../../../user-accounts/api/view-dto/users.view-dto';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    if (query.searchNameTerm) {
      //  filter.name = { $regex: query.searchNameTerm, $options: 'i' };
    }

    // @ts-ignore
    const blogs = await this.BlogModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    // @ts-ignore
    const totalCount = await this.BlogModel.countDocuments(filter);

    const items = blogs.map(BlogViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async findBlogById(id: string): Promise<BlogViewDto> {
    const blog = await this.dataSource.query(
      `SELECT * FROM public."Blogs"
             WHERE "id" = $1`,
      [id],
    );
    if (blog.length === 0) {
      throw new NotFoundException('user not found');
    }
    return BlogViewDto.mapToView(blog[0]);
  }
}
