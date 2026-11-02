const Url = require("../models/url.models");
const mongoose = require("mongoose");
const createShortUrl = async (req,res) => {
    try {
    
        const {longUrl, customAlias, expiryDate} = req.body;

        
        if (!longUrl) {
            return res.status(400).json({
                message: "long url is required",
            });
        }

        
       
        try {
            new URL(longUrl);
        } catch(error) {
            return res.status(400).json({
                message: "Invaild Url",
            });
        }

        
        let shortCode;

        if (customAlias) {
            const existingUrl = await Url.findOne({
                shortCode:  customAlias,
            });

         if (existingUrl) {
            return res.status(400).json({
                message: "Custom alias already exist",                                            

            });
        }

          shortCode =  customAlias;

          
        
        } else {
            
            const {nanoid} = await import("nanoid");

            let existingUrl;

            do {
                shortCode = nanoid(8);

                existingUrl = await Url.findOne({shortCode});
                
            } while (existingUrl);
             
            
        }

        const createdAt = new Date();
        console.log("current" , createdAt)

        
       
        const url = await Url.create({
            userId: req.user?.userId,
            longUrl,
            shortCode,
            createdAt,
            expiryDate,
        

        });

        const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
        return res.status(201).json({...url.toObject(), shortUrl});
     
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    
    }
};

   
    const redirectToLongUrl = async (req, res) => {
        try {
            const {shortCode} = req.params;

            const url = await Url.findOne({shortCode});

            
              if (!url) {
                return res.status(400).json({
                    message: "Short url not found",
                });
            }

           
             url.clicks++;
            await url.save();
           
               
            
            if (url.expiryDate) {
                if (new Date() > url.expiryDate) {
                    return res.status(404).json({
                        message: "This link has expired",
        
            
                    });
                }
                        
            }
 
            return res.redirect(url.longUrl);

        
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal2 server error",
            });
        }      
    }

        const fetchDocument = async(req, res) => {
            try {
                const urls = await Url.find({
                     userId: req.user.userId,
                });
               

                if (urls.length === 0) {
                    return res.status(200).json([]);

                }

                return res.status(200).json(urls);

            } catch(error) {
                return res.status(500).json({
                    message: "Internal server error",
                })
            }
        }
            const deleteUrl = async(req, res) => {
                try {
                      const {id} = req.params;

                      if (!mongoose.Types.ObjectId.isValid(id)) {
                        return res.status(404).json({
                            message: "Url  not found",
                        })
                      }
                     
                      const deletedUrl = await Url.findOneAndDelete({
                        _id: id,
                        userId: req.user.userId,
                      });

                       

                      
                      if (!deletedUrl) {
                        return res.status(404).json({
                            message: "url not found",
                        });
                      }

                      res.status(201).json({
                        message: "Url deleted successfully",
                      });

                } catch(error) {
                   console.error("delete url error:", error);
                    res.status(500).json({
                        message: "Error deleting url",
                    })
                }
            }
        
    
module.exports = {
    createShortUrl,
    redirectToLongUrl,
    fetchDocument,
    deleteUrl
};