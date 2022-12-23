const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000;
const connectToMongo = require('./lib/db');
connectToMongo()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json({ limit: '1000mb' }))
app.use(express.urlencoded({ extended: false }))

app.use('/auth', require('./routes/auth'))
app.use('/ring', require('./routes/ringtones'))

// serves the application at the defined port
app.listen(PORT, () => {
    console.log(`Server is running on : http://localhost:${PORT}`);
});