const mongoose = require('mongoose');
const config = require('./config');
console.log(config.getUrl())

mongoose.connect(config.getUrl(), {
    useNewUrlParser: true
})
.then(()=> console.log(`Connected to the DB ${config.dbName}`))
.catch((err)=> console.log('Error while connecting to DB', err));

module.exports = {mongoose}