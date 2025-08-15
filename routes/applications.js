const express = require('express');
const path = require('path');
const fs = require('fs');
const { applyToJob, getByEmployer, getByUser } = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/employer', authMiddleware, roleMiddleware('employer'), getByEmployer);
router.get('/user/:id', authMiddleware, roleMiddleware('job_seeker'), getByUser);

router.get('/:filename', authMiddleware, roleMiddleware('employer'), (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'resumes', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.sendFile(filePath);
  });
});

router.post('/', authMiddleware, roleMiddleware('job_seeker'), upload.single('resume'), applyToJob);

module.exports = router;