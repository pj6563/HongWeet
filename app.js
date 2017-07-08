//express 사용
var express = require('express');
var app = express();

//db 사용
var mysql = require('mysql');
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'jiho916532',
  database : 'science_community'
});
conn.connect();

//bodyParser 사용
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

var multer  = require('multer');

app.use(express.static(__dirname));

//code pretty
app.locals.pretty = true;

//jade 사용
app.set('view engine', 'jade');
app.set('views', './views');

//routing
app.get('/', function(req, res) {
  res.render('index');
});

app.get(['/video', '/video/list/:id'], function(req, res) {
  var sql = 'select * from video_board';
  conn.query(sql, function(err, rows) {
    var id = req.params.id;
    //id(식별자)에 따라 글 상세보기 <-
    if(id) {
      var sql = 'select * from video_board where id=?';
      conn.query(sql, [id], function(err, topic) {
        if(err) {
          console.log(err); res.status(500).send('Internal Server Error');
        } else {
          res.render('video_detail', {topics:rows, topic:topic[0]});
        }
      });
  // ->
  //id값 없이 글 리스트 보일 때
  } else {
      res.render('video', { topics: rows });
    }
  });
});

app.get('/video/add', function(req, res) {
  res.render('video_add');
});

app.post('/video/add', function(req, res) {
  var title = req.body.add_title;
  var author = req.body.add_author;
  var description = req.body.add_description;
  var sql = 'insert into video_board (title, author, description) values(?, ?, ?)';
  conn.query(sql, [title, author, description], function(err, rows) {
    if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/video');
      }
  });
});

//listening
app.listen(2017, function() {
  console.log('Connected 2017 port!_!');
});
