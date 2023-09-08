const { winstonLogger } = require("../config/loggers");
const { userModel } = require("../dao/dataBase/models/user.model");
const { upload } = require("../middlewares/multer");
const { userService } = require("../service/index.service");
const cartsController = require("./carts.controller");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { sendUserDeletedMail } = require("../utils/sendUserDeletedMail");

class UserController {
    getUsers = async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect("/");
            }

            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartsController.getCartByOwner(user._id);

            if (user.role !== "admin") {
                res.render("noPermissions", {})
            }

            // Obtengo los productos
            let getUsers = await userService.getUsers();

            res.render("users", { user, cart, users: getUsers});
        } catch (error) {
            if (user.role !== "admin") {
                return res.render("noPermissions", {})
            };
            
            winstonLogger.error(error);
        };
    };

    // GET que trae los usuarios a partir del userModel y el paginate
    getUsersPaginate = async (req, res) => {
        try {
            const {page=1} = req.query
            let users = await userModel.paginate({}, {limit: 10, page: page, lean: true})
            const {docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = users
    
            res.render('users',{
                status: 'success',
                users: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            })
        } catch (error) {
            winstonLogger.error(error)
        };
    };

    // GET que devuelve un usuario a partir de su email
    getUserByEmail = async (req, res) => {
        try {
            const { email } = req.params;
            const getUserByEmail = await userService.getUserByEmail(email);
            
            // Validación de si existe o no el email
            if (!getUserByEmail) {
                return res.status(400).send({error: "No existe un usuario con ese email"});
            } else {
                res.status(200).send({
                    status: "success",
                    payload: getUserByEmail
                });
            }
        } catch (error) {
            res.status(400).send({error: error.message});
        }; 
    };

    // GET que devuelve un usuario a partir de su username
    getUserByUsername = async (req, res) => {
        try {
            const { username } = req.params;
            const getUserByUsername = await userService.getUserByUsername(username);
            
            // Validación de si existe o no el username
            if (!getUserByUsername) {
                return res.status(400).send({error: "No existe un usuario con ese username"});
            } else {
                res.status(200).send({
                    status: "success",
                    payload: getUserByUsername
                });
            }
        } catch (error) {
            res.status(400).send({error: error.message});
        }; 
    };

    // GET que devuelve un usuario a partir de su id
    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            const getUserById = await userService.getUserById(id);
            
            // Validación de si existe o no la id
            if (!getUserById) {
                // return res.status(400).send({error: "No existe un usuario con esa ID"});
                return res.render("404NotFound");
            } else {
                // res.status(200).send({
                //     status: "success",
                //     payload: getUserById
                // });
                const user = getUserById;

                // Busco el carrito para poder rederizarlo correctamente
                const cart = await cartsController.getCartByOwner(user._id);

                let noEmail = false;
                if (!user.email) {
                    noEmail = true;
                }

                let isAdmin = false;
                let isUserOrPremium
                if (user.role === "admin") {
                    isAdmin = true;
                    return res.render("individualUser", {user, cart, isAdmin});
                } else if (user.role === "user" || user.role === "premium") {
                    isUserOrPremium = true;

                    let missingDocuments = false;
                    let missingIdentificacion = false;
                    let missingComprobanteDomicilio = false;
                    let missingComprobanteEstado = false;
                    let allDocuments = false;

                    // Checkeo de documentos para cambiar el rol a premium
                    if (user.role === "user") {
                        const requiredDocuments = ["identificacion", "comprobantedomicilio", "comprobanteestadocuenta"];
                        const hasAllDocuments = requiredDocuments.every(requiredDocName => {
                            const requiredDocNameLower = requiredDocName.toLowerCase();
                            return user.documents.some(doc => doc.name.toLowerCase() === requiredDocNameLower);
                        });

                        if (!hasAllDocuments) {
                            missingDocuments = true
                            requiredDocuments.forEach(docName => {
                                if (!user.documents.some(doc => doc.name === docName)) {
                                    if (docName === "identificacion") {
                                        missingIdentificacion = true;
                                    } else if (docName === "comprobantedomicilio") {
                                        missingComprobanteDomicilio = true;
                                    } else if (docName === "comprobanteestadocuenta") {
                                        missingComprobanteEstado = true;
                                    }
                                }
                            });
                        } else {
                            allDocuments = true;
                        }
                    }

                    return res.render("individualUser", {user, cart, isUserOrPremium: true, missingDocuments, missingIdentificacion, missingComprobanteDomicilio, missingComprobanteEstado, allDocuments, noEmail});
                }
            }
        } catch (error) {
            res.status(400).send({error: error.message});
        }; 
    };
    
    // POST que agrega un usuario a la base de datos a partir del userModel
    createUsers = async (req, res) => {
        try {
            let user = req.body;
    
            if(!user.nombre || !user.apellido) {
                return res.status(400).send({status:"error", mensaje: "Todos los campos son obligatorios"});
            };
    
            const newUser = {
                username: user.username,
                first_name: user.nombre,
                last_name: user.apellido,
                email: user.email
            };

            let addUser = await userService.addUser(newUser);
            res.status(200).send({
                status: "success",
                payload: addUser
            });
        } catch (error) {
            winstonLogger.error(error);
        };
    };
    
    // PUT que actualiza un usuario en la base de datos a partir del userModel
    updateUserById = async (req, res) => {
        try {
            const { id } = req.params;
            const {user} = req.body;
    
            let updateUser = {
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                gender: user.gender,
                documents: user.documents,
                last_connection: user.last_connection
            }
    
            const updatedUser = await userService.updateUserById(id, updateUser);
            return updatedUser;
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // PUT que actualiza el rol de un usuario si se tienen las documentaciones
    updateRoleUser = async (req, res) => {
        try {
            const { id } = req.params;
            const getUserById = await userService.getUserById(id);

            // Validación de si existe o no la id
            if (!getUserById) {
                return res.render("404NotFound");
                // return res.status(400).send({ error: "No existe un usuario con esa ID" });
            }

            const user = getUserById;
            // Busco el carrito para poder rederizarlo correctamente
            const cart = await cartsController.getCartByOwner(user._id);

            let newRole;
            if (getUserById.role === "user") {
                // Verifico que esten todos los documentos antes de cambiar el rol a premium
                const requiredDocumentNames = ["comprobantedomicilio", "comprobanteestadocuenta", "identificacion"];
                const hasRequiredDocuments = requiredDocumentNames.every(name =>
                    user.documents.some(doc => doc.name === name)
                );

                if (hasRequiredDocuments) {
                    newRole = "premium";
                } else {
                    missingDocuments = true;
                    return res.render("individualUser", {user, cart, isUserOrPremium: true});
                }
            } else if (getUserById.role === "premium") {
                newRole = "user";
            }
            
            await userService.updateUserById(id, { role: newRole });
            
            return res.render("individualUser", {user, cart, isUserOrPremium: true});
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // PUT que actualiza el rol de un usuario (para el admin)
    updateRole = async (req, res) => {
        try {
            const { id } = req.params;
            const getUserById = await userService.getUserById(id);

            // Validación de si existe o no la id
            if (!getUserById) {
                return res.render("404NotFound");
                // return res.status(400).send({ error: "No existe un usuario con esa ID" });
            }

            const user = getUserById;
            // Busco el carrito para poder rederizarlo correctamente
            const cart = await cartsController.getCartByOwner(user._id);

            let newRole;
            if (getUserById.role === "user") {
                newRole = "premium";
            } else if (getUserById.role === "premium") {
                newRole = "user";
            } else {
                newRole = "admin";
            };

            const updateRole = await userService.updateUserById(id, { role: newRole });

            return res.render("users", {user, cart});
            } catch (error) {
            winstonLogger.error(error);
        };
    };
    
    // DELETE que elimina un usuario de la base de datos a partir del userModel
    deleteUserById = async (req, res) => {
        try {
            const { id } = req.params;

            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartsController.getCartByOwner(user._id);

            const deleteUserById = await userService.deleteUserById(id);

            return res.render("users", {user, cart});
        } catch (error) {
            winstonLogger.error(error);
        };
    };

    // DELETE que elimina los usuarios que no estuvieron activos por mas de dos dias
    deleteInactiveUsers = async (req, res) => {
        try {
            // Obtengo los datos del usuario que inició sesión
            const username = req.session.user.username;
            const user = await userService.getUserByUsername(username);

            const cart = await cartsController.getCartByOwner(user._id);

            // Calcular la fecha límite (2 días atrás)
            const currentTime = new Date();
            const inactiveThreshold = new Date(currentTime - 2 * 24 * 60 * 60 * 1000);

            // Encuentra los usuarios inactivos
            const deletedUsers = await userModel.find({ last_connection: { $lt: inactiveThreshold } });
            
            // Eliminar los usuarios inactivos de la base de datos
            const result = await userModel.deleteMany({ last_connection: { $lt: inactiveThreshold } });
            
            // Enviar un correo a cada usuario eliminado
            for (const deletedUser of deletedUsers) {
                await sendUserDeletedMail(deletedUser.email);
            }
        } catch (error) {
            winstonLogger.error(error)
        };
    };


    // Método para subir archivos y actualizar el estado de los documentos
    uploadDocuments = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await userService.getUserById(uid);

            if (!user) {
                return res.render("404NotFound", {});
            };

            // Busco el carrito para poder rederizarlo correctamente
            const cart = await cartsController.getCartByOwner(user._id);

            // Utiliza el middleware de Multer para manejar los archivos
            const uploadMiddleware = upload.fields([
                { name: "profileImage", maxCount: 1 },
                { name: "productImage", maxCount: 1 },
                { name: "document", maxCount: 5 },
            ]);

            uploadMiddleware(req, res, async (err) => {
                let missingDocuments = false;
                let documentPushed = false;
                let documentNameUndefined = false;
                let NOjpg = false;
                let NOpdf = false;

                const { profileImage, productImage, document } = req.files;
                
                if (!profileImage && !productImage && !document) {
                    missingDocuments = true;
                }

                if (err) {
                    missingDocuments = false;            
                    if (err.message === ("Formato de imagen no admitido. Solo se permiten archivos JPG.")) {
                        NOjpg = true;
                    } else if(err.message === ("Formato de documento no admitido. Solo se permiten archivos PDF.")) {
                        NOpdf = true;
                    } else if (err.message === "Nombre de archivo no reconocido") {
                        documentNameUndefined = true;
                    }
                }

                // Función para verificar y numerar el nombre del archivo
                const verifyAndNumerateFileName = (name) => {
                    let newName = name;
                    let counter = 1;
                    while (user.documents.some(doc => doc.name === newName)) {
                        newName = `${name}${counter}`;
                        counter++;
                    }
                    return newName;
                };

                // Actualiza el estado de los documentos en función de los archivos cargados
                if (profileImage) {
                    const newName = verifyAndNumerateFileName("profileImage");
                    user.documents.push({ name: newName, reference: `/uploads/profiles/${uid}/${newName}` });
                    documentPushed = true;
                }
                
                if (productImage) {
                    const newName = verifyAndNumerateFileName("productImage");
                    user.documents.push({ name: newName, reference: `/uploads/products/${uid}/${newName}` });
                    documentPushed = true;
                }
                if (document) {
                    document.forEach((doc) => {
                            const allowedDocumentNames = ["identificacion", "comprobantedomicilio", "comprobanteestadocuenta"];
                            const documentName = doc.originalname.toLowerCase().replace(/\s/g, '');
                            const fileNameWithoutExtension = documentName.replace(/\.[^/.]+$/, "");
                            const newName = verifyAndNumerateFileName(fileNameWithoutExtension);
                            
                            if (allowedDocumentNames.includes(fileNameWithoutExtension)) {
                                user.documents.push({ name: newName, reference: `/uploads/documents/${uid}/${newName}` });
                                documentPushed = true;
                            } else {
                                documentNameUndefined = true;
                            }
                        });
                };

                await user.save();

                return res.render("documents", { user, cart, missingDocuments, documentPushed, documentNameUndefined, NOjpg, NOpdf });
            });
        } catch (error) {
            winstonLogger.error(error);
        }
    };
};

module.exports = new UserController();
