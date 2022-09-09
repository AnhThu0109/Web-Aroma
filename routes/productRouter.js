var express = require("express");
var router = express.Router();
router.get("/", function(req, res, next){
    if((req.query.category == null) || isNaN(req.query.category)){
        req.query.category = 0;
    }
    if((req.query.brand == null) || isNaN(req.query.brand)){
        req.query.brand = 0;
    }
    if((req.query.color == null) || isNaN(req.query.color)){
        req.query.color = 0;
    }
    if((req.query.min == null) || isNaN(req.query.min)){
        req.query.min = 0;
    }
    if((req.query.max == null) || isNaN(req.query.max)){
        req.query.max = 100;
    }
    if((req.query.sort == null)){
        req.query.sort = "name";
    }
    if((req.query.limit == null) || isNaN(req.query.limit)){
        req.query.limit = 9;
    }
    if((req.query.page == null) || isNaN(req.query.page)){
        req.query.page = 1;
    }
    if((req.query.search == null) || (req.query.search.trim() == "")){
        req.query.search = "";
    }
    let categoryController = require("../controllers/categoryController");
    categoryController
        .getAll(req.query)
        .then(data => {
            res.locals.categories = data;
            let brandController = require("../controllers/brandController");
            return brandController.getAll(req.query);
        })
        .then(data => {
            res.locals.brands = data;
            let colorController = require("../controllers/colorController");
            return colorController.getAll(req.query);
        })
        .then(data => {
            res.locals.colors = data;
            let productController = require("../controllers/productController");
            return productController.getTopProducts();
        })
        .then(data => {
            res.locals.topProducts = data;       
            let productController = require("../controllers/productController");
            return productController.getAll(req.query);
        })
        .then(data => {
            res.locals.products = data.rows;   
            res.locals.pagination = {
                page: parseInt(req.query.page),
                limit: parseInt(req.query.limit),
                totalRows: data.count
            }
            res.render("category", {banner: "Shop Category"});
        })
        .catch(error => next(error));
})
router.get("/:id", function(req, res, next){
    let productController = require("../controllers/productController");
    productController
        .getById(req.params.id)
        .then(product => {
            res.locals.product = product;
            let productController = require("../controllers/productController");
            return productController.getTopProducts();
        })
        .then(data => {
            res.locals.topProducts = data;         
            let reviewController = require("../controllers/reviewController");
            return reviewController.getUserReviewProduct(
                req.session.user ? req.session.user.id : 0, 
                req.params.id
            );
        })
        .then(review => {
            res.locals.userReview = review;         
            res.render("singleproduct", {banner: "Shop Single"});
        })
        .catch(error => next(error))
});

module.exports = router;