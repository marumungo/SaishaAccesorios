const multer = require("multer");

// Configuración de Multer para guardar archivos en carpetas diferentes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        if (file.fieldname === "profileImage") {
            folder = "profiles";
        } else if (file.fieldname === "productImage") {
            folder = "products";
        } else {
            folder = "documents";
        }
        cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        const documentName = file.originalname.toLowerCase().replace(/\s/g, '');
        cb(null, `${Date.now()}-${documentName}`);
    },
});

const upload = multer({ storage });

module.exports = {
    upload
};
