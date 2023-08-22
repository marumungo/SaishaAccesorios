class UserRepository {
    constructor(dao) {
        this.dao = dao;
    };

    getUsers = async () => {
        let result = await this.dao.getUsers();
        return result;
    };

    getUserByUsername = async (username) => {
        let result = await this.dao.getUserByUsername(username);
        return result;
    };

    getUserByEmail = async (email) => {
        let result = await this.dao.getUserByEmail(email);
        return result;
    };

    getUserById = async (id) => {
        let result = await this.dao.getUserById(id);
        return result;
    };

    addUser = async (user) => {
        let result = await this.dao.addUser(user);
        return result;
    }

    updateUserById = async (id, updatedUser) => {
        let result = await this.dao.updateUserById(id, updatedUser);
        return result;
    }

    deleteUserById = async (id) => {
        let result = await this.dao.deleteUserById(id);
        return result;
    }
};

module.exports = UserRepository;