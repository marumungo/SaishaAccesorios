// npm run start:testMocha

const mongoose = require('mongoose');
const UserDao = require('../src/dao/dataBase/userDataBase');
const Assert = require('assert');

mongoose.connect('mongodb+srv://marumungo:mariana123@cluster0.khppywt.mongodb.net/test');

const assert = Assert.strict;

describe('Testing de User Dao', ()=>{
    before(function(){
        this.userDao = new UserDao();
    });

    beforeEach(function(){
        // Borrar los usuarios antes de realizar las pruebas para que no haya usuarios repetidos
        // mongoose.connection.collections.users.drop();
        
        // Delay de un segundo
        this.timeout(1000);
    });

    // // Traer todos los usuarios
    // it('El dao debe traer un usuario correctamente de la DB', async function(){
    //     const result = await this.userDao.getUsers();
    //     console.log(result);
    //     assert.strictEqual(Array.isArray(result), true);
    // });

    // // Crear un usuario
    // it('El dao debe crear un usuario correctamente de la DB', async function(){
    //     let userMock = {
    //         first_name: 'Fede',
    //         last_name: 'Osandón',
    //         email: 'o@gmail.com',
    //         password: '123456'
    //     };

    //     const result = await this.userDao.addUser(userMock);

    //     const user = await this.userDao.getUserByEmail(result.email);
    //     console.log(user);
    //     assert.strictEqual(typeof user, 'object');
    // });

    // // Modificar un usuario
    // it('El dao debe modificar un usuario correctamente de la DB', async function(){
    //     const _id = '64d17b635e83d567d5e3a3bc';
    //     let userUpdate = {
    //         first_name: 'Andrés'
    //     };
    //     const result = await this.userDao.updateUserById(_id, userUpdate);
    //     const user = await this.userDao.getUserById({_id});
    //     console.log(user);
    //     assert.strictEqual(user.first_name, userUpdate.first_name);
    // });

    // // Eliminar un usuario
    // it('El dao debe eliminar un usuario correctamente de la DB', async function(){
    //     const _id = '64d17b635e83d567d5e3a3bc';
    //     const result = await this.userDao.deleteUserById({_id});
    //     assert.strictEqual(typeof result, 'object');
    // });
});
