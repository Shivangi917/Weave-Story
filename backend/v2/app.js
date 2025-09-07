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

const userRoutes = require('../routers/v1/user.route');
const createRoutes = require('../routers/v1/create.route');
const addRoutes = require('../routers/v1/add.route');
const deleteRoutes = require('../routers/v1/delete.route');
const accountRoutesV1 = require('../routers/v1/account.route');
const storyRoutesV1 = require('../routers/v1/story.route');
const storyActionsRoutesV1 = require('../routers/v1/story.actions.route');
const activityRoutesV1 = require('../routers/v1/activity.route');
const authRoutesV1 = require('../routers/v1/auth.route');

app.use('/api/users', userRoutesV1);
app.use('/api/create', createRoutesV1);
app.use('/api/add', addRoutesV1);
app.use('/api/delete', deleteRoutesV1);
app.use('/api/account', accountRoutesV1);
app.use('/api/stories', storyRoutesV1);
app.use('/api/story-actions', storyActionsRoutesV1);
app.use('/api/activity', activityRoutesV1);
app.use('/api/auth', authRoutesV1);

app.get('/', (req, res) => { res.send("hello"); });

module.exports = app;