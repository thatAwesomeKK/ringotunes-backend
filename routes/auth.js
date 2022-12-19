const express = require('express')
const User = require('../models/User')
const router = express.Router()
const bcrypt = require('bcryptjs');
const { getAccessToken, getRefreshToken } = require('../methods/jwtCreation');
const { verifyRefreshToken, verifyAccessToken } = require('../middleware/jwtVerify');
const cookieConfig = { sameSite: 'none', secure: true, httpOnly: true, domain: 'localhost' }

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: 'A User with this Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(password, salt);

        const avatarUrl = `https://avatars.dicebear.com/api/adventurer-neutral/${username}.svg`

        let newUser = new User({
            username,
            email,
            pfp: avatarUrl,
            password: secPass,
        });
        await newUser.save()
        return res.status(200).json({ success: true, message: "Successfully Registered" });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Internal Server Error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        //Checking if user with email exists
        let foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(400).json({ success: false, error: "Wrong Credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, foundUser.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: "Wrong Credentials" })
        }

        let accessToken = await getAccessToken({ id: foundUser._id });

        //generating refresh token
        let refreshToken = await getRefreshToken({ id: foundUser._id });

        //setting refreshToken in Cookie
        res.cookie("refreshToken", refreshToken, cookieConfig);
        return res.status(200).json({ success: true, accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Internal Server Error' })
    }
})

//Verify Referesh Token and Send Access Token
router.get("/refresh", verifyRefreshToken, async (req, res) => {
    try {
        let user = await User.findById({ _id: req.verify.id });
        if (!user) {
            res.clearCookie('refreshToken', cookieConfig)
            return res.status(401).json({ success: false });
        }
        const accessToken = await getAccessToken({ id: user.id });
        res.cookie("refreshToken", await getRefreshToken({ id: user.id }), cookieConfig);
        return res.json({ success: true, accessToken: `Bearer ${accessToken}` });
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(500).json({ success: false, error: error })
    }
});

//Logout 
router.post("/logout", verifyAccessToken, async (req, res) => {
    try {
        let user = await User.findById({ _id: req.verify.id });
        if (!user) {
            res.clearCookie('refreshToken', cookieConfig)
            return res.status(200).json({ success: true });
        }
        res.clearCookie('refreshToken', cookieConfig)
        return res.status(200).json({ success: true });
    } catch (error) {
        res.clearCookie('refreshToken', cookieConfig);
        return res.status(500).json({ success: false, error: error })
    }
});


module.exports = router