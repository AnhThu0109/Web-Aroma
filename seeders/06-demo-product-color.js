'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let data = [{ "productId": 29, "colorId": 1, "imagepath": "/img/product/product4.png" },
            { "productId": 4, "colorId": 3, "imagepath": "/img/product/product3.png" },
            { "productId": 9, "colorId": 5, "imagepath": "/img/product/product5.png" },
            { "productId": 3, "colorId": 1, "imagepath": "/img/product/product1.png" },
            { "productId": 31, "colorId": 4, "imagepath": "/img/product/product1.png" },
            { "productId": 3, "colorId": 3, "imagepath": "/img/product/product8.png" },
            { "productId": 29, "colorId": 4, "imagepath": "/img/product/product7.png" },
            { "productId": 19, "colorId": 3, "imagepath": "/img/product/product5.png" },
            { "productId": 1, "colorId": 5, "imagepath": "/img/product/product1.png" },
            { "productId": 32, "colorId": 4, "imagepath": "/img/product/product3.png" },
            { "productId": 25, "colorId": 5, "imagepath": "/img/product/product3.png" },
            { "productId": 32, "colorId": 3, "imagepath": "/img/product/product3.png" },
            { "productId": 27, "colorId": 3, "imagepath": "/img/product/product7.png" },
            { "productId": 19, "colorId": 2, "imagepath": "/img/product/product8.png" },
            { "productId": 25, "colorId": 1, "imagepath": "/img/product/product2.png" },
            { "productId": 2, "colorId": 1, "imagepath": "/img/product/product3.png" },
            { "productId": 18, "colorId": 1, "imagepath": "/img/product/product3.png" },
            { "productId": 4, "colorId": 4, "imagepath": "/img/product/product2.png" },
            { "productId": 11, "colorId": 5, "imagepath": "/img/product/product7.png" },
            { "productId": 12, "colorId": 2, "imagepath": "/img/product/product3.png" },
            { "productId": 35, "colorId": 5, "imagepath": "/img/product/product3.png" },
            { "productId": 8, "colorId": 3, "imagepath": "/img/product/product7.png" },
            { "productId": 19, "colorId": 5, "imagepath": "/img/product/product8.png" },
            { "productId": 35, "colorId": 4, "imagepath": "/img/product/product4.png" },
            { "productId": 11, "colorId": 1, "imagepath": "/img/product/product5.png" },
            { "productId": 33, "colorId": 4, "imagepath": "/img/product/product2.png" },
            { "productId": 28, "colorId": 2, "imagepath": "/img/product/product2.png" },
            { "productId": 24, "colorId": 4, "imagepath": "/img/product/product2.png" },
            { "productId": 27, "colorId": 5, "imagepath": "/img/product/product1.png" },
            { "productId": 13, "colorId": 2, "imagepath": "/img/product/product6.png" },
            { "productId": 29, "colorId": 3, "imagepath": "/img/product/product7.png" },
            { "productId": 8, "colorId": 5, "imagepath": "/img/product/product1.png" },
            { "productId": 29, "colorId": 2, "imagepath": "/img/product/product4.png" },
            { "productId": 6, "colorId": 4, "imagepath": "/img/product/product2.png" },
            { "productId": 28, "colorId": 4, "imagepath": "/img/product/product1.png" },
            { "productId": 30, "colorId": 5, "imagepath": "/img/product/product7.png" },
            { "productId": 4, "colorId": 5, "imagepath": "/img/product/product5.png" },
            { "productId": 7, "colorId": 2, "imagepath": "/img/product/product3.png" },
            { "productId": 29, "colorId": 5, "imagepath": "/img/product/product8.png" },
            { "productId": 1, "colorId": 2, "imagepath": "/img/product/product5.png" },
            { "productId": 23, "colorId": 2, "imagepath": "/img/product/product6.png" },
            { "productId": 4, "colorId": 1, "imagepath": "/img/product/product5.png" },
            { "productId": 8, "colorId": 4, "imagepath": "/img/product/product1.png" },
            { "productId": 22, "colorId": 3, "imagepath": "/img/product/product1.png" },
            { "productId": 6, "colorId": 3, "imagepath": "/img/product/product2.png" },
            { "productId": 2, "colorId": 4, "imagepath": "/img/product/product4.png" },
            { "productId": 34, "colorId": 2, "imagepath": "/img/product/product4.png" },
            { "productId": 15, "colorId": 3, "imagepath": "/img/product/product4.png" },
            { "productId": 30, "colorId": 1, "imagepath": "/img/product/product1.png" },
            { "productId": 34, "colorId": 4, "imagepath": "/img/product/product2.png" },
            { "productId": 16, "colorId": 2, "imagepath": "/img/product/product7.png" },
            { "productId": 6, "colorId": 5, "imagepath": "/img/product/product4.png" },
            { "productId": 13, "colorId": 3, "imagepath": "/img/product/product5.png" },
            { "productId": 14, "colorId": 5, "imagepath": "/img/product/product8.png" },
            { "productId": 8, "colorId": 1, "imagepath": "/img/product/product6.png" },
            { "productId": 17, "colorId": 5, "imagepath": "/img/product/product5.png" },
            { "productId": 35, "colorId": 1, "imagepath": "/img/product/product3.png" },
            { "productId": 14, "colorId": 3, "imagepath": "/img/product/product3.png" },
            { "productId": 34, "colorId": 1, "imagepath": "/img/product/product6.png" },
            { "productId": 26, "colorId": 4, "imagepath": "/img/product/product1.png" },
            { "productId": 21, "colorId": 5, "imagepath": "/img/product/product1.png" },
            { "productId": 12, "colorId": 3, "imagepath": "/img/product/product1.png" },
            { "productId": 17, "colorId": 1, "imagepath": "/img/product/product4.png" },
            { "productId": 20, "colorId": 4, "imagepath": "/img/product/product4.png" },
            { "productId": 25, "colorId": 4, "imagepath": "/img/product/product8.png" },
            { "productId": 26, "colorId": 5, "imagepath": "/img/product/product3.png" },
            { "productId": 7, "colorId": 1, "imagepath": "/img/product/product8.png" },
            { "productId": 14, "colorId": 4, "imagepath": "/img/product/product5.png" },
            { "productId": 5, "colorId": 2, "imagepath": "/img/product/product5.png" },
            { "productId": 31, "colorId": 1, "imagepath": "/img/product/product5.png" },
            { "productId": 16, "colorId": 5, "imagepath": "/img/product/product3.png" }
        ];
        data.map(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
            return item;
        });
        return queryInterface.bulkInsert('ProductColors', data, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('ProductColors', null, {});

    }
};