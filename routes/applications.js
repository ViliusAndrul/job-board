const express = require('express');
const router = express.Router();
//const jwt = require('jsonwebtoken');
const { applyToJob, getByEmployer, getByUser } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//middleware to authenticate users
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// }


router.post('/',authMiddleware, roleMiddleware('job_seeker'), applyToJob);
router.get('/employer/:id', authMiddleware, roleMiddleware('employer'), getByEmployer);
router.get('/user/:id', authMiddleware, roleMiddleware('job_seeker'), getByUser);

module.exports = router;