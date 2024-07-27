const User = require('../models/userModel');
const bcrypt = require('bcrypt');



//registration
//hashing password
const securePassword = async (password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)  
        return passwordHash; 
    } catch (error) {
        console.log(error.massage);
    }
}

//render registration view
const loadRegister = async(req,res)=>{
    try {
        res.render('registration');
    } catch (error) {
        console.log(error.massage);
    }
}

// insert user to db
const insertUser = async (req, res) => {
    try {
        // Check if user already exists based on email, name, or phone number
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email },
                { name: req.body.name },
                { mobile: req.body.mno }
            ]
        });

        if (existingUser) {
            // User already exists, render registration page with error message
            return res.render('registration', { massage: 'User with this email, name, or phone number already exists' });
        }

        // If user does not exist, proceed with registration
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: req.file.filename,
            password: spassword,
        });

        const userData = await user.save();

        if (userData) {
            res.redirect('/login');
        } else {
            res.render('registration', { message: 'Your registration has failed' });
        }
    } catch (error) {
        console.log(error.message);
        res.render('registration', { message: 'An error occurred during registration' });
    }
};


//login user methode started

const loginLoad = async(req ,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.massage);
    }
}

//varify login
const varifyLogin = async(req,res)=>{
    try {
        const email= req.body.email;
        const password= req.body.password;

        const userData = await User.findOne({email:email})
        if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch) {
                if (userData.is_admin) {
                    res.render('login',{massage:"Enternig restricted"});
                } else {
                    req.session.user_id = userData._id;
                    req.session.is_admin = userData.is_admin;
                    res.redirect('/home');
                }
            } else {
                res.render('login',{massage:"incorrect email or password"});
            }
        } else {
            res.render('login',{massage:"no user found"});
        }
    } catch (error) {
        console.log(error.massage);
    }
}

//load home
const loadHome = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id})
        res.render('home', { user:userData });
    } catch (error) {
        console.log(error.massage);
    }
} 

//logout the user 

const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.massage)
        res.redirect('/home');
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    varifyLogin,
    loadHome,
    userLogout
}