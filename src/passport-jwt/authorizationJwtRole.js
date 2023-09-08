const authorization = (...roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            // return res.status(401).send({ status: "error", error: "No autenticado" });
            return res.render("noPermissions", {});
        }

        // Verificar si el usuario tiene al menos uno de los roles especificados
        const hasRole = roles.some((role) => req.user.role === role);
        if (!hasRole) {
            // return res.status(403).send({ status: "error", error: "No autorizado" });
            return res.render("noPermissions", {});
        }

        next();
    };
};

module.exports = {
    authorization
};