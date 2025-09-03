const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routers/user.route');
const createRouter = require('./routers/create.route');
const addRouter = require('./routers/add.route');
const deleteRouter = require('./routers/delete.route');
const accountRouter = require('./routers/account.route');
const storyRouter = require('./routers/story.route');
const storyActionsRouter = require('./routers/story.actions.route');
const activityRoutes = require('./routers/activity.route');
const authRoute = require('./routers/auth.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ 
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
connectDB();

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', createRouter);
app.use('/api', addRouter);
app.use('/api', deleteRouter);
app.use("/api", accountRouter);
app.use("/api", storyRouter);
app.use("/api", storyActionsRouter);
app.use("/api", activityRoutes);
app.use("/api", authRoute);

app.get('/', (req, res) => { res.send("hello"); });


app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})