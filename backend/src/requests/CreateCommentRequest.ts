import { User } from "../models/User";

export interface CreateCommentRequest {
    feedItemId: string;
    commentText: string;
    user?: User
  }
  
  