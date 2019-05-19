// Express 기본 모듈 불러오기
var express                = require('express');
var http                   = require('http');
var path                   = require('path');

// Express의 미들웨어 불러오기
var bodyParser             = require('body-parser');
var cookieParser           = require('cookie-parser');
var static                 = require('serve-static');
var errorHandler           = require('errorhandler');
var config                 = require('./config');
var route_loader           = require('./routes/route_loader');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');


// 익스프레스 객체 생성
var app = express();

// 모듈로 분리한 데이터베이스 파일 불러오기
var database = require('./database/database');

// view engine setup
app.set('views', path.join(__dirname, 'views/ejs'));
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
//pubic 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname,'public')));

//===== 서버 변수 설정 및 static으로 public 폴더 설정  =====//
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);
app.set('host', '127.0.0.1');


app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

route_loader.init(app, express.Router());

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/html/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);



//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});
