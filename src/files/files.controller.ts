import { Controller, Delete, Get, Param, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}
    
    @Get('all')
    async getAll() {
        return this.filesService.findAll();
    }
    
    @Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (file == null) 
            return {
                success: false,
                message: 'No file uploaded'
            }

		console.log(file);

        await this.filesService.create(file);

		return {
            success: true,
			originalname: file.originalname,
			filename: file.filename,
		};    
	}    
    
    @Get(':name')
    async getOne(@Param('name') name: string) {
        return this.filesService.findOneByFilename(name);
    }

    @Delete(':name')
    async remove(@Param('name') name: string) {
        console.log("removing " + name);
        this.filesService.removeOne(name);
    }

}