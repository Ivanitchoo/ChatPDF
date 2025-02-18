//  components/shared/FileUpload.tsx

"use client";

//import { uploadToS3 } from '@/lib/s3v3';
import { Inbox } from 'lucide-react'
import React, {useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {uploadToS3} from '@/app/api/middleware/s3'


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
        
        const data = await uploadToS3(file)
        
        console.log('File uploaded successfully to S3:', data);

        // TODO: Save the reference to the object in Postgres
        //const objectUrl = fileUpload.split("?")[0]
        //console.log("Object Url to save in DB:", objectUrl);

        // TODO: Call your POST endpoint to save the reference in the database
      } catch (error) {
        console.error("Error during file upload: ", error);
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


