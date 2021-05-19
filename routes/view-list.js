const express = require('express');
const router = express.Router();
const connection = require('../database/connection');
const filters = require('../filter/filterMethods')

router.get('/', (req, res) =>{
    const page = req.query.page;
    const filter = filters.buildFilter(JSON.parse(`${req.query.filter}`) );
    const limit = 10;
    let query = `select entrants.*, declarations.declaration_date from documents 
                left join entrants on documents.entrant_id = entrants.entrant_id
                left join declarations on documents.declaration_id = declarations.declaration_id
                ${filter}
                order by entrants.entrant_surname asc limit ${limit} offset ${page === 0 ? 0 :page*limit};
                select count(*) as countEntrant from(select entrants.*, declarations.declaration_date from documents 
                left join entrants on documents.entrant_id = entrants.entrant_id
                left join declarations on documents.declaration_id = declarations.declaration_id 
                ${filter}) as count`;
    connection.promise().query(query)
        .then(result => {
            let data = {
                entrants: result[0][0],
                count: result[0][1][0]
            }
            res.status(200).json({data});
        })
        .catch(err => res.status(500).send(err));

})


module.exports = router;
