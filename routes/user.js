const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middleware/jwtVerify");
const Ringtone = require("../models/Ringtone");
const User = require("../models/User");

router.post('/handle-like', verifyAccessToken, async (req, res) => {
    console.log('hello');
    try {
        const user = await User.findById({ _id: req.verify.id });
        const { docID } = req.body

        const ring = await Ringtone.findById({ _id: docID })

        if (ring.likes.includes(user.id)) {
            await Ringtone.findOneAndUpdate({ _id: docID }, {
                $pull: {
                    likes: user.id
                }
            })
        } else {
            await Ringtone.findOneAndUpdate({ _id: docID }, {
                $addToSet: {
                    likes: user.id
                }
            })
        }

        return res.status(200).json({ message: 'Liked!' });
    } catch (err) {
        return res.status(400).send(err)
    }
})

router.post('/check-like', verifyAccessToken, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.verify.id });
        const { docID } = req.body

        const ring = await Ringtone.findById({ _id: docID })

        if (ring.likes.includes(user.id)) {
            return res.status(200).json(true);
        }
        return res.status(200).json(false);
    } catch (err) {
        return res.status(400).send(false)
    }
})

router.get('/user-rings/:uid', async (req, res) => {
    const {uid} = req.params
    console.log(uid);
    try {
        const user = await User.findById({ _id: uid });
        if(!user){
            return res.status(400).send({error: "User Does Not Exist"})
        }

        const ring = await Ringtone.find({ uid: user.id }).select('ringID title thumbnail likes origin downloads createdAt')

        let likesCount = 0;
        ring.forEach((ring)=>{
            likesCount+=ring.likes.length
        })
        return res.status(200).json({rings: ring, likesCount, uid:{pfp: user.pfp, username: user.username}});
    } catch (err) {
        return res.status(400).send({error: err})
    }
})
module.exports = router
