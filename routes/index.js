var http = require('http');

/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title:'Wakenya Tuongee?', layout:'layout' })
};
