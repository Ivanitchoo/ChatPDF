import AWS from 'aws-sdk'

const s3Client = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
})


export async function uploadToS3(file: File){
    try {
        const file_key = `upload/${Date.now()}_${file.name}`;

        const params ={
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file,
            ContentType: file.type,
        };

        const uploadFile = s3Client.putObject(params).on('httpUploadProgress', evt => {
           console.log('uploading to s3...',parseInt(((evt.loaded*100)/evt.total).toString())) + '%'
        } ).promise()
        // const uploadFile = await s3Client.upload(params).promise();
        // console.log('Successfully uploaded to S3!', uploadFile.Location);
        
        await uploadFile.then(data => {
           console.log('successfully uploaded to S3!', file_key)
        })

        return Promise.resolve({ //
            file_key,
            file_name: file.name,
        })


    } catch (error) {
        console.error("Something wrong happened: ", error)
    }
}


export function getS3Url(file_key: string){
    const url = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${file_key}`
    return url
}


