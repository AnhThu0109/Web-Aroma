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

router.get("/forgot", (req, res, next) => {
    res.render("forgot", {
        banner: "Forgot Password",
        message: "Enter your email and we'll sent the instructions."
    })
})

router.post("/forgot", (req, res, next) => {
    let email = req.body.username;
    //Kiem tra email co ton tai khong
    
    userController.getUserByEmail(email)
        .then(user => {
            if (user) {
                //Neu co thi tao link
                let token = userController.createJWT(email);
                let host = req.header("host");
                let url = `${req.protocol}://${host}/users/reset?u=${email}&t=${token}`;
                //Gui email
                userController.sendResetPasswordMail(user, host, url)
                    .then((result) => {
                        //Neu thanh cong
                        return res.render("forgot", {
                            banner: "Forgot Password",
                            done: 1,
                            email
                        })
                    })
                    .catch((err) => {
                        return res.render("forgot", {
                            banner: "Forgot Password",
                            message: 'An error occured when trying send to your mail. Please try again!',
                            type: "alert-danger",
                            email
                        })
                    })   
            } else {
            //Nguoc lai neu mail khong ton tai
            return res.render("forgot", {
                banner: "Forgot Password",
                message: 'The email is not registered yet. Please try another email or <a href="/users/register">Sign up</a>',
                type: "alert-danger",
                email
            })}
        })     
        .catch(error => next(error)); 
})

router.get("/reset", (req, res, next) => {
    let email = req.query.u;
    let token = req.query.t;

    if(!email || !token) {
        res.redirect("/user/forgot");
    }
    let isVerify = userController.verifyJWT(token);
    if(isVerify){
        res.render("reset", {
            banner: "Reset Password", 
            email, 
            message: "Please enter your new password."
        });
    } else {
        res.render("forgot", {
            banner: "Forgot Password",
            message: "Your link is Expired. Enter your email and we'll sent the instructions."
        })
    }
});

router.post("/reset", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    if(password != confirmPassword){
        res.render("reset", {
            banner: "Reset Password",
            email,
            message: "Confirm password does not match",
            type: "alert-danger"
        })
    }
    userController.getUserByEmail(email)
        .then(user => {
            if(user) {
                user.password = password;
                userController.updatePassword(user);
                res.render("reset", {
                    banner: "Reset Password",
                    done: 1
                }) 
            } else {
                res.redirect("/users/forgot");
            }
        })
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

