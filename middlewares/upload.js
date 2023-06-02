const multer = require("multer");
const path = require("path");

const destination = path.resolve("temp");
// const tempDir = path.join(__dirname,"../", "temp")

const storage = multer.diskStorage({
destination,
filename: (req, file, cb) =>{
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const newName = `${uniquePrefix}_${file.originalname}`;
    cb(null, newName);
}
});

const limits = {
    fileSize: 250 * 250
};

const fileFilter = (req, file, cb)=>{
    console.log(file);
    cb(null, true);
};

const upload = multer({
    storage,
    limits,
    fileFilter
});

module.exports = upload;