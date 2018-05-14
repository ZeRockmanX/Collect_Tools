module.exports = function ( app ) {
    app.get('/home', function (req, res) {
        if(req.session.user){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({}, function (error, docs) {
                res.render('home',{Commoditys:null});
            });
        }else{
            req.session.error = "请先登录"
            res.redirect('/login');
        }
    });
    app.get('/addcommodity', function(req, res) {
        res.render('addcommodity');
    });
    app.post('/addcommodity', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name: req.body.name,
            price: req.body.price,
            imgSrc: req.body.imgSrc
        }, function (error, doc) {
            if (doc) {
                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
        });
    });



//npm install cheerio --save(类似jquery的选择器)
//npm install iconv-lite --save(解决汉字乱码)
//npm install md5 --save
    let apiFunc = require('../api');
    let baseUrl = "https://item.rakuten.co.jp/auc-pourvous/";

    app.get('/api', async function (request, response) {
        let article_id = "";
        let action = request.query.action;
        var Commodity = global.dbHelper.getModel('commodity');
        var docs ="";
        Commodity.find({}, function (error, find_docs) {
            docs = find_docs;//Commoditys:null
        });
        switch (action) {
            case "clear":
                response.render('home', {title: 'Spider', message: null,Commoditys:null});
                break;
            case "getComments":
                article_id = request.query.id;
                let resData = await apiFunc.getById(article_id);
                response.render('home', {title: 'Spider', message: JSON.stringify(resData),Commoditys:null});
                break;
            case "collectComments":
                article_id = request.query.id;
                try {
                    let itemUrl = baseUrl + article_id + "/";
                    await apiFunc.collectById(itemUrl, article_id);
                    console.log("ok");
                    response.render('home', {title: 'Spider', message: 'collect Comments success',Commoditys:null});
                } catch (error) {
                    console.log("collectComments error:");
                    console.log(error);
                    response.render('home', {title: 'Spider', message: 'collect Comments failed',Commoditys:null});
                }
                break;
            default:
        }
        response.end();
    });

}