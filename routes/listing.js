const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateError } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})


//get for all list index route
router.get(("/"), wrapAsync(listingController.index));

//get request for add new fields
router.get("/new", isLoggedIn, listingController.renderNewForm);

//update route using put request
router.put("/:id", isLoggedIn, isOwner,  upload.single("listing[image]"), validateError, wrapAsync(listingController.updateListing));

//get for show details
router.get("/:id", wrapAsync(listingController.showListing));



//post for add new field  (craeting new route)
router.post("/", isLoggedIn, upload.single("listing[image]"), validateError, wrapAsync(listingController.createListing));


//edit get request
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


//delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;