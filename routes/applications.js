const express = require('express');
const router = express.Router();
const { applyToJob, getByEmployer, getByUser } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/',authMiddleware, roleMiddleware('job_seeker'), applyToJob);
router.get('/employer/:id', authMiddleware, roleMiddleware('employer'), getByEmployer);
router.get('/user/:id', authMiddleware, roleMiddleware('job_seeker'), getByUser);

module.exports = router;