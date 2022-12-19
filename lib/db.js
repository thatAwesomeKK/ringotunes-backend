const mongoose = require('mongoose');
const mongoURI = process.env.DATABASE_URL

async function connectToMongo() {
    mongoose.set('strictQuery', false);
    await mongoose
        .connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
        })
        .then(() => {
            console.log("Connection Succesfull");
        })
        .catch((e) => {
            console.log(e);
        });
}

module.exports = connectToMongo