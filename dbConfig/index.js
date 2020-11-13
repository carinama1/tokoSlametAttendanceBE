const db = require("monk")(
  process.env.MONGODB_URI || "localhost:27017/tokoSlametAttendance"
);

exports.employees = db.get("employees");
exports.attendance = db.get("attendance");
exports.test = db.get("test");
