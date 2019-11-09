const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
//var session = require('express-session');

const db=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database: 'sc'
});

db.connect((err)=>{
	if(err)
		throw err;
	console.log('MySql Connected');
});

//Middleware Configuration
app.set("port", process.env.port || port); // set express to use this port
app.set('html');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res) {
	response.sendFile(path.join(__dirname + '/home.html'));
});
app.set("view engine", "ejs"); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, "public"))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.get('/views/add', (req,res)=>{
	let sql='INSERT INTO RESOURCE (rid, rname, link, author, rtype, sid, fid ) VALUES ('"+req.body.rid+"', '"+req.body.rname+"','"+req.body.link+"','"+req.body.author+"','"+req.body.rtype+"','"+req.body.sid+"','"+req.body.fid+"')';
	db.query(sql, function(err, result){
		if(err) throw err;
		console.log("Inserted");
		res.render('add.html');
	});
});

/*Modify Resource
app.get('/views/modify', (req,res)=>{
	let sql1=`SELECT * FROM RESOURCE where rid=${req.params.rid}`;
	let sql2='UPDATE RESOURCE SET ('"+req.body.rid+"', '"+req.body.rname+"','"+req.body.link+"','"+req.body.author+"','"+req.body.rtype+"','"+req.body.sid+"','"+req.body.fid+"')';
	db.query(sql1, function(err, result){
		if(err) throw err;
		console.log("Shown");
	});
	db.query(sql2, function(err, result){
		if(err) throw err;
		console.log("Modified");
	});
});*/

//Delete resource
app.get('/views/delete', (req, res)=>{
	let sql=`DELETE from RESOURCE where rid=${req.body.rid}`;
	let query = db.query(sql, (err, result)=>{
		if(err) throw err;
		console.log("Deleted");
	res.render('delete.html');
	});
});

//Display all resource information
app.get('/views/display', (req,res)=>{
	let sql='SELECT * FROM resources';
	let query = db.query(sql, (err, results)=>{
		if(err) throw err;
		console.log('Resources Retrieved');
		res.render('display.html');
	});
});

//Display all teacher information
app.get('/views/tdisplay', (req,res)=>{
	let sql='SELECT * FROM faculty';
	let query = db.query(sql, (err, results)=>{
		if(err) throw err;
		console.log('Teacher Retrieved');
		res.render('tdisplay.html');
	});
});

app.get('/logout', function(req,res)=>{
	req.session.destroy(function(err)){
		res.redirect('/');
	}
});

app.use('/', router);
app.listen('3500',() =>{
	console.log('Server started on port 3500');
});