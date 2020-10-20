exports.index = function(req, res){
    let  data = {
        title: 'Hello world!'
    }

    // this renders 'data' into Nunjucks template 'index.njk'
    res.render('index.njk', data)
};
