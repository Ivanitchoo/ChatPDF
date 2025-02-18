import { NextResponse, type NextRequest } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
    },
  });



export async function uploadFileToS3 (file, fileName){
  const fileBuffer = file;
  console.log(fileName)

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: `uploads/${fileName}-${Date.now()}`,
    Body: fileBuffer,
    ContentType: "Application/pdf"
  };

  const command = new PutObjectCommand(params);
  await client.send(command);
  return fileName;
}


export async function POST(request: NextRequest) {
//  const s3BucketName = process.env.AWS_S3_BUCKET_NAME;
 // if (!accessKeyId || !secretAccessKey || !s3BucketName) {
   // return new Response(null, { status: 500 });
 // }

  try {
    //const {searchParams} = request.nextUrl;
    const formData = await request.formData()
    const file = formData.get('file');
    //const contentType = searchParams.get('contentType');
    if (!file ) { //|| !contentType
      return Response.json(
          { error: "File query parameter is required" },
          { status: 400 }
        );
    };

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name)

    return NextResponse.json({
      success: true,
      fileName,
    })


  } catch (error) {
    console.error("Error Uploading file: ", error)
  }
}

