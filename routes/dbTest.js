var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
   let query = `select entrants.*, declarations.declaration_date from documents 
                left join entrants on documents.entrant_id = entrants.entrant_id
                left join declarations on documents.declaration_id = declarations.declaration_id`;
   let queryString = 'select * from privileges_for_entrant; select * from specialties'
   connection.query(queryString)
       .then(result => {
            res.json({data : result[0]});
       })
       .catch(err => res.send(err));
})

module.exports = router;
