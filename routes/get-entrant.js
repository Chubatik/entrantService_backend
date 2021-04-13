var express = require('express');
var router = express.Router();
const connection = require('../database/connection');

router.get('/', (req, res) =>{
    let query = `select entrants.entrant_name, entrants.entrant_surname, entrants.entrant_patronym,
                    declarations.declaration_date, privileges_for_entrant.privilege_name,
                    declarations.is_privilege, declarations.is_hostel, specialties.specialty_name,
                    documents.passport_number, documents.identification_code, documents.independent_exams_number, 
                    documents.military_ticket_number, documents.education_number, documents.is_eleven_grade
                from documents 
                left join entrants on documents.entrant_id = entrants.entrant_id
                left join declarations on documents.declaration_id = declarations.declaration_id
                left join privileges_for_entrant on declarations.privilege_id = privileges_for_entrant.privilege_id
                left join specialties on declarations.specialty_id = specialties.specialty_id
                where entrants.entrant_id = ${req.query.entrantId}`;
    connection.promise().query(query)
        .then(result => {
            res.json({data : result[0]});
        })
        .catch(err => res.send(err));
})

module.exports = router;
