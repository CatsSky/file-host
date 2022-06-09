
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express/multer';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File, FileSchema } from './schemas/file.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`),
		MongooseModule.forFeature([
			{ name: File.name, schema: FileSchema }
		]),
		MulterModule.register({
			dest: './storage',
			limits: { fileSize: 5 * 1024 * 1024 },
			fileFilter: (req, file, cb) => {
				if (!file.originalname.match(/\.(pdf|txt)$/)) {
					return cb(new Error('Only image files are allowed!'), false);
				}
				cb(null, true);
			}
		}),
	],
	controllers: [FilesController],
	providers: [FilesService],
})
export class FilesModule {}
