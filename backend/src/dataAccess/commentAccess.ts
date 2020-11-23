import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Comment } from "../models/Comment";

export class CommentDataAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly commentsTable = process.env.FEEDITEM_COMMENTS_TABLE,
        private readonly commentIndexName = process.env.FEEDITEM_COMMENTS_INDEX_NAME) {
    }

    async getAllComments(feedItemId: string): Promise<Comment[]> {
        const result = await this.docClient.query({
            TableName: this.commentsTable,
            KeyConditionExpression: 'feedItemId = :feedItemId',
            ExpressionAttributeValues: {
                ':feedItemId': feedItemId
            },
            ScanIndexForward: false
        }).promise();

        return result.Items as Comment[];
    }

    async createComment(comment: Comment): Promise<Comment> {
        await this.docClient.put({
            TableName: this.commentsTable,
            Item: comment
        }).promise();

        return comment;
    }

    async updateComment(comment: Comment): Promise<Comment> {
        await this.docClient.put({
            TableName: this.commentsTable,
            Item: comment
        }).promise();

        return comment;
    }

    async getCommentById(commentId: string): Promise<Comment> {
        const result = await this.docClient.query({
            TableName: this.commentsTable,
            IndexName: this.commentIndexName,
            KeyConditionExpression: 'commentId = :commentId',
            ExpressionAttributeValues: {
                ':commentId': commentId
            }
        }).promise();

        if (result.Count !== 0) {
            return result.Items[0] as Comment
        }

        return undefined;
    }

    async deleteComment(comment: Comment): Promise<boolean> {
        await this.docClient.delete({
            TableName: this.commentsTable,
            Key: {
                "feedItemId": comment.feedItemId,
                "createdAt": comment.createdAt
            },
            ConditionExpression: 'commentId = :commentId',
            ExpressionAttributeValues: {
                ':commentId': comment.commentId
            }
        }).promise();

        return true;
    }
}