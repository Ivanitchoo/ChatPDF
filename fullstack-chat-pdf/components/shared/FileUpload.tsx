//  components/shared/FileUpload.tsx

"use client";

//import { uploadToS3 } from '@/lib/s3v3';
import { Inbox } from 'lucide-react'
import React, {useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {uploadToS3} from '@/app/api/middleware/s3'
import {useMutation} from '@tanstack/react-query'
import axios from 'axios'
import {toast} from 'react-hot-toast'

const FileUpload = () => {

  const {mutate} = useMutation({
    mutationFn: async ({
      file_key,
      file_name 
    }  : {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post('api/create-chat', {
        file_key, 
        file_name,
      });
      return response.data
    },
  });

  const{getRootProps, getInputProps} = useDropzone({
    accept: {"application/pdf": [".pdf"]}, // Only accept PDF files
    maxFiles: 1, //Allow only 1 file to be uploaded
    onDrop: async (acceptedFiles, fileRejections) => {
      console.log('Accepted files:' ,acceptedFiles);
      
      //check if it's more than one file
      if (fileRejections.length > 0) {
        toast.error("Something went wrong. Make sure you're uploading 1 pdf file.");
        return;
      }
      
      const file = acceptedFiles[0];


      // Check file size (max=10mb)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Upload a file smaller than 10mb');
        return
      }

      try {
        console.log('File to upload:', file);
        
        const data = await uploadToS3(file)
        console.log('File uploaded successfully to S3:', data);

        if(!data?.file_key || data.file_name){
          toast.error("something went wrong");
          return;
        }

        mutate(data,{
          onSuccess: (data) => {
            console.log(data);
          },
          onError: (err) => {
            toast.error("Error creating chat.");
            console.log(err);
          }
        }) 
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


