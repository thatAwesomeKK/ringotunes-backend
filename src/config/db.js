import mongoose from 'mongoose'
const mongoURI = process.env.DATABASE_URL

export async function connectToMongo() {
    mongoose.set('strictQuery', false);
    const db = await mongoose
        .connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
        })
    return db
}

