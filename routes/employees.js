var express = require('express');
var xmlparser = require('express-xml-bodyparser');
var router = express.Router();

var employeeService = require('../service/employee-service');
var dataTypeConfig = require('../config/data-type-handler');

router.get('/', dataTypeConfig.bustHeaders, async (req, res, next)  => {
  let result = await employeeService.getEmployees(req.query);
  return dataTypeConfig.buildResponseForList(req, res, result, 'result');
});

router.get('/:employeeId', dataTypeConfig.bustHeaders, async (req, res, next)  => {
  let result = await employeeService.getEmployee(req.params.employeeId);
  return dataTypeConfig.buildResponse(req, res, result, 'employee');
});

router.post('/', dataTypeConfig.bustHeaders, xmlparser(dataTypeConfig.xmlOptions), async (req, res, next) =>{
  let result = await employeeService.addEmployee(req.body);
  return dataTypeConfig.buildResponse(req, res, result, 'employee');
});

router.put('/', dataTypeConfig.bustHeaders, xmlparser(dataTypeConfig.xmlOptions), async (req, res, next) => {
  let result = await employeeService.editEmployee(req.body);
  return dataTypeConfig.buildResponse(req, res, result, 'employee');
});

router.delete('/:employeeId', dataTypeConfig.bustHeaders, async (req, res, next) => {
  let result = await employeeService.deleteEmployee(req.params.employeeId);
  return dataTypeConfig.buildResponse(req, res, result, 'result');
});

module.exports = router;