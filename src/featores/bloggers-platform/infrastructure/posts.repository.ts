import { Injectable, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { PostDocument } from '../domain/posts.entity';
import {
  BadRequestDomainException,
  NotFoundDomainException,
} from '../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdatePostDto } from '../dto/create-post.dto';
import { UserDocument } from '../../user-accounts/domain/user.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findPostById(id: string): Promise<UserDocument> {
    const post = await this.dataSource.query(
      `SELECT * FROM public."Posts"
             WHERE "id" = $1`,
      [id],
    );
    if (post.length === 0) {
      throw new NotFoundException('user not found');
    } else {
      return post[0];
    }
  }
  async createPost(dto: PostDocument): Promise<void> {
    try {
      await this.dataSource.query(`INSERT INTO public."Posts"(
        id, "blogId", title, "shortDescription", content, "blogName", "createdAt")
      VALUES ('${dto.id}', '${dto.blogId}', '${dto.title}', '${dto.shortDescription}', '${dto.content}', '${dto.blogName}','${dto.createdAt}')`);
    } catch (error: any) {
      throw BadRequestDomainException.create(error);
    }
  }
  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    if (!isValidObjectId(id)) {
      throw NotFoundDomainException.create('post not found', 'postId');
    }
    // @ts-ignore
    const post = await this.PostModel.findOne({
      _id: id,
      deletionStatus: {},
    });

    if (!post) {
      throw NotFoundDomainException.create('post not found', 'postId');
    }

    return post;
  }
  async findUserInLikesInfo(
    postId: string,
    userId: string,
  ): Promise<PostDocument | null> {
    // @ts-ignore
    const foundUser = await this.PostModel.findOne({
      _id: postId,
      'likesInfo.users.userId': userId,
    });
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }
  async findUserLikeStatus(postId: string, userId: string) {
    // @ts-ignore
    const foundUser = await this.PostModel.findOne(
      { _id: postId },
      {
        'likesInfo.users': {
          $filter: {
            input: '$likesInfo.users',
            cond: { $eq: ['$$this.userId', userId] },
          },
        },
      },
    );
    if (!foundUser || foundUser.likesInfo.users.length === 0) {
      return null;
    }
    return foundUser.likesInfo.users[0].likeStatus;
  }
  async updatePost(
    blogId: string,
    postId: string,
    dto: UpdatePostDto,
  ): Promise<boolean> {
    await this.findPostById(postId);
    try {
      const query = `
      UPDATE public."Posts"
      SET "title" = $1, "shortDescription"=$2,"content"=$3,"blogId"=$4
      WHERE "id" = $5
    `;
      const values = [
        dto.title,
        dto.shortDescription,
        dto.content,
        blogId,
        postId,
      ];
      return await this.dataSource.query(query, values);
    } catch (error) {
      throw NotFoundDomainException.create(error);
    }
  }
  async deletePost(postId: string) {
    await this.findPostById(postId);
    try {
      const result = await this.dataSource.query(
        `DELETE FROM public."Posts"
      WHERE "id"= $1;`,
        [postId],
      );
      debugger;
      return result[1] === 1;
    } catch (error) {
      throw NotFoundDomainException.create(error);
    }
  }
}
