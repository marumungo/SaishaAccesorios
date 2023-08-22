const { winstonLogger } = require("../config/loggers");
const { userModel } = require("../dao/dataBase/models/user.model");
const { upload } = require("../middlewares/multer");
const { userService } = require("../service/index.service");
const cartsController = require("./carts.controller");

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

            // Obtengo los productos
            let getUsers = await userService.getUsers();
            // res.status(200).send({
            //     status: "success",
            //     payload: getUsers
            // });
            res.render("users", { user, cart, users: getUsers});
        } catch (error) {
            res.status(500).send({ error: error.message });
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

                    return res.render("individualUser", {user, cart, isUserOrPremium: true, missingDocuments, missingIdentificacion, missingComprobanteDomicilio, missingComprobanteEstado, allDocuments});
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

    // PUT que actualiza el rol de un usuario
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
                newRole = "premium";
            } else if (getUserById.role === "premium") {
                newRole = "user";
            }

            await userService.updateUserById(id, { role: newRole });
            
            res.render("individualUser", {user, cart, isUserOrPremium: true});
        } catch (error) {
            console.log(error);
        };
    };
    
    // DELETE que elimina un usuario de la base de datos a partir del userModel
    deleteUsers = async (req, res) => {
        try {
            const { id } = req.params;

            const deleteUserById = await userService.deleteUserById(id);

            res.status(200).send({
                status: "success",
                payload: deleteUserById
            }); 
        } catch (error) {
            winstonLogger.error(error);
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
                if (err) {
                    return res.render("404NotFound", {});
                }

                const { profileImage, productImage, document } = req.files;
                
                let missingDocuments = false;
                let documentPushed = false;
                let documentNameUndefined = false;

                if (!profileImage && !productImage && !document) {
                    missingDocuments = true;
                }

                // Actualiza el estado de los documentos en función de los archivos cargados
                if (profileImage) {
                    documentPushed = true;
                    user.documents.push({ name: "profileImage", reference: profileImage[0].filename });
                }

                if (productImage) {
                    documentPushed = true;
                    user.documents.push({ name: "productImage", reference: productImage[0].filename });
                }
                if (document) {
                    document.forEach((doc) => {
                        const allowedDocumentNames = ["identificacion", "comprobantedomicilio", "comprobanteestadocuenta"];
                        const documentName = doc.originalname.toLowerCase().replace(/\s/g, '');
                        
                        // Extraer el nombre del archivo sin la extensión
                        const fileNameWithoutExtension = documentName.replace(/\.[^/.]+$/, "");

                        if (allowedDocumentNames.includes(fileNameWithoutExtension)) {
                            documentPushed = true;
                            user.documents.push({ name: fileNameWithoutExtension, reference: doc.filename });
                        } else {
                            documentNameUndefined = true;
                        }
                    });
                }

                await user.save();

                return res.render("documents", { user, cart, missingDocuments, documentPushed, documentNameUndefined });
            });
        } catch (error) {
            winstonLogger.error(error);
        }
    };
};

module.exports = new UserController();
