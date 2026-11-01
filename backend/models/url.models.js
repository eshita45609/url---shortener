const mongoose = require("mongoose");


const urlSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
   } ,
    longUrl: String,
    shortCode:  {
        type: String,
        unique: true,
    },
    createdAt: Date,
    expiryDate: Date,
    clicks: {
        type: Number,
        default: 0,
    }
});

const url = mongoose.model("url", urlSchema);

module.exports = url;