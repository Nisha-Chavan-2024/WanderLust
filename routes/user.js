const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const router = express.Router();
const {saveRedirecturl} = require("../middleware.js");

const userController = require("../controllers/user.js");


router.get("/signup" , userController.renderSignupForm);

router.post("/signup",wrapAsync(userController.signup));



router.get("/login" , userController.renderLoginForm);


router.post("/login",saveRedirecturl,passport.authenticate("local",{failureRedirect :"/login",failureFlash : true}),
userController.login);


//logging out user
router.get("/logout",userController.logout);

module.exports = router;