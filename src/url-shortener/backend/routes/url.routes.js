const express = require("express");
console.log("router");
const router = express.Router();
const {createShortUrl,
     fetchDocument,
     deleteUrl,
    } = require("../controllers/url.controller");
const authMiddleware = require("../middleware/auth.middleware");    


router.post("/shorten", authMiddleware, createShortUrl);


router.post("/guest/shorten", createShortUrl);




router.get("/urls", authMiddleware, fetchDocument);


router.delete("/:id", authMiddleware, deleteUrl);










module.exports = router;