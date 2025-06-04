const db = require('../db');

//CREATE a new job
exports.createJob = (req, res) => {
    const {title, description, location, salary} = req.body;
    const employer_id = req.user.id;

    const sql = 'INSERT INTO jobs (employer_id, title, description, location, salary) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [employer_id, title, description, location, salary], (err, result) => {
        if(err) return res.status(500).json({error: 'Database insert failed'});
        res.status(201).json({message: 'Job created successfully', jobId: result.insertId});
    });
};

//READ all jobs
exports.getAllJobs = (req, res) => {
    const sql = 'SELECT jobs.*, users.username AS employer_name FROM jobs JOIN users ON jobs.employer_id = users.id ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({error: 'Database read failed'});
        res.json(results);
    });
};

//READ one job by ID
exports.getJobById = (req, res) => {
    const jobId = req.params.id;
    const sql = 'SELECT jobs.*, users.username AS employer_name FROM jobs JOIN users ON jobs.employer_id = users.id WHERE jobs.id = ?';
    db.query(sql, [jobId], (err, results) => {
        if(err) return res.status(500).json({error: 'Database read failed'});
        if(results.length === 0) return res.status(404).json({error: 'Job not found'});
        res.json(results[0]);
    });
};

//UPDATE a job
exports.updateJob = (req, res) => {
    const jobId = req.params.id;
    const employer_id = req.user.id;
    const {title, description, location, salary} = req.body;

    //check if the job belongs to this employer
    const checkSql = 'SELECT * FROM jobs WHERE id = ? AND employer_id = ?';
    db.query(checkSql, [jobId, employer_id], (err, results) => {
        if(err) return res.status(500).json({error: 'Database error'});
        if(results.length === 0) return res.status(403).json({error: 'Not authorized to update this job'});

        //update the job
        const updateSql = 'Update jobs Set title = ?, description = ?, location = ?, salary = ? WHERE id = ?';
        db.query(updateSql, [title, description, location, salary, jobId], (err) => {
            if(err) return res.status(500).json({error: 'Update failed'});
            res.json({message: 'Job updated successfully'});
        });
    });
};

//DELETE a job
exports.deleteJob = (req, res) => {
    const jobId = req.params.id;
    const employer_id = req.user.id;

    const checkSql = 'SELECT * FROM jobs WHERE id = ? AND employer_id = ?';
    db.query(checkSql, [jobId, employer_id], (err, results) => {
        if(results.length === 0) return res.status(403).json({error: 'Not authorized to delete this job'});

        const deleteSql = 'DELETE FROM jobs WHERE id = ?';
        db.query(deleteSql, [jobId], (err) => {
            if(err) return res.status(500).json({error: 'Delete failed'});
            res.json({message: 'Job deleted successfully'});
        });
    });
};