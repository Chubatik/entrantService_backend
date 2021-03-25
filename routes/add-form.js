var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
    let queryString = `select * from privileges_for_entrant order by privilege_name asc;
                       select * from specialties order by specialty_name asc;`;
    connection.query(queryString)
        .then(result => {
            res.json({data : result[0]});
        })
        .catch(err => res.send(err));
})

module.exports = router;
