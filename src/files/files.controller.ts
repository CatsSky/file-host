import { Controller, Delete, Get, Param, Post, Logger, UploadedFile, UseInterceptors, Res, Response, StreamableFile } from '@nestjs/common';
import { FilesService } from './files.service';
import { Express, Response as ExpressResponse } from 'express'
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    readonly logger = new Logger(FilesController.name);

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

        this.logger.debug(file);

        await this.filesService.create(file);

        return {
            success: true,
            originalname: file.originalname,
            filename: file.filename,
        };
    }

    @Get(':name')
    async getOne(@Response() res: ExpressResponse, @Param('name') name: string): Promise<ExpressResponse> {
        const info = await this.filesService.findOneByFilename(name);

        if (info == null) {
            this.logger.debug("file not found");
            res.status(404).send('File not found');
            return;
        }

        const file = await this.filesService.getFile(name);

        res.set({
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            'Content-Disposition': `attachment; filename="${encodeURIComponent(info.originalname)}"`,
        });

        return res.send(file);

    }

    @Delete(':name')
    async remove(@Param('name') name: string) {
        console.log("removing " + name);
        this.filesService.removeOne(name);
    }

}