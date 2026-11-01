const express = require("express")
const router = express.Router();
const {redirectToLongUrl} = require("../controllers/url.controller");



router.get("/" ,(req,res) => {
    res.send("url shortner backend is running")
})

router.get("/:shortCode", redirectToLongUrl);

module.exports = router;