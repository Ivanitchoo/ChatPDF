import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION!,// || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File) {
  try {
    const fileKey = `upload/${Date.now().toString()}-${file.name.replace(/\s+/g, '-')}`;

    const readableStream = file.stream();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: readableStream,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(params);

    console.log('Is file instance of Blob:', file instanceof Blob) //Debug

    // Upload the file to S3
    await s3Client.send(command);

    console.log('Successfully uploaded to S3!', fileKey);

    return {
      file_key: fileKey,
      file_name: file.name,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

export function getS3Url(fileKey: string) {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;
}