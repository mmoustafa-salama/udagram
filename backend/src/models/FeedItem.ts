import { User } from "./User";

export interface FeedItem {
    userId: string
    feedItemId: string
    caption: string
    url: string
    likesCount: number
    commentsCount: number
    createdAt: string
    updatedAt?: string

    user?: User;
  }
  