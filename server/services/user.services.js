import { User } from "../models/user.js";
async function getUserDetails(req, res) {
    const currId = req.session.user_id
    const currUser = await User.findById({ _id: currId })
    res.render({ currUser: currUser.userName })
}

export { getUserDetails }