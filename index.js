let express = require("express");
let app = express();
var models = require("./models");
app.get("/sync", (req, res) => {
    models.sequelize.sync({force: true}).then(function(){
        res.send("Database sync completed!");
    });
});

//Set public static folder
app.use(express.static(__dirname + "/public"));

//Use view engine
const Handlebars = require("handlebars");
var hbs = require("express-handlebars");
let helper = require("./controllers/helper");
let paginateHelper = require("express-handlebars-paginate");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
app.engine("hbs", hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    helpers: {
        createStarList: helper.createstarlist,
        createStars: helper.creatStars,
        createPagination: paginateHelper.createPagination
    }
}));
app.set("view engine", "hbs");

//Use Body parser
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Use Cookie-parser
let cookieParser = require("cookie-parser");
app.use(cookieParser());

//Use Session
let session = require("express-session");
app.use(session({
    cookie: { httpOnly: true, maxAge: null},
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}));

//Use Cart Controller //Khoi tao gio hang
let Cart = require("./controllers/cartController");
app.use((req, res, next) => {
    var cart = new Cart(req.session.cart ? req.session.cart: {});
    req.session.cart = cart;
    res.locals.totalQuantity = cart.totalQuantity;
    
    res.locals.fullname = req.session.user ? req.session.user.fullname: "";
    res.locals.isLoggedIn = req.session.user ? true: false;
    next();
})

//Define your routes here
app.use("/", require("./routes/indexRouter"));
//URL: /products or /products/12
app.use("/products", require("./routes/productRouter"));
app.use("/cart", require("./routes/cartRouter"));
app.use("/comments", require("./routes/commentRouter"));
app.use("/reviews", require("./routes/reviewRouter"));
app.use("/users", require("./routes/userRouter"));

app.get('/:page', (req, res) => {
    let banners = {
        blog: "Our Blog",
        checkout: "Product Checkout",
        confirmation: "Order Confirmation",
        contact: "Contact Us",
        singleblog: "Blog Details",
        trackingorder: "Order Tracking"
    };
    let page = req.params.page;
    res.render(page, {banner: banners[page]});
});




//Set server port and start server
app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), () => {
    console.log(`Server is listening on port ${app.get("port")}`);
})