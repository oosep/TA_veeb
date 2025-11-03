const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbInfo = require('../../../vp2025config');

const dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: "if25_joosep_turba"
};

router.get('/movies/add', (req, res) => {
    res.render('add-movie', { title: 'Lisa film' });
});

router.post('/movies/add', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConf);
        const { title, release_year, duration, description } = req.body;
        
        await connection.execute(
            'INSERT INTO movies (title, release_year, duration, description) VALUES (?, ?, ?, ?)',
            [title, release_year, duration, description]
        );
        
        res.redirect('/Eestifilm/movies');
    } catch (error) {
        console.error('Viga filmi lisamisel:', error);
        res.status(500).render('error', { message: 'Viga filmi lisamisel' });
    } finally {
        if (connection) await connection.end();
    }
});

module.exports = router;