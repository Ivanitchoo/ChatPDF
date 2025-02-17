//  components/shared/FileUpload.tsx

"use client";

//import { uploadToS3 } from '@/lib/s3v3';
import { Inbox } from 'lucide-react'
import React from 'react'
import {useDropzone} from 'react-dropzone'


 const FileUpload = () => {
  const{getRootProps, getInputProps} = useDropzone({
    accept: {"application/pdf": [".pdf"]}, // Only accept PDF files
    maxFiles: 1, //Allow only 1 file to be uploaded
    onDrop: async (acceptedFiles) => {
      console.log('Accepted files:' ,acceptedFiles);
      
      const file = acceptedFiles[0];
      
      // Check file size (max=10mb)
      if (file.size > 10 * 1024 * 1024) {
        alert('Please upload a file smaller than 10mb')
        return
      }

      try {
        console.log('File to upload:', file);
        console.log('Is file instance of Blob:', file instanceof Blob)
        //const data = await uploadToS3(file)
        
        
        //Fetch the presigned URL
        const presignedURL = new URL("/api/presigned",window.location.href);
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);

        const presignedResponse = await fetch (presignedURL.toString());
        if (!presignedResponse.ok){
          throw new Error("Failed to fetch presigned URL");
        }

        const signedUrl = await presignedResponse.json();
        console.log("Presigned URL:", signedUrl);
        console.log("presignedResponse.body: ", presignedResponse.body); // Inspect the body
        console.log("Presigned URL: ", signedUrl); // Inspect the parsed JSON data
        console.log("Presigned URL type: ", typeof signedUrl);

        //Upload the file to S3 using the presigned URL
        const fileData = await file.arrayBuffer(); //Convert file to ArrayBuffer
        console.log("file data:", fileData);

        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: fileData,
          headers:{
            "Content-Type": file.type,
          },
        });
        console.log("uploadResponse: ", uploadResponse);

        if(!uploadResponse.ok){
          throw new Error("Failed to upload file to S3");
        }

        console.log('File uploaded successfully to S3:', uploadResponse)  

        // TODO: Save the reference to the object in Postgres
        const objectUrl = signedUrl.split("?")[0]
        console.log("Object Url to save in DB:", objectUrl);

        // TODO: Call your POST endpoint to save the reference in the database
      } catch (error) {
        console.log(error);
      }

    }
  })


  return (
    <div className="w-full p-2 rounded-xl bg-white">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        <Inbox className="w-10 h-10 text-blue-950" />
        <p className="mt-2 text-sm text-slate-500">Drop PDF Here</p>
      </div>
    </div>
  );
}

export default FileUpload;