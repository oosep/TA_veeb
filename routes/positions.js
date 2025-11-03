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

router.get('/ametid', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConf);
        const [rows] = await connection.execute('SELECT * FROM position ORDER BY position_name');
        res.render('ametid', { positionList: rows });
    } catch (error) {
        console.error('Viga ametite laadimisel:', error);
        res.render('ametid', { positionList: [] });
    } finally {
        if (connection) await connection.end();
    }
});

router.post('/ametid/add', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConf);
        const { positionNameInput, positionDescriptionInput } = req.body;
        
        if (!positionNameInput || !positionDescriptionInput) {
            return res.render('ametid_add', { notice: "Andmed on puudu!" });
        }
        
        await connection.execute(
            'INSERT INTO position (position_name, description) VALUES (?, ?)',
            [positionNameInput, positionDescriptionInput]
        );
        
        res.redirect('/Eestifilm/ametid');
    } catch (error) {
        console.error('Viga ameti lisamisel:', error);
        res.render('ametid_add', { notice: "Ameti lisamine ebaõnnestus" });
    } finally {
        if (connection) await connection.end();
    }
});

module.exports = router;