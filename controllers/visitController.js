const fs = require('fs');
const dateEt = require('../src/dateTimeET');

const showVisitForm = (req, res) => {
    res.render('regvisit', { title: 'Registreeri külastus' });
};

const registerVisit = (req, res) => {
    console.log(req.body);
    fs.open("public/txt/visitlog.txt", "a", (err, file) => {
        if (err) {
            throw err;
        } else {
            fs.appendFile("public/txt/visitlog.txt", 
                req.body.firstNameInput + " " + req.body.lastNameInput + 
                ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", 
                (err) => {
                    if (err) {
                        throw err;
                    } else {
                        console.log("Salvestatud!");
                        
                        res.redirect('/visits/log');
                    }
                }
            );
        }
    });
};

const showVisitLog = (req, res) => {
    let listData = [];
    fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) => {
        if (err) {
            res.render('visitlog', { 
                title: 'Külastuste logi',
                visits: ["Ei leidnud ühtegi külastust!"]
            });
        } else {
            listData = data.split(";");
            let correctListData = [];
            for (let i = 0; i < listData.length - 1; i++) {
                if (listData[i].trim()) {
                    correctListData.push(listData[i].trim());
                }
            }
            res.render('visitlog', { 
                title: 'Külastuste logi',
                visits: correctListData 
            });
        }
    });
};

module.exports = {
    showVisitForm,
    registerVisit,
    showVisitLog
};