import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { FeedItem } from "../models/FeedItem";

export class FeedDataAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly feedItemsTable = process.env.FEEDITEMS_TABLE,
        private readonly feedItemIndexName = process.env.FEEDITEMS_INDEX_NAME) {
    }

    async getAllFeedItems(userId: string): Promise<FeedItem[]> {
        const result = await this.docClient.query({
            TableName: this.feedItemsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise();

        return result.Items as FeedItem[];
    }

    async createFeedItem(feedItem: FeedItem): Promise<FeedItem> {
        await this.docClient.put({
            TableName: this.feedItemsTable,
            Item: feedItem
        }).promise();

        return feedItem;
    }

    async updateFeedItem(feedItem: FeedItem): Promise<FeedItem> {
        await this.docClient.put({
            TableName: this.feedItemsTable,
            Item: feedItem
        }).promise();

        return feedItem;
    }

    async getFeedItemById(feedItemId: string): Promise<FeedItem> {
        const result = await this.docClient.query({
            TableName: this.feedItemsTable,
            IndexName: this.feedItemIndexName,
            KeyConditionExpression: 'feedItemId = :feedItemId',
            ExpressionAttributeValues: {
                ':feedItemId': feedItemId
            }
        }).promise();

        if (result.Count !== 0) {
            return result.Items[0] as FeedItem
        }

        return undefined;
    }

    async deleteFeedItem(feedItem: FeedItem): Promise<boolean> {
        await this.docClient.delete({
            TableName: this.feedItemsTable,
            Key: {
                "userId": feedItem.userId,
                "createdAt": feedItem.createdAt
            },
            ConditionExpression: 'feedItemId = :feedItemId',
            ExpressionAttributeValues: {
                ':feedItemId': feedItem.feedItemId
            }
        }).promise();

        return true;
    }
}