const fs = require("fs");

const path = "./src/dao/file/users.json";

// Declaro los usuarios en forma de objetos, dentro de un array
let users = [];

class UserDaoFile {
    constructor() {
        this.path = path;
    };

    async readFile() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);   
        } catch (error) {
            return [];
        };
    };

    async getUsers(){
        try {
            return await this.readFile();
        } catch (error) {
            return "No hay usuarios";
        };
    };    

    async getUserById(id) {
        try {
            const users = await this.readFile();
            const parseId = parseInt(id);
            const user = users.find(user => user.id === parseId);
            return user ? user : null;
        } catch (error) {
            return null;
        };
    };   

    async addUser(user) {
        const userIndex = users.findIndex(u => u.code === user.code);

        // Validar que no se repita el campo “code” y que todos los campos sean obligatorios
        if (user.first_name === "" || user.last_name === "" || typeof user.age !== "number" || user.email === "") {
            return new Error("Se necesitan todos los campos!");
        } else if (userIndex >= 0) {
            return new Error("El usuario ya está agregado");
        }

        // Generar un id autoincrementable
        if (users.length === 0) {
            user.id = 1;
        } else {
            user.id = users[users.length - 1].id + 1;
        }

        // Agregar el usuario al array
        users.push(user);
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');

        return user;
    };

    async updateUserById(id, updatedUser) {
        const parseId = parseInt(id);

        // Buscar el usuario con esa id, y actualizar sus datos (menos el id)
        const userIndex = users.findIndex(u => u.id === parseId);
        if (userIndex >= 0) {
            users[userIndex] = {id: parseId, ...updatedUser};
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
            return updatedUser;
        } else {
            return new Error ("No existe el usuario a actualizar");
        };
    };

    async deleteUserById(id) {
        const parseId = parseInt(id);

        // Buscar el usuario con esa id, y eliminarlo
        const userIndex = users.findIndex(u => u.id === parseId);
        if (userIndex >= 0) {
            users.splice(userIndex, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2), 'utf-8');
        } else {
            return new Error ("No existe el usuario a eliminar");
        };
    };
};


module.exports = UserDaoFile;