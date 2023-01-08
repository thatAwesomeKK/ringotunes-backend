import Ringtone from "../../models/Ringtone.js";
import User from "../../models/User.js";

export default async function (req, res) {
    try {
        //Getting Query Params
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        
        //Setting Starting and Ending Index
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        //Setting If next page exists
        if (endIndex < await Ringtone.countDocuments()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        //Setting If previous page exists
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        //Quering Mongo Collection
        results.ring = await Ringtone.find().populate({ path: 'uid', model: User, select: 'username pfp' }).select('ringID title thumbnail likes origin downloads createdAt').limit(limit).skip(startIndex)
        return res.status(200).json(results);
    } catch (err) {
        return res.status(400).send(err)
    }
}