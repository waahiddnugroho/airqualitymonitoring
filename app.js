const express = require('express');
const bodyParser = require('body-parser');
var qString   = require('querystring');
var connection  = require('./database');
var app      = express();
server = require('http').createServer(app),
io = require('socket.io').listen(server);
var port = process.env.PORT || 8080;

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));


//send data using socket io
io.on('connection', (client) => {
	connection.query("select * from airquality order by id desc limit 1", function(err,results){
		if(err) throw err;
		io.emit('datastrametemperatureandhumidity', results[0]);
	});
    connection.query("select air_quality,times from airquality order by id desc limit 50", function(err,results){
		if(err) throw err;
		io.emit('datastrameairquality', results);
	});
   console.log("Socket connected.")
})



//handle user interfaces
app.get('/',(req, res) => {
    connection.query("select * from airquality",function(err,results){
        if(err) throw err;
		res.render('pages/index');
        //res.send(JSON.stringify({"status": 200, "error": false, "data": results}));
    });
})

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// detail page
app.get('/detail', function(req, res) {
	connection.query("select * from airquality", function(err,results){
		if(err)throw err;
		res.render('pages/detail',{
			results:results
		});
	});
    
})

//HTTP handle IOT
app.post('/send',(req, res) => {

        var data={temperature: req.body.temperature, humidity: req.body.humidity, air_quality: req.body.air_quality}

		//update data
		connection.query("insert into airquality set ?",data, function(err,results){
			if(err) throw err;
			 connection.query("select * from airquality order by id desc limit 1", function(err,results){
				if(err) throw err;
				io.emit('datastrametemperatureandhumidity', results[0]);
			  });
              connection.query("select air_quality,times from airquality order by times desc limit 50", function(err,results){
                if(err) throw err;
                io.emit('datastrameairquality', results);
            });
			console.log('http data update');
			res.send(JSON.stringify({"status": 200, "error": false, "response": "http data update"}));
		});

	  
})


server.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});