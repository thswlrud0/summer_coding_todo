/*

    사용자 접속에 관한 라우트

*/


var index = function(req, res){
    console.log('첫화면 호출됨');
    
    return res.redirect('/public/html/index.html');
}


module.exports.index = index;