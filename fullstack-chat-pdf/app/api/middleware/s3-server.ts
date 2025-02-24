import AWS from "aws-sdk";
import fs from "fs";

const s3Client = new AWS.S3({
	accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_KEY_ID,
	secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
	region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
});

export async function downloadFromS3(file_key: string) {
	try {
		const params = {
			Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
			Key: file_key,
		};

		const obj = await s3Client.getObject(params).promise();
		const file_name = `tmp/pdf-${Date.now}.pdf`;

		fs.writeFileSync(file_name, obj.Body as Buffer);
		return file_name;
	} catch (error) {
		console.error("(s3-server.ts: line 23) Something went wrong here:", error);
		return null;
	}
}
