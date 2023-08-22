const bcrypt = require("bcrypt");

// Creo el hash
const createHash = password => {
    if (!password) {
        throw new Error("Password is required");
    }
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Funcion para comparar las contraseñas
const isValidPassword = (password, user) => {
    if (user && user.password) {
        return bcrypt.compareSync(password, user.password)
    }
    return false;
};

module.exports = {
    createHash,
    isValidPassword
}