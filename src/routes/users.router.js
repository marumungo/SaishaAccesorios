const { Router } = require("express");
const { getUsers, createUsers, updateRoleUser, getUserById, updateUserById, uploadDocuments, deleteInactiveUsers, deleteUserById, updateRole } = require("../controllers/users.controller");
const { authorization } = require("../passport-jwt/authorizationJwtRole");
const { passportCall } = require("../passport-jwt/passportCall");

// Declaro y llamo al Router
const router = Router();

// GET que trae los usuarios a partir del userModel y el paginate
router.get('/', passportCall("jwt"), authorization("admin"), getUsers);

// GET que devuelve un usuario a partir de su id
router.get('/:id', getUserById);

// POST que agrega un usuario a la base de datos a partir del userModel
router.post("/", createUsers);

// PUT que actualiza un usuario en la base de datos a partir del userModel
router.put("/:id", updateUserById);

// PUT que actualiza el rol de un usuario si se tienen las documentaciones
router.put("/premium/:id", updateRoleUser);

// PUT que actualiza el rol de un usuario (para el admin)
router.put("/updaterole/:id", passportCall("jwt"), authorization("admin"), updateRole);

// DELETE que elimina los usuarios que no estuvieron activos por mas de dos dias
router.delete("/deleteinactive", deleteInactiveUsers);

// DELETE que elimina un usuario de la base de datos a partir del userModel
router.delete("/:id", deleteUserById);


// POST que añade documentos
router.post("/:uid/documents", uploadDocuments);

module.exports = router;