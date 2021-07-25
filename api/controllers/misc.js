const status = async(req, res) => {
    res.send({success: true, version: process.env.VERSION, status: "good"})
}

module.exports = {status}