const express = require('express');
const connectDB = require('../config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

connectDB();

const userRoutesV1 = require('../routers/v1/user.route');
const createRoutesV1 = require('../routers/v1/create.route');
const addRoutesV1 = require('../routers/v1/add.route');
const deleteRoutesV1 = require('../routers/v1/delete.route');
const accountRoutesV1 = require('../routers/v1/account.route');
const storyRoutesV1 = require('../routers/v1/story.route');
const storyActionsRoutesV1 = require('../routers/v1/story.actions.route');
const activityRoutesV1 = require('../routers/v1/activity.route');
const authRoutesV1 = require('../routers/v1/auth.route');

app.use('/api/v1', userRoutesV1);
app.use('/api/v1', createRoutesV1);
app.use('/api/v1', addRoutesV1);
app.use('/api/v1', deleteRoutesV1);
app.use('/api/v1', accountRoutesV1);
app.use('/api/v1', storyRoutesV1);
app.use('/api/v1', storyActionsRoutesV1);
app.use('/api/v1', activityRoutesV1);
app.use('/api/v1', authRoutesV1);

app.get('/', (req, res) => { res.send("hello"); });

module.exports = app;