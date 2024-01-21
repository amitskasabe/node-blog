const JWT = require("jsonwebtoken")
const secret = "amitskasabe";
function createTokenForUser(user){
    const payLoad = {
        _id : user.id,
        email : user.email
    }
}