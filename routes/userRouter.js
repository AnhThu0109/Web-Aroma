const { Router } = require("express");
var express = require("express");
var router = express.Router();
let userController = require("../controllers/userController");

router.get("/login", (req, res) => {
    req.session.returnURL = req.query.returnURL;
    res.render("login", {banner: "Login / Register"});
})

router.post("/login", (req, res, next) => {
    let email = req.body.username;
    let password = req.body.password;
    let keepLoggedIn = (req.body.keepLoggedIn != undefined);
    userController
        .getUserByEmail(email)
        .then(user => {
            if(user) {
                if (userController.comparePassword(password, user.password)) {
                    req.session.cookie.maxAge = keepLoggedIn ? 30 * 24 * 60 * 60 * 1000 : null;
                    req.session.user = user;
                    if(req.session.returnURL){
                        res.redirect(req.session.returnURL);
                    } else {
                        res.redirect("/");
                    }
                } else {
                    res.render("login", {
                        banner: "Login / Register",
                        message: "Incorrect Password!",
                        type: "alert-danger"
                    });
                }
            } else {
                res.render("login", {
                    banner: "Login / Register",
                    message: "Email does not exists!",
                    type: "alert-danger"
                });
            }     
        });
});

router.get("/register", (req, res) => {
    res.render("register", {banner: "Register"});
})

router.post("/register", (req, res, next) => {
    let fullname = req.body.fullname;
    let email = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    let keepLoggedIn = (req.body.keepLoggedIn != undefined);

    //Kiem tra confirm password va password giong nhau
    if (password != confirmPassword){
        return res.render("register", {
            banner: "Register",
            message: "Confirm password does not match!",
            type: "alert-danger"
        });
    }
   
    //Kiem tra username chua ton tai
    userController
        .getUserByEmail(email)
        .then(user => {
            if (user){
                return res.render("register", {
                    banner: "Register",
                    message: `Email ${email} exists! Please choose another email!`,
                    type: "alert-danger"
                });
            }
            //Tao tai khoan
            user = {
                fullname,
                username: email,
                password
            };
            userController
                .createUser(user)
                .then(user => {
                    if (keepLoggedIn){
                        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
                        req.session.user = user;
                        res.redirect("/");
                    } else {
                        res.render("login", {
                            banner: "Login / Register",
                            message: "You have registered, now please login!",
                            type: "alert-primary"
                        });
                    }      
                })
        })
        .catch(error => next(error));
});

router.get("/logout", (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }
        return res.redirect("/users/login");
    });
});

module.exports = router;
// var orderController = require("../controllers/orderController");
// router.get("/orders", userController.isLoggedIn, (req, res) => {
//     var user = req.session.user;
//     orderController.getByUser(user, (orders) => {
//         res.locals.orders = orders;
//         res.render("orderhistory");
//     });
// });

// router.get("/orders/:id", userController.isLoggedIn, (req, res) => {
//     var id = req.params.id;
//     orderController.getById(id, (details) => {
//         res.locals.details = details;
//         res.render("orderdetails");
//     })
// })

