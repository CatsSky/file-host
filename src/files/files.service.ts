import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Interval } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
	constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {
		this.removeExpired();
	}

	readonly logger = new Logger(FilesService.name);
	readonly fileExpireTime: number = 50 * 60 * 1000;

	@Interval(30 * 1000)
	async handleInterval() {
		this.removeExpired();
	}


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

	async getFile(name: string): Promise<Buffer> {
		const filePath = path.join('./storage', name);
		const file = fs.readFileSync(filePath);

		return file;
	}

	async removeExpired(): Promise<void> {
		const expireDate = new Date(Date.now() - this.fileExpireTime);

		this.fileModel.deleteMany({ timestamp: { $lte: expireDate } }).exec();

		fs.readdirSync('./storage').map(file => {
			return path.join('./storage', file)
		}).filter(file => {
			return fs.statSync(file).mtime < expireDate;
		}).forEach(fs.unlinkSync);

	}

	async removeOne(name: string): Promise<void> {
		this.fileModel.deleteOne({ filename: name }).exec();
	}
}
