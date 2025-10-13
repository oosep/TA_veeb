const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasonad.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: "if25_joosep_turba"
};

app.get("/", (req, res)=>{
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
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
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

//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/Eestifilm", eestifilmRouter);

app.listen(5109);