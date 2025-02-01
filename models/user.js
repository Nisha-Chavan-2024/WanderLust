
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");


//create the user schema
const userSchema = new Schema({
    email : {
        type : String,
        required : true
    },
});

userSchema.plugin(passportLocalMongoose);

//export the module(Collection)
module.exports = mongoose.model("User",userSchema);