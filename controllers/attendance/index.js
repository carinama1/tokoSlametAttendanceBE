const { attendance, employees } = require("../../dbConfig");
const monk = require("monk");

exports.getAttendance = (req, res) => {
  const { _id } = req.query;
  let resultData = [];
  if (!_id) {
    employees.find({}).then(async (empDatas) => {
      let attendancePromisedArray = await Promise.all(
        empDatas.map(async (data) => {
          const { _id, months } = data;
          return attendance.findOne({ employeeID: _id, months });
        })
      );
      attendancePromisedArray.map((attendanceData, index) => {
        attendanceData.name = empDatas[index].name;
        attendanceData.payday = empDatas[index].payday;
        attendanceData.phone = empDatas[index].phone;
        attendanceData.role = empDatas[index].role;
        resultData.push(attendanceData);
      });
      res.send({ data: resultData });
    });
  } else {
    attendance.findOne({ _id }).then((att) => {
      if (att) {
        const attendanceData = att;
        const { employeeID } = att;
        employees.findOne({ _id: employeeID }).then((emp) => {
          const { name, role, phone, payday } = emp;
          attendanceData.name = name;
          attendanceData.payday = payday;
          attendanceData.phone = phone;
          attendanceData.role = role;
          res.send({ data: attendanceData });
        });
      } else {
        res.status(404).send("User Not Found");
      }
    });
  }
};

exports.getAttendanceByEmplloyeeID = (req, res) => {
  let { employeeID } = req.query;
  let returnPayload = {};
  employeeID = monk.id(employeeID);
  attendance.find({ employeeID }).then((docs) => {
    employees
      .findOne({ _id: employeeID }, { projection: { _id: 0 } })
      .then((emp) => {
        returnPayload.employeeData = { emp };
        returnPayload.data = docs;
        res.send({ data: returnPayload });
      });
  });
};

exports.updateAttendance = (req, res) => {
  const { _id, value } = req.body;
  attendance.findOne({ _id }).then((doc) => {
    if (doc) {
      let { absent, day } = doc;

      if (!value) {
        absent += 1;
      }
      attendance
        .update(
          { _id },
          { $set: { [`attendanceHistory.${day - 1}`]: value, absent: absent } }
        )
        .then((doc) => {
          res.send("succes");
        });
    }
  });
};
