/*

    todo 관련 모듈
    
    */



var showtodo = function (req, res) {
    console.log('todo 모듈 안에 있는 showtodo 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.param('id');

    console.log('요청 파라미터 : ' + paramId);

    var database = req.app.get('database');

    //데이터 베이스가 초기화된 경우
    if (database.db) {
        // 리스트
        database.TodoModel.load(paramId, function (err, results) {
            if (err) {
                console.log('투두 글 조회중 오류 발생' + err.stack);

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 글 조회중 오류 발생 </h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if (results) {
                //console.dir(results);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });

                //뷰 템프릿 사용하여 렌더링 한 후 전송
                var context = {
                    title: '글 조회',
                    todos: results,
                };

                req.app.render('showtodo', context, function (err, html) {
                    if (err) {
                        throw err;
                    }
                    console.log('응답 웹 문서 : ' + html);
                    res.end(html);
                });

            }
        });
    }
};

var changecriteria = function (req, res) {
    console.log('정렬 기준이 변경됩니다.');

    var paramCriteria = req.param('criteria');
    var page = 0;
    var perPage = 4;
    var crit = '';
    if (paramCriteria == 'limit_at') {
        crit = 'limitlisttodo';
    } else if (paramCriteria == 'importance') {
        crit = 'importancelisttodo';
    } else if (paramCriteria == 'complete') {
        crit = 'completelisttodo';
    }

    return res.redirect('/process/' + crit + '?page=' + page + "&perPage=" + perPage);

}

//정렬기준이 마감일일때 , default
var limitlisttodo = function (req, res) {
    console.log('todo 모듈 안에 있는 listtodo 호출됨.');

    var paramPage = req.param('page');
    var paramPerPage = req.param('perPage');

    var database = req.app.get('database');

    //데이터베이스 객체가 초기화된 경우
    if (database.db) { //1. todo 목록
        var options = {
            page: paramPage,
            perPage: paramPerPage
            //criteria : ...
        }

        database.TodoModel.limitlist(options, function (err, results) {
            if (err) {
                console.err('게시판 글 목록 조회 중 오류 발생 : ' + err.stack);

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 글 목록 조회 중 오류 발생 </h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if (results) {
                //console.dir(results);
                //전체 문서 객체 수 확인
                database.TodoModel.count().exec(function (err, count) {
                    res.writeHead('200', {
                        'Content-Type': 'text/html;charset=utf8'
                    });

                    //뷰 템플릿을 사용하여 렌더링한 후 전송
                    var context = {
                        title: '글 목록',
                        todos: results,
                        page: parseInt(paramPage),
                        pageCount: Math.ceil(count / paramPerPage),
                        perPage: paramPerPage,
                        tatalRecords: count,
                        size: paramPerPage
                    };

                    req.app.render('listtodo', context, function (err, html) {
                        if (err) {
                            console.error('응답 웹문서 생성 중 오류 발생 : ' + err.stack);

                            /*res.writeHead('200', {
                                'Content-Type': 'text/html;charset=utf8'
                            });*/
                            res.write('<h2>응답 웸문서 중 오류 발생');
                            res.write('<p>' + err.stack + '</p>');

                            return;
                        }

                        res.end(html);
                    });
                });
            }
        });
    }
};

//정렬기준이 중요도일때
var importancelisttodo = function (req, res) {

};

var completelisttodo = function (req, res) {

};

//todo 완료처리
var todocomplete = function (req, res) {

};


// todo insert 함수
var addtodo = function (req, res) {
    console.log('todo 모듈 안의 addtodo 호출됨');

    //요청 파라미터 확인
    var paramTitle = req.param('title');
    var paramContent = req.param('contents');
    var paramLimitAt = req.param('limit_at');
    var paramImportance = req.param('importance');
    var paramcomplete = req.param('complete');

    console.log('요청 타이틀 : ' + paramTitle);

    var database = req.app.get('database');

    //데이터베이스가 초기화된 경우
    if (database.db) {

        //save()로 저장
        var todo = new database.TodoModel({
            title: paramTitle,
            contents: paramContent,
            limit_at: paramLimitAt,
            importance: paramImportance,
            complete: paramcomplete
        });

        todo.saveTodo(function (err, result) {
            if (err) {
                throw err;
            }

            console.log('글 데이터 추가함');
            console.log('todo 작성', '투두 글을 생성했습니다.' + todo.title);

            return res.redirect('/process/showtodo/' + result._id);
        });
    }
}
var todoupdatepage = function (req, res) {
    console.log('todo 모듈 안에 있는 showtodo 호출됨.');

    // URL 파라미터로 전달됨
    var paramId = req.param('id');
    console.log('요청 파라미터 : ' + paramId);

    var database = req.app.get('database');

    //데이터 베이스가 초기화된 경우
    if (database.db) {
        // 리스트
        database.TodoModel.load(paramId, function (err, results) {
            if (err) {
                console.log('투두 글 조회중 오류 발생' + err.stack);

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>todo 조회중 오류 발생 </h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            if (results) {
                //console.dir(results);
                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });

                //뷰 템프릿 사용하여 렌더링 한 후 전송
                var context = {
                    title: 'todo update',
                    todos: results,
                };

                req.app.render('updatetodo', context, function (err, html) {
                    if (err) {
                        throw err;
                    }
                    console.log('응답 웹 문서 : ' + html);
                    res.end(html);
                });
            }
        });
    }
}

var todoremove = function (req, res) {
    console.log('todoremove 모듈 호출됨');

    var paramId = req.param('id');
    var database = req.app.get('database');

    //데이터 베이스가 초기화된 경우
    if (database.db) {
        // 글 조회
        database.TodoModel.load(paramId, function (err, results) {
            if (err) {
                console.log('투두 글 조회중 오류 발생' + err.stack);

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 글 조회중 오류 발생 </h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            //todo 찾으면
            if (results) {
                var todo = results;
                todo.todoRemove(function (err, result) {
                    if (err) {
                        throw err;
                    }
                    if (results) {
                        console.log(' 데이터 삭제함');
                        return res.redirect('/process/limitlisttodo/?page=0&perPage=4');
                    }
                });
            }
        });
    }
}



var updatetodo = function (req, res) {
    console.log('todo 모듈 안에 있는 updatetodo 호출됨.');

    //요청 파라미터 확인
    var paramId = req.param('id');
    var database = req.app.get('database');

    //데이터 베이스가 초기화된 경우
    if (database.db) {
        // 글 조회
        database.TodoModel.load(paramId, function (err, results) {
            if (err) {
                console.log('투두 글 조회중 오류 발생' + err.stack);

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.write('<h2>게시판 글 조회중 오류 발생 </h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            //todo 찾으면
            if (results) {
                var todo = results;
                var paramTitle = req.param('title');
                var paramContent = req.param('contents');
                var paramcomplete = req.param('complete');
                var database = req.app.get('database');


                var options = {
                    title : paramTitle,
                    contents : paramContent
                }
                
                todo.todoUpdate(options, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    if (results) {
                        console.log(' 데이터 바꿈');
                        
                        return res.redirect('/process/showtodo/' + results._id);
                    }
                });
            }
        });
    }
}



module.exports.addtodo = addtodo;
module.exports.showtodo = showtodo;
module.exports.limitlisttodo = limitlisttodo;
module.exports.importancelisttodo = importancelisttodo;
module.exports.completelisttodo = completelisttodo;
module.exports.todocomplete = todocomplete;
module.exports.changecriteria = changecriteria;
module.exports.todoremove = todoremove;
module.exports.todoupdatepage = todoupdatepage;
module.exports.updatetodo = updatetodo;
