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

const userRoutes = require('../routers/user.route');
const createRoutes = require('../routers/create.route');
const appendRoutes = require('../routers/append.route');
const deleteRoutes = require('../routers/delete.route');
const accountRoutes = require('../routers/account.route');
const storyRoutes = require('../routers/story.route');
const storyActionsRoutes = require('../routers/story.actions.route');
const activityRoutes = require('../routers/activity.route');
const authRoutes = require('../routers/auth.route');

// app.use('/api/user', userRoutes);
app.use('/api/v1', userRoutes);
// app.use('/api/create', createRoutes);
app.use('/api/v1', createRoutes);
// app.use('/api/delete', deleteRoutes);
app.use('/api/v1', deleteRoutes);
// app.use('/api/account', accountRoutes);
app.use('/api/v1', accountRoutes);
// app.use('/api/stories', storyRoutes);
app.use('/api/v1', storyRoutes);
// app.use('/api/story-actions', storyActionsRoutes);
app.use('/api/v1', activityRoutes);
// app.use('/api/activity', activityRoutes);
app.use('/api/v1', activityRoutes);
// app.use('/api/auth', authRoutes);
app.use('/api/v1', authRoutes);



//-----NEW-----

app.use('/api/contents/append', appendRoutes);
app.use('/api/story-actions', storyActionsRoutes);

app.get('/', (req, res) => {
  res.send("hello");
});

module.exports = app;
