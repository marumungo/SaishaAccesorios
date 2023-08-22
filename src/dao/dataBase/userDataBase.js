const { userModel } = require("./models/user.model");

class UserDaoDataBase {
    async getUsers() {
        try {
            return await userModel.find({});
        } catch (error) {
            return new Error(error);
        }
    }

    async getUserByUsername(username) {
        try {
            return await userModel.findOne({username: username});
        } catch (error) {
            return new Error(error);
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModel.findOne({email: email});
        } catch (error) {
            return new Error(error);
        }
    }

    async getUserById(id) {
        try {
            return await userModel.findOne({_id: id});
        } catch (error) {
            return new Error(error);
        }
    }

    async addUser(user) {
        try {
            return await userModel.create(user);
        } catch (error) {
            return new Error(error);
        }
    }

    async updateUserById(id, updatedUser) {
        try {
            return await userModel.updateOne({_id: id}, updatedUser);
        } catch (error) {
            return new Error(error);
        }
    }

    async updateRoleUser(id) {
        try {
            return await userModel.findOne({_id: id});
        } catch (error) {
            return new Error(error);
        }
    }
    async deleteUserById(id) {
        try {
            return await userModel.deleteOne({_id: id});
        } catch (error) {
            return new Error(error);
        }
    }
}

module.exports = UserDaoDataBase;