const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../configs/db');
const redisClient = require('../configs/cache');

// Post a new submission
router.post('/', [
    body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
    body('code_language').isIn(['C++', 'Java', 'JavaScript', 'Python']).withMessage('Invalid code language'),
    body('source_code').isLength({ min: 1 }).withMessage('Source code is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }



    const { username, code_language, stdin, source_code, stdout, stderr } = req.body;
    const query = 'INSERT INTO submissions (username, code_language, stdin, source_code, stdout, stderr, submission_time) VALUES (?, ?, ?, ?, ?, ?, NOW())';

    db.query(query, [username, code_language, stdin, source_code, stdout, stderr], async (error, results) => {
        if (error){
            console.log(error);
            return res.status(500).send(error);
        } 
        await redisClient.del('submissions');
        res.status(201).send('Submission added successfully.');
    });
});

// Get all submissions
router.get('/', async (req, res) => {
    try {
        // Try fetching the result from Redis cache
        const cachedSubmissions = await redisClient.get('submissions');
        if (cachedSubmissions) {
            return res.send({
                success: true,
                message: 'Submissions retrieved from cache successfully!',
                data   : JSON.parse(cachedSubmissions)
            });
        }

        // If not cached, query the database
        const query = 'SELECT id, username, code_language, stdin, submission_time, source_code, stdout, stderr FROM submissions';
        db.query(query, async (error, results) => {
            if (error) {
                console.log(error)
                return res.status(500).send(error);
            }
    
            await redisClient.set('submissions', JSON.stringify(results), 'EX', 600);
            return res.send({
                success: true,
                message: 'Submissions retrieved from db successfully!',
                data   : results
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
