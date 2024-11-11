// cloudinary.service.ts

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.interface';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
    uploadFile(file: Express.Multer.File, folder: string = 'gradlink_assessment'): Promise<CloudinaryResponse> {
        try {
            return new Promise<CloudinaryResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: folder, // Specify the folder where you want to store the file
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    },
                );

                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
        } catch (error) {
            throw new HttpException({ success: false, message: 'Cloudinary error', error }, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getImagesFromFolder(folder: string): Promise<any> {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',         // Resource type
                prefix: folder + '/',    // Specify the folder path
                max_results: 10          // Optional: Limit the number of results
            });
            return result.resources;   // Return the list of resources
        } catch (error) {
            throw new Error(`Failed to fetch images from Cloudinary: ${error.message}`);
        }
    }
}
