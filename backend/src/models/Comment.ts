import { User } from "./User";

export interface Comment {
  feedItemId: string
  commentId: string
  userId: string
  commentText: string
  createdAt: string
  updatedAt?: string

  user?: User;
}
