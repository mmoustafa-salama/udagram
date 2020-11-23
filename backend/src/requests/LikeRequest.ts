import { User } from "../models/User";

export interface LikeRequest {
    feedItemId: string;
    user?: User
  }
  
  