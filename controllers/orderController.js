var controller = {};

var models = require("../models");

controller.saveOrder = function(cart, user, callback){
    models.Address
        .create(cart.address)
        .then(newAddress => {
            var order = {
                totalQuantity: cart.getTotalQuantity(),
                totalPrice: cart.getTotalPrice(),
                paymentMethod: cart.paymentMethod,
                status: "Processing",
                AddressId: newAddress.id,
                UserId: user.id
            };

            models.Order 
                .create(order)
                .then(newOrder => {
                    var items = cart.generateArray();
                    items.forEach(item => {
                        var detail = {
                            price: item.price,
                            quantity: item.quantity,
                            ProductId: item.item.id,
                            OrderId: newOrder.id
                        };

                        models.OrderDetail
                            .create(detail);
                    });

                    //Emty cart
                    cart.empty();
                    callback();
                })
        });
};

module.exports = controller;