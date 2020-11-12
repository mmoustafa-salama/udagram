import { ImageDataAccess } from "../dataAccess/imageAccess";
import { FeedDataAccess } from "../dataAccess/feedAccess";
import { FeedItem } from "../models/FeedItem";
import { CreateFeedItemRequest } from "../requests/CreateFeedItemRequest";
import { UpdateFeedItemRequest } from "../requests/UpdateFeedItemtRequest";

const uuid = require('uuid');
const feedItemAccess = new FeedDataAccess();
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