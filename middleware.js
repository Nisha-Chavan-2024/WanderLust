const passport = require("passport");
const { listingSchema,reviewSchema } = require("./schema.js");
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExressError = require("./utils/expressError.js");
// const {listingSchema } = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;

        req.flash("error","You Must be logged in!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirecturl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirect = req.session.redirectUrl;
    }
    next();
}


module.exports.validateError = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExressError(400,errMsg);
    }else{
        next();
    }
};


module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExressError(400,errMsg);
    }else{
        next();
    }
};


module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;

    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curUser._id))
    {
       req.flash("error","You are not the owner!");
       return res.redirect(`/listings/${id}`);
    }

    next();
};




module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id))
    {
       req.flash("error","You are not the author of review!");
       return res.redirect(`/listings/${id}`);
    }

    next();
};

