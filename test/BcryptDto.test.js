// npm run start:testBcryptDto

const chai = require('chai');
const { createHash, isValidPassword } = require('../src/utils/bcryptHash');
const { UserDto } = require('../src/dto/user.dto');
const expect = chai.expect;

// describe('Testing de Bcrypt', ()=> {
//     it('El servicio deve devolver un hasheo efectivo del password', async ()=>{
//         const password = 'pass123456';
//         const hashedPass = await createHash(password);
//         console.log(hashedPass); 
//         expect(hashedPass).to.not.equal(password);
//     });

//     it('El servicio poder comparar de manera efectiva el password con el hash', async ()=>{
//         const password = 'pass123456';
//         const hashedPass = await createHash(password);
        
//         const userDbMock = {
//             password: hashedPass
//         };
//         const isValidPass = await isValidPassword(password, userDbMock);
//         expect(isValidPass).to.be.true;
//     });
// });


// describe('Testing Dto', ()=> {
//     it('El servicio debe devolver un usuario con fullname y menos campos', async ()=>{
//         let userMock = {
//             first_name: 'Fede1',
//             last_name: 'Osandón1',
//             email: 'o1@gmail.com',
//             password: '123456'
//         };

//         const userDtoResult = UserDto.getUserTokenFrom(userMock);
//         console.log(userDtoResult)
//         expect(userDtoResult).to.have.property('name', `${userMock.first_name} ${userMock.last_name}`);
//         expect(userDtoResult).to.not.have.property('first_name');
//         expect(userDtoResult).to.not.have.property('last_name');
//     });
// });