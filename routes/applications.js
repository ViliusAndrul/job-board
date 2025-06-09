const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

//middleware to authenticate users
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

//apply to a job
router.post('/', authenticateToken, (req, res) => {
    if (req.user.role !== 'job_seeker') {
        return res.status(403).json({message: 'Only job seekers can apply'});
    }
    const {job_id, resume_url} = req.body;
    const sql = 'INSERT INTO applications (job_id, user_id, resume_url) VALUES (?, ?, ?)';
    db.query(sql, [job_id, req.user.id, resume_url], (err, result) => {
        if (err) return res.status(500).json({error: err});
        res.json({message: 'Application submitted', id: result.insertId});
    });
});

//get applications by job for employers
router.get('/employer/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({message: 'Only employers can view applications'});
    }
    const employerId = req.params.id;
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
});

//Get applications by user
router.get('/user/:id', authenticateToken, (req, res) => {
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
});

module.exports = router;