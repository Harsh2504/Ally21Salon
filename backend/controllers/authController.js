const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const dotenv = require('dotenv');
const z = require("zod");
// Load environment variables
dotenv.config();



const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(8),
    role: z.enum(["Employee", "Manager"]),
  });

const userLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });



// Register a new user
const registerUser = async (req, res, next) => {
    try {
        const validate = userSchema.safeParse(req.body);
        if(!validate.success){
            return res.status(400).send(validate);
            // return res.status(400).send(validate.error.errors);
        }

        const { name, email, phone, password, role } = req.body;
        const userExists = await User.findOne({ email });
        // Check if user already exists
        if(userExists){
            // const error = new Error('User already exists');
           return res.status(400).send('User already exists');
            // throw error;
        }
        const hashed_password = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            phone,
            password: hashed_password,
            role,
        });
        const result = await user.save();
        // res.status(201).send(result);
        res.status(201).send('User created successfully');
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const validate = userLoginSchema.safeParse(req.body);
        if(!validate.success){
            return res.status(400).send(validate);
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch){
                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ msg:"Logged in successfully", token });
            }
            else{
                return res.status(401).send('Invalid credentials');
            }
        }else{
            return res.status(404).send('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser };