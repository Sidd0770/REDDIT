import multer from 'multer';

const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"/public/temp")
    },
    filename:(req,file,cb)=>{
        //use uuid or timestamp to create a unique filename
        const uniqueSuffix=Date.now()+'-' + Math.round(Math.random() * 1E9);
        cb(null,file.originalname);
    }
})

const upload =multer({
    storage:storage,
})