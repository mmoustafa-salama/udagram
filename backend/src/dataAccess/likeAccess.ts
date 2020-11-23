import * as AWS from "aws-sdk";
import { String } from "aws-sdk/clients/apigateway";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Like } from "../models/Like";

export class LikeDataAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly likesTable = process.env.FEEDITEM_LIKES_TABLE,
        private readonly likeIndexName = process.env.FEEDITEM_LIKES_INDEX_NAME) {
    }

    async getAllLikes(feedItemId: string): Promise<Like[]> {
        const result = await this.docClient.query({
            TableName: this.likesTable,
            KeyConditionExpression: 'feedItemId = :feedItemId',
            ExpressionAttributeValues: {
                ':feedItemId': feedItemId
            },
            ScanIndexForward: false
        }).promise();

        return result.Items as Like[];
    }

    async createLike(like: Like): Promise<Like> {
        await this.docClient.put({
            TableName: this.likesTable,
            Item: like
        }).promise();

        return like;
    }

    async updateLike(like: Like): Promise<Like> {
        await this.docClient.put({
            TableName: this.likesTable,
            Item: like
        }).promise();

        return like;
    }

    async getLikeById(likeId: string): Promise<Like> {
        const result = await this.docClient.query({
            TableName: this.likesTable,
            IndexName: this.likeIndexName,
            KeyConditionExpression: 'likeId = :likeId',
            ExpressionAttributeValues: {
                ':likeId': likeId
            }
        }).promise();

        if (result.Count !== 0) {
            return result.Items[0] as Like
        }

        return undefined;
    }

    async getUserLike(feedItemId: String, userId: string): Promise<Like> {
        const result = await this.docClient.query({
            TableName: this.likesTable,
            IndexName: this.likeIndexName,
            KeyConditionExpression: 'feedItemId = :feedItemId and userId = :userId',
            ExpressionAttributeValues: {
                ':feedItemId': feedItemId,
                ':userId': userId
            }
        }).promise();

        if (result.Count !== 0) {
            return result.Items[0] as Like
        }

        return undefined;
    }

    async deleteLike(like: Like): Promise<boolean> {
        await this.docClient.delete({
            TableName: this.likesTable,
            Key: {
                "feedItemId": like.feedItemId,
                "createdAt": like.createdAt
            },
            ConditionExpression: 'likeId = :likeId',
            ExpressionAttributeValues: {
                ':likeId': like.likeId
            }
        }).promise();

        return true;
    }
}