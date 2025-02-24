//  app/middleware/pinecone.ts

import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "@/app/api/middleware/s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
	Document,
	RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";

const pc = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});

type PDFPage = {
	metadata: {
		loc: { pageNumber: number };
	};
	pageContent: string;
};

export async function loadS3IntoPinecone(file_key: string) {
	//1. obtain the pdf -> download and read form the pdf
	console.log("downloading file");
	const file_name = await downloadFromS3(file_key);

	if (!file_name) {
		throw new Error("Could not download from s3");
	}
	const loader = new PDFLoader(file_name);
	const pages = (await loader.load()) as PDFPage[];

	//2. split and segment the pdf
	const document = await Promise.all(pages.map(prepareDocument));

	//3. vecctorise and embed individual documents

	return pages;
}

export const truncateStringByBytes = (str: string, bytes: number) => {
	const enc = new TextEncoder();
	return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

export async function prepareDocument(page: PDFPage) {
	let { pageContent, metadata } = page;
	pageContent = pageContent.replace(/\n/g, "");

	//split the docs
	const splitter = new RecursiveCharacterTextSplitter();
	const docs = await splitter.splitDocuments([
		new Document({
			pageContent,
			metadata: {
				pageNumber: metadata.loc.pageNumber,
				text: truncateStringByBytes(pageContent, 36000),
			},
		}),
	]);

	return docs;
}
