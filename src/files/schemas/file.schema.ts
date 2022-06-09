
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
	@Prop()
	filename: string;

	@Prop()
	originalname: string;

	@Prop()
	size: number;

	@Prop()
	timestamp: Date;

	constructor(filename: string, originalName: string, size: number, timestamp: Date) {}
}

export const FileSchema = SchemaFactory.createForClass(File);
