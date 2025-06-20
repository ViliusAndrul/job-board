const express = require('express');
const router = express.Router();

const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
} = require('../controllers/jobController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//public route
router.get('/', authMiddleware, roleMiddleware('job_seeker'), getAllJobs);
router.get('/:id', getJobById);

//protected routes
router.post('/', authMiddleware, roleMiddleware('employer'), createJob);
router.put('/:id', authMiddleware, roleMiddleware('employer'), updateJob);
router.delete('/:id', authMiddleware, roleMiddleware('employer'), deleteJob);

module.exports = router;