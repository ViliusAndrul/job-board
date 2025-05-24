const express = require("express");
const cors = require('cors');
require("dotenv").config();

const db = require("./db");

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Job Board API is running...");
});

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.listen(PORT, () =>console.log(`Server running on http://localhost:${PORT}`));