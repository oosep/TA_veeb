const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc home page for Estonian Film section
//@route GET /galleryphotoupload
//@access public

const photouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
};

//@desc page for uploading to gallery
//@route GET /galleryphotoupload
//@access public

//app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{


//@desc home page for people involved in Estonian Film industry
//@route GET /Eestifilm/inimesed_add
//@access public

//app.post("/Eestifilm/filmiinimesed_add", async (req, res) => {
const photouploadPagePost = async (req, res) => {
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName = "vp_" + Date.now() + ".jpg"
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName)
		//loon normaalsuuruse800x600
		await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		//loon thumbnail pildi 100x100
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		res.render("galleryphotoupload");
	}
	catch(err) {
		console.log(err);
		res.render("galleryphotoupload");
		
	}
	finally{
		if (conn) {
		await conn.end();
			console.log("Andmebaasiühendus on suletud!");
		}
	}
	
	
	/* let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES(?,?,?,?)";

	if (!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || new Date(req.body.bornInput) >= new Date()) {
		res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	} else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");

			let deceasedDate = null;
			if (req.body.deceasedInput != "") {
				deceasedDate = req.body.deceasedInput;
			}

			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
		} catch (err) {
			console.log("Viga!" + err);
			res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
		} finally {
			if (conn) {
				await conn.end();
				console.log("Andmebaasiühendus on suletud!");
			}
		}
	} */
};

module.exports = {
	photouploadPage,
	photouploadPagePost
};