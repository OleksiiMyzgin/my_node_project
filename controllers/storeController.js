exports.myMiddleware = (req, res, next) => {
    req.name = 'Alex';
    next();
}

exports.homePage = (req, res) => {
    res.render('index');
}