'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let data = [{
            "username": "pvan0@gmail.com",
            "password": "yZSFZugO6a",
            "fullname": "Phil Van Arsdall",
            "avatarPath": "/img/product/review-1.png",
            "isAdmin": true
        }, {
            "username": "hryder1@gmail.com",
            "password": "aELlfU9L",
            "fullname": "Harris Ryder",
            "avatarPath": "/img/product/review-2.png",
            "isAdmin": false
        }, {
            "username": "djamot2@gmail.com",
            "password": "MeUI2pWk4k",
            "fullname": "Danita Jamot",
            "avatarPath": "/img/product/review-3.png",
            "isAdmin": true
        }, {
            "username": "felcum3@gmail.com",
            "password": "zD23XTCGD",
            "fullname": "Fabiano Elcum",
            "avatarPath": "/img/product/review-1.png",
            "isAdmin": false
        }, {
            "username": "tcarruthers4@gmail.com",
            "password": "1iux19ZHkB",
            "fullname": "Tresa Carruthers",
            "avatarPath": "/img/product/review-2.png",
            "isAdmin": true
        }, {
            "username": "ahucklesby5@gmail.com",
            "password": "FzvDFDXlUFqg",
            "fullname": "Annie Hucklesby",
            "avatarPath": "/img/product/review-3.png",
            "isAdmin": false
        }, {
            "username": "easty6@gmail.com",
            "password": "lfe3mtOmvG",
            "fullname": "Estella Asty",
            "avatarPath": "/img/product/review-1.png",
            "isAdmin": false
        }, {
            "username": "dhutton7@gmail.com",
            "password": "pjdbSEt",
            "fullname": "Donna Hutton",
            "avatarPath": "/img/product/review-2.png",
            "isAdmin": false
        }, {
            "username": "kornillos8@gmail.com",
            "password": "eXtwTLUi3",
            "fullname": "Katerina Ornillos",
            "avatarPath": "/img/product/review-3.png",
            "isAdmin": false
        }, {
            "username": "dmalam9@gmail.com",
            "password": "DQC6yQ",
            "fullname": "Derry Malam",
            "avatarPath": "/img/product/review-1.png",
            "isAdmin": false
        }];
        data.map(item => {
            item.createdAt = Sequelize.literal('NOW()');
            item.updatedAt = Sequelize.literal('NOW()');
            return item;
        });
        return queryInterface.bulkInsert('Users', data, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});

    }
};