// cloudinary.provider.ts

import { v2 as cloudinary } from 'cloudinary';
import { ConstantsService } from 'src/constants/constants.service';

export const CloudinaryProvider = {
    provide: 'CLOUDINARY',
    inject: [ConstantsService], // Inject ConstantsService
    useFactory: (constantsService: ConstantsService) => {
        return cloudinary.config({
            cloud_name: constantsService.getCloudinaryName(),
            api_key: constantsService.getCloudinaryKey(),
            api_secret: constantsService.getCloudinarySecret(),
        });
    },
};
