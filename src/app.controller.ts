import { Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Render('index.html')
	async getIndex() {
		return;
	}

	
	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file);

		const response = {
			originalname: file.originalname,
			filename: file.filename,
		};
		return response;
	}

}
