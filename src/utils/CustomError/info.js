const generateUserErrorInfo = (user) => {
    return `One or more properties are incomplete or not valid.
        The user needs these properties:
        * username: needs to a String, received "${user.username}"
        * first_name: needs to a String, received "${user.first_name}"
        * last_name: needs to a String, received "${user.last_name}"
        * email: needs to a String, received "${user.email}"
        * password: needs to a String, received "${user.password}"`;
};

const generateProductErrorInfo = (product) => {
    return `One or more properties are incomplete or not valid.
        The product needs these properties:
        * title: needs to a String, received "${product.title}"
        * description: needs to a String, received "${product.description}"
        * price: needs to a String, received "${product.price}"
        * category: needs to a String, received "${product.category}"
        * thumbnail: needs to a String, received "${product.thumbnail}"
        * stock: needs to a String, received "${product.stock}"
        * code: needs to a String, received "${product.code}"
        * imageUrl: needs to a String, received "${product.imageUrl}"`;
};

module.exports = {
    generateUserErrorInfo,
    generateProductErrorInfo
};