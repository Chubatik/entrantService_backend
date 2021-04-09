var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
    let query = `select entrants.*, declarations.declaration_date from documents 
                left join entrants on documents.entrant_id = entrants.entrant_id
                left join declarations on documents.declaration_id = declarations.declaration_id
                order by entrants.entrant_surname asc;`;
    connection.promise().query(query)
        .then(result => {
            res.json({data : result[0]});
        })
        .catch(err => res.send(err));
})

module.exports = router;
