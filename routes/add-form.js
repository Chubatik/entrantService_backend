var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
    let queryString = `select * from privileges_for_entrant order by privilege_name asc;
                       select * from specialties order by specialty_name asc;
                       select distinct year(declaration_date) as years from declarations`;
    connection.promise().query(queryString)
        .then(result => {
            let data = {
                privileges: result[0][0],
                specialties: result[0][1],
                years: result[0][2]
            }
            res.status(200).json({data});
        })
        .catch(err => res.status(500).send(err));
})

module.exports = router;
