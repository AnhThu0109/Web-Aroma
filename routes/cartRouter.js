var express = require("express");
var router = express.Router();
let orderController = require("../controllers/orderController");
let userController = require("../controllers/userController");

router.get("/", (req, res) => {
    var cart = req.session.cart;
    res.locals.cart = cart.getCart();
    res.render("cart", {banner: "Shopping Cart"});
})

router.post("/", (req, res, next) => {
    var productId = req.body.id;
    var quantity = isNaN(req.body.quantity) ? 1 : req.body.quantity;
    var productController = require("../controllers/productController");
    productController
        .getById(productId)
        .then(product => {
            var cartItem = req.session.cart.add(product, productId, quantity);
            res.json(cartItem);
        })
        .catch(error => next(error));
});

router.put("/", (req, res) => {
    var productId = req.body.id;
    var quantity = parseInt(req.body.quantity);
    var cartItem = req.session.cart.update(productId, quantity);
    res.json(cartItem);
});

router.delete("/", (req, res) => {
    var productId = req.body.id;
    req.session.cart.remove(productId);
    res.json({
        totalQuantity: req.session.cart.totalQuantity,
        totalPrice: req.session.cart.totalPrice
    });
});

router.delete("/all", (req, res) => {
    req.session.cart.empty();
    res.sendStatus(204);
    res.end();
});


router.get("/checkout", userController.isLoggedIn, (req, res) => {
    var cart = req.session.cart;
    res.locals.cart = cart.getCart();
    res.render("checkout", {banner: "Product Checkout"});
});

router.post("/checkout/shipping", userController.isLoggedIn, (req, res) => {
    var address = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country
    };
    req.session.cart.address = address;
    var cart = req.session.cart;
    res.locals.cart = cart.getCart();
    res.render("payment", {banner: "Product Checkout"});
});

router.post("/checkout/payment", userController.isLoggedIn, (req, res) => {
    var paymentMethod = req.body.paymentMethod;
    if(paymentMethod == "COD"){
        req.session.cart.paymentMethod = paymentMethod;
        orderController.saveOrder(req.session.cart, req.session.user, function(){
            res.locals.paymentStatus = "PAYMENT COMPLETE";
            res.locals.paymentMessage = "Your order has been proceed! Thank you.";
            res.render("confirmation", {banner: "Order Confirmation"});
        })
    } else {
        res.locals.paymentStatus = "SORRY";
        res.locals.paymentMessage = "Sorry, this payment method has not been supported!";
        res.render("confirmation", {banner: "Order Confirmation"});
    }
});

module.exports = router;