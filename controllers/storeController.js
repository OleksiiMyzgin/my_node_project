exports.homePage = (req, res) => {
    console.log(res.name)
    res.render('index');
}