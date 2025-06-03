const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register function
exports.register = (req, res) => {
    const {username, email, password, role} = req.body;

    //Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, result) => {
        if(err) return res.status(500).json({error: 'Database error'});
        if(result.length > 0) return res.status(400).json({error: 'Email already exists'});

        //Hashing password
        bcrypt.hash(password, 10, (err, hash) => {
            if(err) return res.status(500).json({error: 'Hashing error'});

            const insertQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
            db.query(insertQuery, [username, email, hash, role], (err, result) => {
                if(err) return res.status(500).json({ error: 'Insert failed'});
                return res.status(201).json({message: 'User registered successfully'});
            });
        });
    });
};

//Login function
exports.login = (req, res) => {
    const {email, password} = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if(err) return res.status(500).json({error: 'Database error'});
        if(result.length === 0) return res.status(400).json({ error: 'User not found'});

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) return res.status(500).json({error: 'Compare error'});
            if(!isMatch) return res.status(400).json({error: 'Invalid password'});

            //Create JWT token
            const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.json({token, user:{id: user.id, username: user.username, role: user.role}});
        });
    });
};