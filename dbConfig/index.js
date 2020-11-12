const db = require("monk")("localhost:27017/tokoSlametAttendance");

exports.employees = db.get("employees");
