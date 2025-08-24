const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routers/userRoutes');
const createRouter = require('./routers/createRouter');
const addRouter = require('./routers/addRouter');
const deleteRouter = require('./routers/deleteRouter');
const accountRouter = require('./routers/accountRouter');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
connectDB();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', createRouter);
app.use('/api', addRouter);
app.use('/api', deleteRouter);
app.use("/api", accountRouter);

app.get('/', (req, res) => { res.send("hello"); });


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})