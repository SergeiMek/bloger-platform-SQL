import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../../user-accounts/application/users.service';
import { UsersQueryRepository } from '../../user-accounts/infrastructure/query/users.query-repository';
import { UsersRepository } from '../../user-accounts/infrastructure/users.repository';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/basic-auth.guard';
import { GetUsersQueryParams } from '../../user-accounts/api/input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { UserViewDto } from '../../user-accounts/api/view-dto/users.view-dto';
import { CreateUserInputDto } from '../../user-accounts/api/input-dto/users.input-dto';
import { CreateBlogInputDto } from '../../bloggers-platform/api/input-dto/blogs.input-dto';
import { BlogViewDto } from '../../bloggers-platform/api/view-dto/blogs.view-dto';
import { BlogsService } from '../../bloggers-platform/application/blogs.service';
import { BlogsQueryRepository } from '../../bloggers-platform/infrastructure/query/blogs.query-repository';
@Controller('sa')
export class SuperAdminController {
  constructor(
    private usersService: UsersService,
    private usersQueryRepository: UsersQueryRepository,
    private usersRepository: UsersRepository,
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}
  @UseGuards(BasicAuthGuard)
  @Get('/users')
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.getAll(query);
  }

  @Get('/tests/:id')
  async getTests(@Param('id') id: string) {
    // return this.usersQueryRepository.getAll(query);
    return this.usersRepository.tests(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post('/users')
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.usersService.createUser(body);
    return this.usersQueryRepository.getUserById(userId);
  }
  @UseGuards(BasicAuthGuard)
  @Delete('/users:/id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
  @UseGuards(BasicAuthGuard)
  @Post('/blogs')
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(body);
    debugger;
    return this.blogsQueryRepository.findBlogById(blogId);
  }
}
