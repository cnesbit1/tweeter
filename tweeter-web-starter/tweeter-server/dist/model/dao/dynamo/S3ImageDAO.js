"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ImageDAO = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const s3 = new aws_sdk_1.default.S3();
const BUCKET_NAME = '340cnbucket';
const FOLDER = 'profile-images';
class S3ImageDAO {
    async uploadProfileImage(alias, base64Image, fileExtension) {
        const buffer = Buffer.from(base64Image, 'base64');
        const key = `${FOLDER}/${alias}.${fileExtension}`;
        const params = {
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: this.getMimeType(fileExtension),
            // ACL: 'public-read', // Makes the image publicly accessible
        };
        await s3.putObject(params).promise();
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    }
    getMimeType(ext) {
        switch (ext.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            default:
                return 'application/octet-stream';
        }
    }
}
exports.S3ImageDAO = S3ImageDAO;
