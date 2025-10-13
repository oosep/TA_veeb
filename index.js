const express = require("express");
const fs = require("fs");
//pأ¤ringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
const mysql = require("mysql2")
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
//kأ¤ivitan express.js funktsiooni ja annan talle nimeks "app"
const app = express();
//mأ¤أ¤ran veebilehtede mallide renderdamise mootori
app.set("view engine", "ejs");
//mأ¤أ¤ran أ¼he pأ¤ris kataloogi avalikult kأ¤ttesaadavaks
app.use(express.static("public"));
//parsime pأ¤ringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasi ühenduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_joosep_turba"
});

app.get("/", (req, res)=>{
	//res.send("Express.js lأ¤ks kأ¤ima ja serveerib veebi!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateEt.weekDay();
	const dateNow = dateEt.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(textRef, "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vأ¤ljastame veebilehe, liuhtsalt vanasأµnu pole أ¼htegi
			res.render("genericlist", {heading: "Valik Eesti vanasأµnu", listData: ["Ei leidnud أ¼htegi vanasأµna!"]});
		}
		else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti vanasأµnu", listData: folkWisdom});
		}
	});
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vأ¤ljastame veebilehe, liuhtsalt vanasأµnu pole أ¼htegi
			res.render("genericlist", {heading: "Registreeritud kأ¼lastused", listData: ["Ei leidnud أ¼htegi kأ¼lastust!"]});
		}
		else {
			listData = data.split(";");
			let correctListData = [];
			for(let i = 0; i < listData.length - 1; i ++){
				correctListData.push(listData[i]);
			}
			res.render("genericlist", {heading: "registreeritud kأ¼lastused", listData: correctListData});
		}
	});
});

app.get("/Eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/Eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		}
		else {
			console.log(sqlres);
			res.render("filmiinimesed",{personList: sqlres});
		}
	});
	//res.render("filmiinimesed");
});

app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
		res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else {
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES(?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput || null], (err, sqlres)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else {
				res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
			}
		});
	}
	
});


app.get("/Eestifilm/ametid", (req, res) => {
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlres) => {
		if (err) {
			throw err;
		} else {
			res.render("ametid", { positionList: sqlres });
		}
	});
});


app.get("/Eestifilm/ametid_add", (req, res) => {
	res.render("ametid_add", { notice: "Ootan sisestust" });
});

app.post("/Eestifilm/ametid_add", (req, res) => {
	console.log(req.body);
	if (!req.body.positionNameInput || !req.body.positionDescriptionInput) {
		res.render("ametid_add", { notice: "Andmed on puudu!" });
	} else {
		const sqlReq = "INSERT INTO position (position_name, description) VALUES(?, ?)";
		conn.execute(sqlReq, [req.body.positionNameInput, req.body.positionDescriptionInput], (err) => {
			if (err) {
				console.log(err);
				res.render("ametid_add", { notice: "Ameti lisamine ebaõnnestus" });
			} else {
				res.redirect("/Eestifilm/ametid");
			}
		});
	}
});


app.listen(5109);
