
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class FilesService {
	constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

	async create(file: Express.Multer.File): Promise<File> {
		const fileDocument = new this.fileModel({
			originalname: file.originalname,
			filename: file.filename,
			size: file.size,
			timestamp: new Date(),
		});
		return fileDocument.save();
	}

	async findOneByFilename(name: string): Promise<File> {
		return this.fileModel.findOne({ filename: name }).exec();
	}

	async findAll(): Promise<File[]> {
		return this.fileModel.find().exec();
	}

	async removeExpired(): Promise<void> {
		const expireDate = new Date(Date.now() - 5 * 60 * 1000);
		this.fileModel.deleteMany({ timestamp: { $lte: expireDate }}).exec();
	}

	async removeOne(name: string): Promise<void> {
		this.fileModel.deleteOne({ filename: name }).exec();
	}
}
