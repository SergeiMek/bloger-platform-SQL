import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/create-post.dto';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { isValidObjectId } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog = await this.blogsRepository.findBlogById(dto.blogId);

    const post = {
      id: uuidv4(),
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    };
    await this.postsRepository.createPost(post);
    return post.id;
  }
  async updatePost(
    postId: string,
    body: UpdatePostDto,
    blogId?: string,
  ): Promise<void> {
    const idBlog = blogId || body.blogId;
    await this.blogsRepository.findBlogById(idBlog!);
    await this.postsRepository.updatePost(idBlog!, postId, body);
  }
  /*async updateLikesStatus(data: updateLikesPostDto): Promise<void> {
    const foundPost = await this.postsRepository.findOrNotFoundFail(
      data.postId,
    );

    let likesCount = foundPost.likesInfo.likesCount;
    let dislikesCount = foundPost.likesInfo.dislikesCount;

    const foundUser = await this.postsRepository.findUserInLikesInfo(
      data.postId,
      data.userId,
    );

    // @ts-ignore
    const user = await this.usersRepository.findOrNotFoundFail(data.userId);
    const login = user!.login;

    const pushData = {
      postId: data.postId,
      userId: data.userId,
      userLogin: login,
      likeStatus: data.likeStatus,
    };
    if (!foundUser) {
      ///  await this.postsRepository.pushUserInLikesInfo(pushData);
      await foundPost.pushUserInLikesInfo(pushData);
      await this.postsRepository.save(foundPost);
      if (data.likeStatus === 'Like') {
        likesCount++;
      }
      if (data.likeStatus === 'Dislike') {
        dislikesCount++;
      }

      await foundPost.updateLikesCount({ dislikesCount, likesCount });
      await this.postsRepository.save(foundPost);
      return;
    }

    const userLikeDBStatus = await this.postsRepository.findUserLikeStatus(
      data.postId,
      data.userId,
    );

    switch (userLikeDBStatus) {
      case 'None':
        if (data.likeStatus === 'Like') {
          likesCount++;
        }

        if (data.likeStatus === 'Dislike') {
          dislikesCount++;
        }
        break;
      case 'Like':
        if (data.likeStatus === 'None') {
          likesCount--;
        }
        if (data.likeStatus === 'Dislike') {
          dislikesCount++;
          likesCount--;
        }
        break;
      case 'Dislike':
        if (data.likeStatus === 'None') {
          dislikesCount--;
        }
        if (data.likeStatus === 'Like') {
          dislikesCount--;
          likesCount++;
        }
    }
    await foundPost.updateLikesCount({ dislikesCount, likesCount });
    await this.postsRepository.save(foundPost);

    await this.postsRepository.updateLikesStatus(
      data.postId,
      data.userId,
      data.likeStatus,
    );

    return;
  }*/
  async deletePost(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('post not found');
    }
    const post = await this.postsRepository.findOrNotFoundFail(id);
    //  post.makeDeleted();
    // await this.postsRepository.save(post);
  }
  async deletePostForBlog(postId: string, blogId: string) {
    await this.blogsRepository.findBlogById(blogId);
    await this.postsRepository.deletePost(postId);
  }
}
