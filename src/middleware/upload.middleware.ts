import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination:(_req:any, _file:any, cb:any) => {
        cb(null, uploadDir);
    },
    filename:(_req:any, file:any, cb:any)=>{
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null,`${unique}${path.extname(file.originalname)}`);
    }
})

const fileFilter : multer.Options["fileFilter"] = (req:any, file:any, cb:any)=>{
    const allowed =  ["image/jpeg", "image/png", "image/jpg"];
    if(allowed.includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(new Error("Invalid file type"), false);
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    }
})