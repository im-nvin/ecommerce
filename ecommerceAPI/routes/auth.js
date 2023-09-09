const router = require('express').Router();
const User = require('../modals/User'); // Assuming you have the User model imported correctly
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");


router.post('/register', (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(422).json({ error: "fields cannot be empty" })
    }
    User.findOne({ email: email }).then((userExist) => {
        if (userExist) {
            return res.status(422).json({ error: "Email is already exist" })
        }
        const newUser = new User({ username, email, password })
        newUser.save().then(() => {
            return res.status(201).json({ message: "user registration successfully" })
        }).catch((err) => {
            return res.status(500).json({ error: "something went wrong please try again" })
        })
    })

    //     try {
    //         const newUser = new User({
    //             username: req.body.username,
    //             email: req.body.email,
    //             password: req.body.password,
    //         });

    //         const savedUser = await newUser.save();
    //         res.status(200).json({ message: "User created successfully" });
    //     } catch (err) {
    //         res.status(500).json({ error: "Something went wrong" });
    //         console.log(err)
    //     }
    // });
})

//login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'fields cannot be empty' })
        }
        //findOne mentod return promises so we have to await it
        const userLogin = await User.findOne({ username: username });


        if (userLogin) {
            //checking password is match or not
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();


            if (!isMatch) {
                res.status(400).json({ message: "Invalid credentials" })
            } else {
                res.json({ message: "user sign successfully" })
            }
        } else {
            res.status(400).json({ message: "Invalid credentials" })

        }

    } catch (err) {
        console.log(err)
    }
})
module.exports = router;
