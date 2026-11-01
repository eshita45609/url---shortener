const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


async function signUp(req, res) {
    try {
        const {name, email, password} = req.body;

     
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Please provide a vaild name, email, and password",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please provide a vaild email address",
            });
        }


        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be atleast 8 characters long",
            });
        }


            
            const existingUser = await User.findOne({
                email: normalizedEmail,
            });

            if (existingUser) {
                return res.status(409).json({
                    message: "An account with this email already exists",
                });
            }

           
            const hashedPassword = await bcrypt.hash(password, 12);

            
            const user = await User.create({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
            });

            
            return res.status(201).json({
                message: "Account created successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
    
    } catch (error) {
        console.log("signup error:", error);

        return res.status(500).json({
            message: "Something went wrong while creating your account",
            error: error.message,
        });
    }
}

   
    async function login(req, res) {
        try {
            const {email, password} = req.body;

            if (
                typeof email !== "string" ||
                typeof password !== "string" ||
                !email.trim() ||
                !password
            ) {
                return res.status(400).json({
                    message: "Please provide email and password",
                });     
            }

           
            const normalizedEmail = email.trim().toLowerCase();

            const user = await User.findOne({
                email: normalizedEmail,
            });

            if (!user) {
                return res.status(401).json({
                    message: "Invaild email or password",
                });
            }

            
            const isPasswordVaild = await bcrypt.compare(
                password,
                user.password
            );


            if (!isPasswordVaild) {
                return res.status(401).json({
                    message: "Invaild email or password",
                })
            }

          
            const token = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET,
                {expiresIn: "1h"}
            );

            
            return res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });

        } catch (error) {
            console.log("Login error:" , error);
            return res.status(500).json({
                message: "Something went wrong while logging in",
            });
        }
    }




module.exports = {signUp, login};