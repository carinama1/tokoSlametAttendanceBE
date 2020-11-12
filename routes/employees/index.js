const express = require("express");
const router = express.Router();

const Employees = require("../../controllers/employees");

router.get("/get", Employees.getEmployees);

router.post("/add", Employees.insertEmployee);

module.exports = router;
