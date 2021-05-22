var express = require('express');
var router = express.Router();
const connection = require('../database/connection');
const sha = require('js-sha256');
router.get('/', (req, res) =>{
    let pass = req.query.pass;
    let queryString = 'select pass from access;'
    connection.promise().query(queryString)
        .then(result => {
            if (sha.sha256(pass) === String(result[0][0].pass)){
                res.status(200).send(true);
            } else {
                res.status(403).send(false);
            }
        })
        .catch(err => res.send(err));
})

module.exports = router;
