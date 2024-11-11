import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadFile(file);
    }

    @Get('list/:folder')
    async getImagesFromFolder(@Param('folder') folder: string) {
        return this.cloudinaryService.getImagesFromFolder(folder);
    }

    // @Get('find/:publicId')
    // async findImage(@Param('publicId') publicId: string) {
    //     return this.cloudinaryService.findImageById(publicId);
    // }
}
