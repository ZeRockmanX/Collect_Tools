var MongoClient = require('mongodb').MongoClient;
module.exports = function (app) {
    app.get('/home', function (req, res) {
        if (req.session.user) {
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({}, function (error, docs) {
                res.render('home', {spiderMessage: null, Commoditys: null, items: null, flag: null,defaultID:1727});
            });
        } else {
            req.session.error = "login again";
            res.redirect('/login');
        }
    });
    app.get('/addcommodity', function (req, res) {
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
            } else {
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
        var docs = "";
        Commodity.find({}, function (error, find_docs) {
            docs = find_docs;//Commoditys:null
        });
        switch (action) {
            case "clear":
                response.render('home', {
                    title: 'Spider',
                    spiderMessage: null,
                    Commoditys: null,
                    items: null,
                    flag: null,
                    defaultID:1727
                });
                break;
            case "chart":
                article_id = request.query.id;
                MongoClient.connect('mongodb://localhost:27017').then((client) => {
                    let dateMap = {};
                    client.db('spider_rakuten').collection('Article_'+article_id).find().forEach((doc) => {
                        if (dateMap[doc.reviewDate]) {
                            dateMap[doc.reviewDate] += 1;
                        } else {
                            dateMap[doc.reviewDate] = 1;
                        }
                    }, (error) => {
                        let items = [];
                        for (let d in dateMap) {
                            items.push({
                                x: d,
                                y: dateMap[d]
                            });
                        }
                        response.render('home', {
                            items: items,
                            title: 'Spider',
                            spiderMessage: null,
                            Commoditys: null,
                            flag: true,
                            defaultID:article_id
                        });

                    });
                });
                break;
            case "getComments":
                article_id = request.query.id;
                let resData = await apiFunc.getById(article_id);
                response.render('home', {
                    title: 'Spider',
                    spiderMessage: JSON.stringify(resData),
                    Commoditys: null,
                    items: null,
                    flag: false,
                    defaultID:article_id
                });
                break;
            case "collectComments":
                article_id = request.query.id;
                try {
                    let itemUrl = baseUrl + article_id + "/";
                    await apiFunc.collectById(itemUrl, article_id);
                    console.log("ok");
                    response.render('home', {
                        title: 'Spider',
                        spiderMessage: 'collect Comments success',
                        Commoditys: null,
                        items: null,
                        flag: null,
                        defaultID:article_id
                    });
                } catch (error) {
                    console.log("collectComments error:");
                    console.log(error);
                    response.render('home', {
                        title: 'Spider',
                        spiderMessage: 'collect Comments failed',
                        Commoditys: null,
                        items: null,
                        flag: null,
                        defaultID:article_id
                    });
                }
                break;
            case "asyncCollectComments":
                article_id = request.query.id;
                try {
                    let itemUrl = baseUrl + article_id + "/";
                    await apiFunc.asyncCollectById(itemUrl, article_id);
                    console.log("ok");
                    response.render('home', {
                        title: 'Spider',
                        spiderMessage: 'collect Comments success',
                        Commoditys: null,
                        items: null,
                        flag: null,
                        defaultID:article_id
                    });
                } catch (error) {
                    console.log("collectComments error:");
                    console.log(error);
                    response.render('home', {
                        title: 'Spider',
                        spiderMessage: 'collect Comments failed',
                        Commoditys: null,
                        items: null,
                        flag: null,
                        defaultID:article_id
                    });
                }
                break;
            case "deleteStoreData":
                article_id = request.query.id;
                await apiFunc.deleteStoreData(article_id);
                response.render('home', {
                    title: 'Spider',
                    spiderMessage: 'Execute success',
                    Commoditys: null,
                    items: null,
                    flag: false,
                    defaultID:article_id
                });
                break;
            default:
        }
        //response.end();
    });

}