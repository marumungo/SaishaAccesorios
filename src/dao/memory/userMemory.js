class UserDaoMemory {
    constructor() {
        this.users = [];
    };

    async getUsers() {
        return this.users;
    };

    async getUserById(id) {
        return this.users.find(user => id === user.id);
    };

    async addUser(user) {
        return this.users.push(user);
    };

    async updateUserById(id, updatedUser) {

    };

    async deleteUserById(id) {

    };
};

module.exports = UserDaoMemory;