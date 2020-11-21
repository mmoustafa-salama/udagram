import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { User } from "../models/User";

export class UserDataAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly usersTable = process.env.USERS_TABLE,
        private readonly userEmailIndexName = process.env.USERS_INDEX_NAME) {
    }

    async getUserById(userId: string): Promise<User> {
        const result = await this.docClient.query({
            TableName: this.usersTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise();

        if (result.Count !== 0) {
            return result.Items[0] as User
        }

        return undefined;
    }

    async createUser(user: User): Promise<User> {
        await this.docClient.put({
            TableName: this.usersTable,
            Item: user
        }).promise();

        return user;
    }

    async updateUser(user: User): Promise<User> {
        await this.docClient.put({
            TableName: this.usersTable,
            Item: user
        }).promise();

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const result = await this.docClient.query({
            TableName: this.usersTable,
            IndexName: this.userEmailIndexName,
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        }).promise();

        if (result.Count !== 0) {
            return result.Items[0] as User
        }

        return undefined;
    }

    async deleteUser(user: User): Promise<boolean> {
        await this.docClient.delete({
            TableName: this.usersTable,
            Key: { "userId": user.userId },
            ConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': user.userId
            }
        }).promise();

        return true;
    }
}