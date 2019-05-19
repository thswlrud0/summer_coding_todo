/*

    todo schema 정의
    
    */

var crypto = require('crypto');
var utils = require('../utils/utils');

var Schema = {};

Schema.createSchema = function (mongoose) {

    //스키마 정의
    var TodoSchema = mongoose.Schema({
        title: {
            type: String,
            trim: true,
            unique: true,
            'default': ''
        },
        contents: {
            type: String,
            trim: true,
            'default': ''
        },
        limit_at: {
            type: Date,
            index: {
                unique: false
            },
            'default': Date.now
        },
        importance: {
            type: Number,
            'default': -1
        },
        complete: {
            type: Number,
            'default': -1
        }
    });

    //필수 속성에 대한 유효성 확인( 길이값 체크)
    TodoSchema.path('title').required(true, '제목을 입력하셔야 합니다.');
    TodoSchema.path('contents').required(true, '글내용을 입력하셔야 합니다.');


    //스키마에 메소드를 추가
    TodoSchema.statics = {
        //title로 todo찾기
        load: function (_id, callback) {

            this.findOne({
                    _id: _id
                })
                .exec(callback);
        },

        limitlist: function (options, callback) {
            var criteria = options.criteria || {};

            this.find(criteria)
                .sort({
                    'limit_at': 1
                })
                .limit(Number(options.perPage))
                .skip(options.perPage * options.page)
                .exec(callback);
        },

    }

    //todo 삭제, 저장, 변경 메소드
    TodoSchema.methods = {
        saveTodo: function (callback) {
            var self = this;

            this.validate(function (err) {
                self.save(callback);
            });
        },

        todoRemove: function (callback) {
            var self = this;

            self.remove(callback);
        },
        
        todoUpdate: function(options, callback){
            var self = this;
            var title = options.title;
            var contents = options.contents;
            self.update({ $set : { title: title, contents : contents }}).exec(callback);
        }
    }
    
    console.log('TodoSchema정의됨');
    
    return TodoSchema;
}
module.exports = Schema;
