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

router.get('/connections/add', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConf);
        
        const [persons] = await connection.execute(
            'SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name'
        );
        const [movies] = await connection.execute(
            'SELECT id, title FROM movies ORDER BY title'
        );
        const [positions] = await connection.execute(
            'SELECT id, position_name FROM position ORDER BY position_name'
        );
        
        res.render('add-connection', {
            title: 'Lisa seos',
            persons: persons,
            movies: movies,
            positions: positions
        });
    } catch (error) {
        console.error('Viga andmete laadimisel:', error);
        res.status(500).render('error', { message: 'Viga andmete laadimisel' });
    } finally {
        if (connection) await connection.end();
    }
});

router.post('/connections/add', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConf);
        const { personSelect, movieSelect, positionSelect, role } = req.body;
        
        await connection.execute(
            `INSERT INTO movie_person_position 
             (person_id, movie_id, position_id, role) 
             VALUES (?, ?, ?, ?)`,
            [personSelect, movieSelect, positionSelect, role || null]
        );
        
        res.redirect('/Eestifilm/connections');
    } catch (error) {
        console.error('Viga seose lisamisel:', error);
        res.status(500).render('error', { message: 'Viga seose lisamisel' });
    } finally {
        if (connection) await connection.end();
    }
});

router.get('/connections', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConf);
        
        const [rows] = await connection.execute(`
            SELECT 
                p.id as person_id,
                p.first_name,
                p.last_name,
                m.title as movie_title,
                pos.position_name as position_name,
                mpp.role,
                m.release_year
            FROM movie_person_position mpp
            JOIN person p ON mpp.person_id = p.id
            JOIN movies m ON mpp.movie_id = m.id
            JOIN position pos ON mpp.position_id = pos.id
            ORDER BY p.last_name, p.first_name, m.release_year
        `);
        
       
        const connectionsByPerson = {};
        rows.forEach(row => {
            const key = `${row.person_id}-${row.first_name}-${row.last_name}`;
            if (!connectionsByPerson[key]) {
                connectionsByPerson[key] = {
                    person: `${row.first_name} ${row.last_name}`,
                    connections: []
                };
            }
            connectionsByPerson[key].connections.push({
                movie: row.movie_title,
                position: row.position_name,
                role: row.role,
                year: row.release_year
            });
        });
        
        res.render('connections', {
            title: 'Filmiseosed',
            connections: Object.values(connectionsByPerson)
        });
    } catch (error) {
        console.error('Viga seoste laadimisel:', error);
        res.status(500).render('error', { message: 'Viga seoste laadimisel' });
    } finally {
        if (connection) await connection.end();
    }
});

module.exports = router;