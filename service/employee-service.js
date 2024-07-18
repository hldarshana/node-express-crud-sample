var clientsData = require('../db/employees.json');
var Datastore = require('nedb');
var db = new Datastore();
db.insert(clientsData);

const DEFAULT_QUERY_LIMIT = 20;
const employeeService = {};

///Helper methods
var getSearchCriteria = (query) =>{
    var result = {
        name: new RegExp(query.name, "i"),
        address: new RegExp(query.address, "i")
    };
    if(query.married) {
        result.married = query.married === 'true' ? true : false;
    }
    if(query.country && query.country !== '0') {
        result.country = parseInt(query.country, 10);
    }
    if(query.age && query.age !== '0') {
        result.age = parseInt(query.age, 10);
    }
    return result;
};

var getTotalCount = async (searchCriteria) => {
    return new Promise((resolve, reject) => {
        db.count(searchCriteria).exec((err, count)=>{
            err ? reject(err) : resolve(count);
        })
    });
}

/**
 * get employees
 * @param {*} query 
 * @returns 
 */
employeeService.getEmployees = async (query) =>{
    return new Promise(async (resolve, reject) => {

        let searchCriteria = getSearchCriteria(query);

        let dbQuery = db.find(searchCriteria);
        let count = await getTotalCount(searchCriteria);

        const queryCallback = (err, docs) => {
            if (err) {
                reject(err);
            return;
            }
    
            resolve({total: count, records: docs});
        };

        if(query.sortBy){
            if(query.sortDirection == "desc"){
                dbQuery = dbQuery.sort({[query.sortBy]: -1});
            }else{
                dbQuery = dbQuery.sort({[query.sortBy]: 1});
            }
        }
    
        if (query.skip) {
            dbQuery
                .skip(Number(query.skip))
                .limit(Number(query.limit) || DEFAULT_QUERY_LIMIT)
                .exec(queryCallback);
        } else {
            dbQuery
                .limit(Number(query.limit) || DEFAULT_QUERY_LIMIT)
                .exec(queryCallback);
        }
    });
}

/**
 * get employee
 * @param {*} id 
 * @returns 
 */
 employeeService.getEmployee = async (id) => {
    return new Promise((resolve, reject) => {
        db.findOne({ _id: id }).exec((err, record) => {
            err ? reject(err) : resolve(record);
        });
    });
}

/**
 * add employee
 * @param {*} record 
 * @returns 
 */
employeeService.addEmployee = async (record) => {
    return new Promise((resolve, reject) => {
        db.insert(record, (err, item) => {
            err ? reject(err) : resolve(item);
        });
    });
}

/**
 * edit employee
 * @param {*} record 
 * @returns 
 */
employeeService.editEmployee = async (record) => {
    return new Promise((resolve, reject) => {
        db.update({ _id: record._id }, record, {}, (err) => {
            err ? reject(err) : resolve(record);
        });
    });
}

/**
 * delete employee
 * @param {*} id 
 * @returns 
 */
employeeService.deleteEmployee = async (id) => {
    return new Promise((resolve, reject) => {
        db.remove({ _id: id }, {}, (err) => {
            err ? reject(err) : resolve({success: true});
        });        
    });
}

module.exports = employeeService;