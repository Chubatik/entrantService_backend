var express = require('express');
var router = express.Router();
const connection = require('../database/connection');
const filters = require("../filter/filterMethods");

router.get('/', (req, res) =>{
    let queryString = `select
                    year(declarations.declaration_date) as year, privileges_for_entrant.privilege_name,
                     specialties.specialty_name
                from documents 
                left join entrants on documents.entrant_id = entrants.entrant_id
                left join declarations on documents.declaration_id = declarations.declaration_id
                left join privileges_for_entrant on declarations.privilege_id = privileges_for_entrant.privilege_id
                left join specialties on declarations.specialty_id = specialties.specialty_id`;
    connection.promise().query(queryString)
        .then(result => {
            res.json({data : result[0]});
        })
        .catch(err => res.send(err));
})

module.exports = router;
