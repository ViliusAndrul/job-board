const db = require('../db');

//apply to a job
exports.applyToJob = (req, res) => {
  if (req.user.role !== 'job_seeker') {
    return res.status(403).json({ message: 'Only job seekers can apply' });
  }

  const { job_id, resume_url } = req.body;

  if (!job_id) {
    return res.status(400).json({ error: 'Missing job_id in request body' });
  }

  const userId = req.user.id;

  const check = 'SELECT * FROM applications WHERE user_id = ? AND job_id = ?';
  db.query(check, [userId, job_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error during check' });

    if (result.length > 0) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const insert = 'INSERT INTO applications (job_id, user_id, resume_url) VALUES (?, ?, ?)';
    db.query(insert, [job_id, userId, resume_url || null], (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error during insert', details: err });
      res.json({ message: 'Application submitted', id: result.insertId });
    });
  });
};


//get all job applications for employer
exports.getByEmployer = (req, res) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({message: 'Only employers can view applications'});
    }
    const employerId = req.user.id;
    const sql = `
    SELECT a.*, u.username, j.title
    FROM applications a
    JOIN users u ON a.user_id = u.id
    JOIN jobs j ON a.job_id = j.id
    WHERE j.employer_id = ?
    `;
    db.query(sql, [employerId], (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results);
    });
};

//Get applications by user
exports.getByUser = (req, res) => {
    if(req.user.id != req.params.id) {
        return res.status(403).json({message: 'Unauthorized'});
    }

    const sql = `
    SELECT a.*, j.title
    FROM applications a
    JOIN jobs J ON a.job_id = j.id
    WHERE a.user_id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if(err) return res.status(500).json({error: err});
        res.json(results);
    });
};