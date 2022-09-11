'use strict';
module.exports = (sequelize, DataTypes) => {
    var Address = sequelize.define('Address', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        country: DataTypes.STRING,
        state: DataTypes.STRING,
        zip: DataTypes.STRING
    }, {});
    Address.associate = function(models) {
        // associations can be defined here
        Address.belongsTo(models.User, { foreignKey: 'userId' });
        Address.hasMany(models.Order);
    };
    return Address;
};