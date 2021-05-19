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

function getFilterString(option, optionValue) {
        switch (option) {
            case 'name' : return ` entrants.entrant_name like '%${optionValue}%' `;
            case 'surname': return ` entrants.entrant_surname like '%${optionValue}%' `;
            case 'year': return ` year(declarations.declaration_date) = ${optionValue} `;
            case 'privilegeId': return `${optionValue === 0 ?
                ' declarations.is_privilege = false ':
                ` declarations.privilege_id = ${optionValue} and declarations.is_privilege = true`} `;
            case 'specialtyId': return ` declarations.specialty_id = ${optionValue} `;
            case 'isHostel': return ` declarations.is_hostel = ${optionValue} `;
        }
}
module.exports.buildFilter = function buildFilter(filter, mode) {
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
