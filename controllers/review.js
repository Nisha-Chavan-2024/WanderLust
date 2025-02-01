const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema.js");

module.exports.createReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);

    let newreview = new Review(req.body.review);
    newreview.author  = req.user._id;
    console.log(newreview);
    listing.review.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","Review Created..!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted..!");
    res.redirect(`/listings/${id}`);
}