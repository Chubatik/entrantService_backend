var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
   let query = `select * from declarations`;
   connection.query(query)
       .then(result => {
            res.json({data : result[0]});

       })
       .catch(err => res.send(err));
})

module.exports = router;
