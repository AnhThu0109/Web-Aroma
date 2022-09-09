var express = require("express");
var router = express.Router();
var userController = require("../controllers/userController");

router.post("/", userController.isLoggedIn, (req, res, next) => {
    let controller = require("../controllers/reviewController");
    let review = {
        userId: req.session.user.id,
        productId: req.body.productId,
        rating: req.body.rating,
        message: req.body.message
    };

    controller
        .add(review)
        .then(() => {
            res.redirect("../products/" + review.productId);
        })
        .catch(error => next(error))
})

module.exports = router;