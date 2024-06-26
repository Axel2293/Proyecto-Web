require('dotenv').config()

module.exports = {
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    getUrl: function (){
      return `mongodb+srv://${this.user}:${this.password}@${this.dbName}.kgpbo46.mongodb.net/API?retryWrites=true&w=majority&appName=Cluster0`
    }
}