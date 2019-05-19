module.exports = {
    server_port: 3000,
    db_url: 'mongodb+srv://thswlrud:0000@cluster0-0cez1.mongodb.net/test?retryWrites=true',
    db_schemas: [
        {file:'./todo_schema', collection : 'todo',
        schemaName: 'TodoSchema', modelName:'TodoModel'}
    ],
    route_info: [
        //======== index =======//
        {file:'./index', path:'/', method:'index', type:'get'},
        
        // ======= todo ======== //
        {file:'./todo', path:'/process/addtodo',method:'addtodo', type:'post'},
        {file:'./todo', path:'/process/showtodo/:id',method:'showtodo',type:'get'},
        
        //======== 정렬 기준 case ====//
        {file:'./todo', path:'/process/limitlisttodo',method:'limitlisttodo',type:'post'},
        {file:'./todo', path:'/process/limitlisttodo',method:'limitlisttodo',type:'get'},
        {file:'./todo', path:'/process/importancelisttodo',method:'importancelisttodo',type:'post'},
        {file:'./todo', path:'/process/completelisttodo',method:'completelisttodo',type:'post'},
        
        
        //======= 변경 처리 ==========//
        {file:'./todo', path:'/process/todocomplete',method:'todocomplete',type:'post'},
        {file:'./todo', path:'/process/changecriteria/:criteria',method:'changecriteria',type:'get'},
        {file:'./todo', path:'/process/todoremove/:id',method:'todoremove',type:'get'},
        {file:'./todo', path:'/process/updatetodo',method:'updatetodo',type:'post'},
        {file:'./todo', path:'/process/todoupdatepage/:id',method:'todoupdatepage',type:'get'}
    ]
}