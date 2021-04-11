var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
    const page = req.query.page;
    const filter = buildFilter(JSON.parse(`${req.query.filter}`) );
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
    console.log(query);
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
function getFilterString(option, optionValue) {
    switch (option) {
        case 'name' : return ` entrants.entrant_name like '%${optionValue}%' `;
        case 'surname': return ` entrants.entrant_surname like '%${optionValue}%' `;
        case 'patronym': return ` entrants.entrant_patronym like '%${optionValue}%' `;
        case 'privilegeId': return `${optionValue === 0 ? 
            ' declarations.is_privilege = false ': 
            `declarations.privilege_id = ${optionValue} and declarations.is_privilege = true`}`;
        case 'specialtyId': return ` declarations.specialty_id = ${optionValue} `;
        case 'isHostel': return ` declarations.is_hostel = ${optionValue} `;
    }
}

function checkAvailableOptions(filter) {
    let options = {};
    options.size = 0;
    for (const i in filter) {
        if (filter.hasOwnProperty(i) && filter[i] !== null){
            options[i] = filter[i];
            options.size++;
        }
    }
    return options;
}
function buildFilter(filter) {
    let queryString = '';
    let options = checkAvailableOptions(filter);
    if (options.size !== 0) {
        queryString += 'where ';
    }
    if (options.size === 1) {
        for (const i in options) {
            if (i !== 'size') {
                queryString += getFilterString(i, options[i]);
            }
        }
    }
    if (options.size > 1) {
        for (const i in options) {
            if (i !== 'size') {
                if (i === Object.entries(options)[1][0]) { //[1] - for skipping options.size property, [0] - for getting property name
                    queryString += ` \n${getFilterString(i, options[i])} `;
                } else {
                    queryString += ` \n and ${getFilterString(i, options[i])} `;
                }
            }
        }
    }
    return queryString;
}

module.exports = router;
