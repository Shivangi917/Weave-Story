const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routers/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
connectDB();

app.use(express.json());
app.use('/api', userRoutes);

app.use('/', (req, res) => {
    res.send("hello");
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})