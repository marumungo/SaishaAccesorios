// npm run start:testSupertest

const chai = require('chai');
const supertest = require('supertest');

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing de e-commerce', () => {
    // describe('Test de productos', () => {
    //     it('El endpoint de GET /api/products debe traer todos los productos correctamente', async () => {
    //         const {statusCode, _body, ok} = await requester.get('/api/products');
    //         console.log(_body.payload);
    //         expect(ok).to.be.equal(true);
    //         expect(statusCode).to.be.equal(200);
    //     });

    //     it('El endpoint de POST /api/products debe crear un producto correctamente', async () => {
    //         const productMock = {
    //             title: 'Blusa', 
    //             description: 'Escote corazón',
    //             price: 3400,
    //             category: "top",
    //             stock: 38,
    //             code: 432,
    //             imageUrl: "fotoBlusa.com"
    //         };

    //         const {statusCode, _body, ok} = await requester.post('/api/products').send(productMock);
    //         console.log(_body);
    //         console.log(_body.payload);
    //         expect(ok).to.be.equal(true);
    //         expect(statusCode).to.be.equal(200);
    //     });

    //     it('El endpoint de GET by id debe traer un producto correctamente', async () => {
    //         let id = '64c1aa985dfb731420cf0535';
    //         const response = await requester.get(`/api/products/${id}`);
    //         console.log(response.body);

    //         expect(response.statusCode).to.equal(200);
    //         expect(response.body.payload).to.have.property('_id');
    //         expect(response.body.payload._id).to.equal(id);
    //     });

    //     it('El endpoint de PUT by id debe actualizar un producto correctamente', async () => {
    //         let id = '64d25b86a460c25065939cc2';
    //         const updatedProduct = {
    //             title: "Jean azul"
    //         };

    //         const response = await requester.put(`/api/products/${id}`).send(updatedProduct);
    //         const updatedResponse = await requester.get(`/api/products/${id}`);
    //         console.log(updatedResponse.body);

    //         expect(response.statusCode).to.equal(200);
    //     });

    //     it('El endpoint de DELETE by id debe eliminar un producto correctamente', async () => {
    //         let id = '64d25b86a460c25065939cc2';
    //         const response = await requester.delete(`/api/products/${id}`);
    //         console.log(response.body);

    //         expect(response.statusCode).to.equal(200);
    //     });
    // });

    describe('Test de carritos', () => {
        // it('El endpoint de GET /api/carts debe traer todos los carritos correctamente', async () => {
        //     const {statusCode, _body, ok} = await requester.get('/api/carts');
        //     console.log(_body.payload);
        //     expect(ok).to.be.equal(true);
        //     expect(statusCode).to.be.equal(200);
        // });

        // it('El endpoint de POST /api/carts debe crear un carrito correctamente', async () => {
        //     const {statusCode, _body, ok} = await requester.post('/api/carts');
        //     console.log(_body);
        //     console.log(_body.payload);
        //     expect(ok).to.be.equal(true);
        //     expect(statusCode).to.be.equal(200);
        // });

        // it('El endpoint de GET by id debe traer un carrito correctamente', async () => {
        //     let id = '64a317607fd2cc4bd18040c0';
        //     const response = await requester.get(`/api/carts/${id}`);
        //     console.log(response.body);

        //     expect(response.statusCode).to.equal(200);
        //     expect(response.body.payload).to.have.property('_id');
        //     expect(response.body.payload._id).to.equal(id);
        // });

        // it('El endpoint de POST by id debe agregar un producto por su pid a un carrito por su cid', async () => {
        //     let cid = '64a317607fd2cc4bd18040c0';
        //     let pid = '64c1aa985dfb731420cf0535';

        //     const {statusCode, _body, ok} = await requester.post(`/api/carts/${cid}/product/${pid}`);
        //     console.log(_body.payload);
        //     expect(ok).to.be.equal(true);
        //     expect(statusCode).to.be.equal(200);
        // });

        // it('El endpoint de DELETE by id debe eliminar los productos de un carrito correctamente', async () => {
        //     let id = '64a317607fd2cc4bd18040c0';
        //     const response = await requester.delete(`/api/carts/${id}`);
        //     console.log(response.body);

        //     expect(response.statusCode).to.equal(200);
        // });
    });

    // describe('Test de Session', ()=>{
    //     let cookie;
    //     it('El servicio debe registrar un usuario correctamente', async () => {
    //         let userMock = {
    //             username: 'fedeOsandon',
    //             first_name: 'Fede',
    //             last_name: 'Osandón',
    //             email: 'f@gmail.com',
    //             password: '123456'
    //         };

    //         const {_body} = await requester.post('/api/sessions/register').send(userMock);
    //         console.log(_body);
    //         expect(_body.token).to.be.ok;
    //     });

    //     it('El servicio debe loguear un usuario correctamente y devolver una cookie', async () => {
    //         let userMock = {
    //             email: 'marumungo@gmail.com',
    //             password: '123'
    //         };

    //         const result = await requester.post('/api/sessions/login').send(userMock);
    //         const cookieResult = result.headers['set-cookie'][0];
    //         expect(cookieResult).to.be.ok;

    //         // Setear el jwt en la cookie
    //         cookie = {
    //             name: cookieResult.split('=')[0],
    //             value: cookieResult.split('=')[1]
    //         };
    //         console.log(cookie);

    //         expect(cookie.name).to.be.ok.and.eql('coderCookieToken');
    //         expect(cookie.value).to.be.ok;
    //     });

    //     it('Debe consultar la ruta current y recibir los datos del usuario', async () => {
    //         const {_body} = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
    //         console.log(_body);
    //         expect(_body.payload.user.email).to.be.equal('marumungo@gmail.com');
    //     });
    // });
});
