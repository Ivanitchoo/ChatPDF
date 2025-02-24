// api/create-chat

import { NextResponse } from "next/server";
import { loadS3IntoPinecone } from "@/app/api/middleware/pinecone";

export async function POST(request: Request, response: Response) {
	try {
		const body = await request.json();
		const { file_key, file_name } = body;
		console.log(file_key, file_name);

		const pages = await loadS3IntoPinecone(file_key);
		return NextResponse.json(
			pages
			//{ message: "Chat successfully created", file_key, file_name },
			//{ status: 200 }
		);
	} catch (error) {
		console.error("Something Happened: ", error);
		return NextResponse.json(
			{ error: "internal server error" },
			{ status: 500 }
		);
	}
}
