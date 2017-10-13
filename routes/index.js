const express = require('express');
const router = express.Router();

// req is object full of info that coming in
// res is object full of methods that sending data back to user 
// Do work here
router.get('/', (req, res) => {
    const alex = { name: 'alex', age: 100, cool: true };
    // res.send('Hey! It works!');
    // res.json(alex);
    // res.send(req.query.name);
    // res.json(req.query);
    // res.render('hello', {
    //     name: 'alex',
    //     age: 100
    // });
    res.render('hello');
});

router.get('/reverse/:name', (req, res) => {
    // const reverse = [...req.params.name]; // ['a','l','e','x','e','y']
    // const reverse = [req.params.name]; // ['alexey']
    const reverse = [...req.params.name].reverse().join('');
    res.send(reverse);
});

module.exports = router;