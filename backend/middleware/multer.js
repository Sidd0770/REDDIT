import multer from 'multer';
import path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path'; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        const correctUploadDir = path.join(__dirname, '..', 'public', 'temp');
        console.log("Multer attempting to save to:", correctUploadDir); // Debugging: log the path
        cb(null, correctUploadDir);
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtension}`; // Use a unique name
        cb(null, fileName);
    }
})

//export multer instance with storage configuration
export const upload=multer({
    storage:storage,
    limits:{fileSize:1024 * 1024 * 5}, //5MB
    fileFilter:(req,file,cb)=>{
        //accept only images
        if(file.mimetype.startsWith('image/')){
            cb(null,true);
        }else{
            cb(new Error('Only images are allowed'),false);
        }
    }
})