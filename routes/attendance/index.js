const express = require("express");
const router = express.Router();

const Attendance = require("../../controllers/attendance");

router.get("/get", Attendance.getAttendance);
router.post("/update", Attendance.updateAttendance);
router.get("/getbyemployeeid", Attendance.getAttendanceByEmplloyeeID);

module.exports = router;
