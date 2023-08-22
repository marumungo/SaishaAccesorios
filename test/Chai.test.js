// npm run start:testChai

const mongoose = require('mongoose');
const UserDao = require('../src/dao/dataBase/userDataBase');
const chai = require('chai');

mongoose.connect('mongodb+srv://marumungo:mariana123@cluster0.khppywt.mongodb.net/test');

const expect = chai.expect;

describe('Set de test User en Chai', ()=> {
    before(function () {
        this.userDao = new UserDao();
    });

    beforeEach(function(){
        // Borrar los usuarios antes de realizar las pruebas para que no haya usuarios repetidos
        // mongoose.connection.collections.users.drop();
        
        // Delay de un segundo
        this.timeout(1000);
    });

    // // Traer todos los usuarios
    // it('El dao debe poder obtener todos los usuario en un arreglo', async function(){
    //     const result = await this.userDao.getUsers({});
    //     console.log(result);
    //     expect(result).to.be.deep.equal([]);
    // //     expect(result).deep.equal([]);
    // //     expect(Array.isArray(result)).to.be.ok;
    // //     expect(Array.isArray(result)).to.be.equals(true);
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
    // });

    // // Modificar un usuario
    // it('El dao debe modificar un usuario correctamente de la DB', async function(){
    //     const _id = '64c1b68f8b318a2402dc92ff';
    //     let userUpdate = {
    //         first_name: 'Federico'
    //     };
    //     const result = await this.userDao.updateUserById(_id, userUpdate);
    //     const user = await this.userDao.getUserById({_id});
    //     console.log(user);
    //     expect(user).to.have.property('first_name', 'Federico');
    // });

    // // Eliminar un usuario
    // it('El dao debe eliminar un usuario correctamente de la DB', async function(){
    //     const _id = '64d2407a6c74bdae16814716';
    //     const result = await this.userDao.deleteUserById({_id});
    //     expect(result).to.be.an('object');
    //     // expect(result).to.have.property('_id');
    //     // expect(result._id.toString()).to.equal(result._id.toString());
    // });
});
