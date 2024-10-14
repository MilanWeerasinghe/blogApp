import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileRemover = (fileName)=>{
    fs.unlink(path.join(__dirname, '../uploads',fileName),((err)=>{
        if(err && err.code == 'ENOENT'){
            console.log(`File ${fileName} doesn't exist`)
        }else if(err){
            console.log(`Error occured when trying to remove the file ${fileName}`)
        }else{
            console.log(`removed ${fileName}`);
        }
    }))
}


export default fileRemover;