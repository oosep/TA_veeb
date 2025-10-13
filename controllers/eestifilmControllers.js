

//app.get("/Eestifilm", (req, res)=>{
const eestifilm = (req, res)=>{
	res.render("eestifilm");
};

//app.get("/Eestifilm/inimesed", async (req, res)=>{
const inimesed = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields ] = await conn.execute(sqlReq);
		res.render("filmiinimesed",{personList: rows});
	}
	catch(err) {
		console.log("Viga!" + err);
		res.render("filmiinimesed",{personList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus on suletud!");
		}
	}
};

