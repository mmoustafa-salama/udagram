import { User } from "./User";

export interface Like {
    feedItemId: string
    likeId: string
    userId: string
    createdAt: string
  
    user?: User;
  }
  