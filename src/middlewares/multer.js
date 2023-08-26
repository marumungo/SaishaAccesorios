const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configuración de Multer para guardar archivos en carpetas diferentes
let userFolder;
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

        userFolder = `uploads/${folder}/${req.params.uid}`;

        // Crear la carpeta del usuario si no existe
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        cb(null, userFolder);
    },
    filename: (req, file, cb) => {
        let fileName;
        const documentName = file.originalname.toLowerCase().replace(/\s/g, '');
        const fileNameWithoutExtension = documentName.replace(/\.[^/.]+$/, "");
        const ext = path.extname(file.originalname);
        let nameWithIndex;

        if (file.fieldname === "profileImage" || file.fieldname === "productImage") {
            // Validar extensión para imágenes
            if (ext.toLowerCase() !== ".jpg") {
                return cb(new Error("Formato de imagen no admitido. Solo se permiten archivos JPG."));
            }
            // Utilizar solo el nombre base del archivo sin la extensión
            fileName = `${file.fieldname}${ext}`;
        } else if (fileNameWithoutExtension === "comprobantedomicilio" || fileNameWithoutExtension === "comprobanteestadocuenta" || fileNameWithoutExtension === "identificacion") {
            // Validar extensión para documentos
            if (ext.toLowerCase() !== ".pdf") {
                return cb(new Error("Formato de documento no admitido. Solo se permiten archivos PDF."));
            }
            // Utilizar solo el nombre base del archivo sin la extensión
            fileName = `${fileNameWithoutExtension}${ext}`;
        } else {
            return cb(new Error("Nombre de archivo no reconocido"));
        }

        // Verificar si ya existe un archivo con ese nombre, si es así, numerarlo
        let fileIndex = 1;
        while (fs.existsSync(path.join(userFolder, fileName))) {
            nameWithIndex = `${fileNameWithoutExtension}${fileIndex}${ext}`;
            fileName = nameWithIndex;
            fileIndex++;
        }

        cb(null, fileName);
    }
});

const upload = multer({ storage });

module.exports = {
    upload
};
