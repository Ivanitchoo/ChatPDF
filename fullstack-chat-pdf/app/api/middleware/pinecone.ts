//  app/middleware/pinecone.ts

import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "@/app/api/middleware/s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import {
	Document,
	RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { defaultOverrides } from "next/dist/server/require-hook";
import { convertToAscii } from "@/lib/utils";

const pineClient = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY!,
});
const index = pineClient.index("pinetech-chat-pdf");

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
	const documents = await Promise.all(pages.map(prepareDocument));

	//3. vectorise and embed individual documents
	const vectors = await Promise.all(documents.flat().map(embedDocument));

	//4. upload to pinecone
	//const client = await pineClient;
	//const pineconeIndex = client.Index("pinetech-chat-pdf");

	console.log("Inserting vectors into pinecone DB");
	//const namespace = convertToAscii(file_key);
	//PineconeUtils.chunkedUpsert(pineconeIndex, records, namespace, 10);

	await index.namespace(convertToAscii(file_key)).upsert(vectors);

	return documents[0];
}

async function embedDocument(doc: Document) {
	try {
		const embeddings = await getEmbeddings(doc.pageContent);
		const hash = md5(doc.pageContent);

		return {
			id: hash,
			values: embeddings,
			metadata: {
				text: doc.metadata.text,
				pageNumber: doc.metadata.pageNumber,
			},
		} as PineconeRecord;
	} catch (error) {
		console.error("Error embeding document.", error);
		throw error;
	}
}

export const truncateStringByBytes = (str: string, bytes: number) => {
	const enc = new TextEncoder();
	return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

export async function prepareDocument(page: PDFPage) {
	let { pageContent, metadata } = page;
	pageContent = pageContent.replace(/\n/g, " ");

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
