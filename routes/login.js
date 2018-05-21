module.exports = function ( app ) {
    app.get('/login',function(req,res){
        res.render('login');
    });

    app.post('/login', function (req, res) {
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;
        User.findOne({name: uname}, function (error, doc) {
            if (error) {
                res.sendStatus(500);
                console.log(error);
            } else if (!doc) {
                req.session.error = 'Not exist username';
                res.sendStatus(404);
            } else {
               if(req.body.upwd != doc.password){
                   req.session.error = "Password error";
                   res.sendStatus(404);
               }else{
                   req.session.user=doc;
                   res.sendStatus(200);
               }
            }
        });
    });

}