var express = require('express');
var router = express.Router();
const pool = require('../database/connection');

router.post('/', (req, res) =>{
    const entrant = req.body.entrant;
    let queryString = `insert into entrants(entrant_name, entrant_surname, entrant_patronym)
                        values("${entrant.name}","${entrant.surname}", "${entrant.patronym}");
                        set @last_id_entrant = last_insert_id();
                        
                        insert into declarations(declaration_date, specialty_id, privilege_id, is_privilege, is_hostel)
                        values(now(), ${entrant.specialtyId}, ${entrant.privilegeId}, 
                        ${entrant.isPrivilege}, ${entrant.isHostel});
                        set @last_id_declaration = last_insert_id();
                        
                        insert into documents(entrant_id, declaration_id, passport_number, identification_code, 
                        education_number, photo_reference, is_eleven_grade, independent_exams_number, 
                        military_ticket_number)
                        values(@last_id_entrant, @last_id_declaration, ${entrant.passportNumber}, ${entrant.identificationCode},
                        ${entrant.educationNumber}, "#", ${entrant.isElevenGrade}, ${entrant.independentExamsNumber}, 
                        ${entrant.militaryTicketNumber});`; //


    pool.getConnection(function(err, connection) {
        connection.beginTransaction(function(err) {
            if (err) {                  //Transaction Error (Rollback and release connection)
                connection.rollback(function() {
                    connection.release();
                    res.status(500).send(err);
                    //Failure
                });
            } else {
                connection.query(queryString, function(err, results) {
                    if (err) {          //Query Error (Rollback and release connection)
                        connection.rollback(function() {
                            connection.release();
                            res.status(500).send(err);
                            //Failure
                        });
                    } else {
                        connection.commit(function(err) {
                            if (err) {
                                connection.rollback(function() {
                                    connection.release();
                                    res.status(500).send(err);
                                    //Failure
                                });
                            } else {
                                connection.release();
                                res.status(200).json({data : results[0]});
                                //Success
                            }
                        });
                    }
                });
            }
        });
    });
})

module.exports = router;
