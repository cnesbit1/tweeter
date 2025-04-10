import { IImageDAO } from '../interfaces/IImageDAO';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const BUCKET_NAME = '340cnbucket';
const FOLDER = 'profile-images';

export class S3ImageDAO implements IImageDAO {
  async uploadProfileImage(
    alias: string,
    base64Image: string,
    fileExtension: string
  ): Promise<string> {
    const buffer = Buffer.from(base64Image, 'base64');

    const key = `${FOLDER}/${alias}.${fileExtension}`;

    const params: AWS.S3.PutObjectRequest = {
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

  private getMimeType(ext: string): string {
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
