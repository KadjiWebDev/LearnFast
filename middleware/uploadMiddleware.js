const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // callback
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // const ext = path.extname(file.originalname);
        // ${Date.now()}-Clavier.jpeg
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    //accept: image/*
    if (allowedExtensions.includes(ext) && mime.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("We only accept: JPG, PNG, and GIF."), false);
    }
};


const upload = multer({ storage, fileFilter });
module.exports = upload;
