const JWT = require("jsonwebtoken")
const Connection = require("../utils/connect.js")
/*
    This middleware ensures that the endpoints that follow
    it can only be accessed by an authenticated user
*/
const userEndpoint = async(req, res, next) => {
    if (!("authorization" in req.headers)) return res.send({success: false, error: "missing-auth"})
    const authHeader = req.headers.authorization
    try {
        const payload = JWT.verify(authHeader, process.env.TOKEN_SECRET)
        const coll = Connection.collections.users
        if (await coll.findOne({username: payload.username}) === null) return res.send({success: false, error: "deleted-user"})
        res.locals.username = payload.username
    }
    catch {
        return res.send({success: false, error: "invalid-token"})
    }
    
    next()
}

const tutorEndpoint = async(req, res, next) => {
    if (!("authorization" in req.headers)) return res.send({success: false, error: "missing-auth"})
    const authHeader = req.headers.authorization
    try {
        const payload = JWT.verify(authHeader, process.env.TOKEN_SECRET)
        const coll = Connection.collections.users
        const perms = await coll.findOne({username: payload.username}, {projection: {_id: 0, perms: 1}})
        if (perms === null) return res.status(403).send({success: false, error: "deleted-user"})
        if (perms.perms !== 1) return res.status(403).send({success: false, error: "insufficient-perms"})
        
        res.locals.username = payload.username
    }
    catch {
        return res.send({success: false, error: "invalid-token"})
    }
    
    next()
}

const adminEndpoint = async(req, res, next) => {
    if (!("authorization" in req.headers)) return res.send({success: false, error: "missing-token"})
    const authHeader = req.headers.authorization
    try {
        const payload = JWT.verify(authHeader, process.env.TOKEN_SECRET)
        const coll = Connection.collections.users
        const perms = await coll.findOne({username: payload.username}, {projection: {_id: 0, perms: 1}})
        if (perms === null) return res.status(403).send({success: false, error: "deleted-user"})
        if (perms.perms < 3) return res.status(403).send({success: false, error: "insufficient-perms"})
        
        res.locals.username = payload.username
    }
    catch {
        return res.send({success: false, error: "invalid-token"})
    }

    next()
}
module.exports = {userEndpoint, tutorEndpoint, adminEndpoint}