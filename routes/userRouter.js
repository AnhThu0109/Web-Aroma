const { Router } = require("express");
var express = require("express");
var router = express.Router();
let userController = require("../controllers/userController");
const { body, validationResult } = require('express-validator');

function getErrorMessage(errors) {
    let msg = "";
    for (let i = 0; i<errors.length; i++){
        msg += `<p>${errors[i].msg}</p>`
    }
    return msg;
}

router.get("/login", (req, res) => {
    req.session.returnURL = req.query.returnURL;
    res.render("login", {banner: "Login / Register"});
})

router.post("/login", 
    // username must be an email
    body('username').isEmail().withMessage("Username must be an email address."),
    // password must be not empty
    body('password').notEmpty().withMessage("Password must be not empty."),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("login", {
                banner: "Login / Register",
                message: getErrorMessage(errors.array()),
                type: "alert-danger"
            });
        }
        
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

router.post("/register", 
    // fullname must be not empty
    body('fullname').notEmpty().withMessage("Fullname must be not empty."),
    // username must be an email
    body('username').isEmail().withMessage("Username must be an email address."),
    // password must be not empty
    body('password').notEmpty().withMessage("Password must be not empty."),
    body('password').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage("Password must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"),
    // confirmPassword must be not empty
    body('confirmPassword').custom((confirmPassword, {req}) => {
        if(confirmPassword != req.body.password) {
            throw new Error("Confirm password does not match.")
        }
        return true;
    }),
    (req, res, next) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("register", {
                banner: "Register",
                message: getErrorMessage(errors.array()),
                type: "alert-danger"
            });
        }

        let fullname = req.body.fullname;
        let email = req.body.username;
        let password = req.body.password;
        let keepLoggedIn = (req.body.keepLoggedIn != undefined);
    
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

router.post("/forgot", 
    // username must be an email
    body('username').isEmail().withMessage("Email must be an email address."),
    (req, res, next) => {
        let email = req.body.username;

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("forgot", {
                email,
                banner: "Forgot Password",
                message: getErrorMessage(errors.array()),
                type: "alert-danger"
            });
        }

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

router.post("/reset", 
    // username must be an email
    body('email').isEmail().withMessage("Email must be an email address."),
    // password must be not empty
    body('password').notEmpty().withMessage("Password must be not empty."),
    body('password').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/).withMessage("Password must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"),
    // confirmPassword must be not empty
    body('confirmPassword').custom((confirmPassword, {req}) => {
        if(confirmPassword != req.body.password) {
            throw new Error("Confirm password does not match.")
        } 
        return true;
    }),
    (req, res, next) => {
        let email = req.body.email;

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("reset", {
                email,
                banner: "Reset Password",
                message: getErrorMessage(errors.array()),
                type: "alert-danger"
            });
        }

        let password = req.body.password;

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

