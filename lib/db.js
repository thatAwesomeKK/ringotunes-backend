const mongoose = require('mongoose');

async function connectToMongo() {
    mongoose.set('strictQuery', false);
    await mongoose
        .connect('mongodb://localhost:27017/ringotunes')
        .then(() => {
            console.log("Connection Succesfull");
        })
        .catch((e) => {
            console.log(e);
        });
}

module.exports = connectToMongo