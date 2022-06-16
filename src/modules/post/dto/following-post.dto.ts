import { Post, Question } from '@prisma/client';

export type FollowingPosts = Post & {
  Questions: Question[];
  totalQuestion: number;
  totalAnswer: number;
};
