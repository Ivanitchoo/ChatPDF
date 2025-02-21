// api/create-chat

import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response){
    try {
        const body = await request.json();
        const {file_key, file_name} = body
        console.log(file_key, file_name);
    } catch (error) {
        console.error("Something Happened: ", error)
        return NextResponse.json(
            {error: "internal server error"},
            {status: 500}
        )
    }
}