const mongoDB = require('mongodb')

class Connection {

    static async open() {

        if (this.db) return true
        await mongoDB.MongoClient.connect("mongodb://localhost:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(async (client) => {
            const db = client.db('tuitiongowhere')
            const collections = {
                users: db.collection('users'),
                tutors: db.collection('tutors')
            }
            this.db = db
            this.collections = collections
            console.info("MongoDB connected successfully!")
        }).catch((error) => {
            console.error(error)
            console.error("Error connecting to MongoDB")
            return false
        })
        return true
    }

}

Connection.db = null
Connection.collections = null
module.exports = Connection