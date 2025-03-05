import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { BlogsQueryRepository } from './infrastructure/query/blogs.query-repository';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/query/posts.query-repository';
import { PostsService } from './application/posts.service';
import { UsersRepository } from '../user-accounts/infrastructure/users.repository';
import { BlogIsExistConstraint } from './validate/blogId-is-exist.decorator';
import { PostsController } from './api/posts.controller';

@Module({
  imports: [
    /*MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      // { name: User.name, schema: UserSchema },
    ]),*/
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsQueryRepository,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    PostsService,
    //CommentsService,
    //CommentsRepository,
    //CommentsQueryRepository,
    UsersRepository,
    BlogIsExistConstraint,
  ],
  exports: [],
})
export class BlogAccountsModule {}
