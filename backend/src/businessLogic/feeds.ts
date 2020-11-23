import { ImageDataAccess } from "../dataAccess/imageAccess";
import { FeedDataAccess } from "../dataAccess/feedAccess";
import { FeedItem } from "../models/FeedItem";
import { CreateFeedItemRequest } from "../requests/CreateFeedItemRequest";
import { UpdateFeedItemRequest } from "../requests/UpdateFeedItemtRequest";
import { Comment } from "../models/Comment";
import { CommentDataAccess } from "../dataAccess/commentAccess";
import { CreateCommentRequest } from "../requests/CreateCommentRequest";
import { UpdateCommentRequest } from "../requests/UpdateCommentRequest";

const uuid = require('uuid');
const feedItemAccess = new FeedDataAccess();
const commentAccess = new CommentDataAccess();
const imageAccess = new ImageDataAccess();

export async function getAllFeedItems(userId: string): Promise<FeedItem[]> {
    var items = await feedItemAccess.getAllFeedItems(userId);
    items.map((item) => {
        if (item.url) {
            item.url = imageAccess.getGetSignedUrl(item.url);
        }
    });
    return items;
}

export async function createFeedItem(userId: string, createFeedItemRequest: CreateFeedItemRequest): Promise<FeedItem> {

    const feedItemId = uuid.v4();
    const feedItem: FeedItem = {
        userId: userId,
        feedItemId: feedItemId,
        likesCount: 0,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
        ...createFeedItemRequest,
    };

    const savedItem = await feedItemAccess.createFeedItem(feedItem);
    savedItem.url = imageAccess.getGetSignedUrl(feedItem.url);
    return savedItem;
}

export async function updateFeedItem(feedItemId: string, updateFeedItemRequest: UpdateFeedItemRequest): Promise<FeedItem> {

    const feedItem = await feedItemAccess.getFeedItemById(feedItemId);
    if (feedItem) {
        feedItem.caption = updateFeedItemRequest.caption;
        if (updateFeedItemRequest.url) {
            feedItem.url = updateFeedItemRequest.url;
        }
        feedItem.updatedAt = new Date().toISOString();

        const updatedItem = await feedItemAccess.updateFeedItem(feedItem);
        updatedItem.url = imageAccess.getGetSignedUrl(feedItem.url);
        return updatedItem;
    }
    return feedItem;
}

export function getImageUploadUrl(fileName: string) {
    return imageAccess.getUploadUrl(fileName);
}

export async function deleteFeedItemById(feedItemId): Promise<boolean> {
    const feedItem = await feedItemAccess.getFeedItemById(feedItemId);
    if (!feedItem) {
        return false;
    }

    return await feedItemAccess.deleteFeedItem(feedItem);
}

export async function createComment(userId: string, commentRequest: CreateCommentRequest): Promise<FeedItem> {

    const feedItem = await feedItemAccess.getFeedItemById(commentRequest.feedItemId);
    if (feedItem) {
        const dateTimeNow = new Date().toISOString();

        // Add comment
        const comment: Comment = {
            commentId: uuid.v4(),
            userId: userId,
            createdAt: dateTimeNow,
            ...commentRequest,
        }
        await commentAccess.createComment(comment);

        // Update comments count
        feedItem.commentsCount += 1;
        feedItem.updatedAt = dateTimeNow;
        return await feedItemAccess.updateFeedItem(feedItem);
    }

    return feedItem;
}

export async function getAllComments(feedItemId: string): Promise<Comment[]> {
    return await commentAccess.getAllComments(feedItemId);
}

export async function updateComment(commentId: string, updateCommentRequest: UpdateCommentRequest): Promise<Comment> {

    const comment = await commentAccess.getCommentById(commentId);
    if (comment) {
        comment.commentText = updateCommentRequest.commentText;
        comment.updatedAt = new Date().toISOString();

        const updatedItem = await commentAccess.updateComment(comment);
        return updatedItem;
    }
    return comment;
}

export async function deleteCommentById(commentId): Promise<boolean> {

    // Get comment
    const comment = await commentAccess.getCommentById(commentId);
    if (comment) {
        // Delete comment
        await commentAccess.deleteComment(comment);

        const feedItem = await feedItemAccess.getFeedItemById(comment.feedItemId);
        if (feedItem) {
            // Update comments count
            feedItem.commentsCount -= 1;
            feedItem.updatedAt = new Date().toISOString();;
            await feedItemAccess.updateFeedItem(feedItem);

            return true;
        }
    }
    return false;
}