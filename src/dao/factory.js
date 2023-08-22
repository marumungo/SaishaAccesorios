const config = require('../config/objectConfig');
let UserDao;
let ProductDao;
let CartDao;
let TicketDao;

switch (config.persistence) {
    case 'DATA_BASE':
        config.connectDB()
        const ProductDaoDataBase = require('../dao/dataBase/productDataBase');
        const UserDaoDataBase = require('../dao/dataBase/userDataBase');
        const CartDaoDataBase = require('../dao/dataBase/cartDataBase')
        const TicketDaoDataBase = require('../dao/dataBase/ticketDataBase');

        UserDao = UserDaoDataBase;
        ProductDao = ProductDaoDataBase;
        CartDao = CartDaoDataBase;
        TicketDao = TicketDaoDataBase;
        break;

    case 'FILE':
        const ProductDaoFile = require('../dao/file/productFile');
        const UserDaoFile = require('../dao/file/userFile');
        
        UserDao = UserDaoFile;
        ProductDao = ProductDaoFile;
        break;

    case 'MEMORY':
        const ProductDaoMemory = require('../dao/memory/productMemory');
        const UserDaoMemory = require('../dao/memory/userMemory');
        
        UserDao = UserDaoMemory;
        ProductDao = ProductDaoMemory;
        break;

    default:
        break;
};

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    TicketDao
};
