import * as AWS from "aws-sdk";

export class ImageDataAccess {
    constructor(
        private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly bucketName = process.env.FEEDITEM_IMAGES_S3_BUCKET,
        private readonly urlExpiration = +process.env.SIGNED_URL_EXPIRATION) {
    }

    getUploadUrl(key: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: this.urlExpiration
        })
    }

    getGetSignedUrl(key: string): string {
        const url = this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: this.urlExpiration
        });

        return url;
    }

    buildPublicUrl(key: string): string {
        return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    }
}