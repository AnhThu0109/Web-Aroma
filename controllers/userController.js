let controller = {};
let models = require("../models");
let User = models.User;
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
const SECRET_KEY = "fgdfgj";

controller.getUserByEmail = (email) => {
    return User.findOne ({ 
        where: { username: email}
    });
};

controller.createUser = (user) => {
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    return User.create(user);
};

controller.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

controller.isLoggedIn = (req, res, next) => {
    if(req.session.user) { 
        next();
    } else {
        res.redirect(`/users/login?returnURL=${req.originalUrl}`);
    }
};

controller.createJWT = (email) => {
    return jwt.sign({ email },
        SECRET_KEY,
        { expiresIn: "30m"}
    );
}

controller.verifyJWT = (token) => {
    try { 
        jwt.verify(token, SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
}

controller.sendResetPasswordMail = (user, host, url) => {
    const Mailjet = require("node-mailjet");
    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY_PUBLIC || "a0515fdd32da54eba66da42b4d5fe0a1",
        process.env.MJ_APIKEY_PRIVATE || "ae505e19f4a1a8dfa1c77f97048c9915"
    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
          Messages: [
            {
              From: {
                Email: "thu010997@gmail.com",
                Name: "Aroma Shop"
              },
              To: [
                {
                  Email: user.username,
                  Name: user.fullname
                }
              ],
              Subject: "Reset Password",
              TextPart: "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
              HTMLPart: 
              `<p>Hi ${user.fullname},</p>
              <br>
              <p>You recently requested to reset the password for your ${host} account. Click the link below to proceed.</p>
              <p><a href="${url}">Reset Password</a></p>
              <p>If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.</p>
              <br>
              <p>Thanks, </p>
              <p>Aroma Shop</p>`
            }
          ]
        });
    return request;
}

controller.updatePassword = (user) => {
    var salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
    return User.update({
        password: user.password,
    }, {
        where: { id: user.id }
    });
};



module.exports = controller;