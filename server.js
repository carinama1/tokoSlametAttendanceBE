const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");
const port = process.env.PORT || 4009;
const { test, employees, attendance } = require("./dbConfig/");

let test1 = 1;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const EmployeeRouter = require("./routes/employees");

app.use("/time", (req, res) => {
  const jakarta = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  const today = new Date(jakarta);

  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const day = today.getDay();

  res.send({ date, month, year, day, hour, minutes });
});

const generateAttendance = () => {
  const jakarta = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });
  const today = new Date(jakarta);

  const date = today.getDate();
  const month = today.getMonth();

  employees.find({}).then((docs) => {
    if (docs.length > 0) {
      docs.map((doc, index) => {
        const { _id, payday, months } = doc;

        attendance.findOne({ employeeID: _id, months }).then((doc) => {
          if (doc) {
            const { day, currentMonth } = doc;
            if (date > payday && currentMonth != month) {
              employees
                .update({ _id }, { $set: { months: months + 1 } })
                .then(() => {
                  attendance.insert({
                    employeeID: _id,
                    absent: 0,
                    months: months + 1,
                    currentMonth: month,
                    day: 1,
                    attendanceHistory: [],
                  });
                });
            } else {
              const newday = parseInt(day + 1);
              attendance.update(
                { employeeID: _id, months },
                {
                  $set: {
                    day: newday,
                  },
                }
              );
            }
          } else {
            attendance.insert({
              employeeID: _id,
              absent: 0,
              months,
              currentMonth: month,
              day: 1,
              attendanceHistory: [],
            });
          }
        });
      });
    }
    console.log("-----------------------");
  });
};

const execute = schedule.scheduleJob({ second: 1 }, () => {
  if (process.env.PRODUCTION) {
    generateAttendance();
  }
  test.find({}).then((doc) => {
    if (doc.length > 0) {
      const { minutesRun, _id } = doc[0];

      test.update({ _id }, { $set: { minutesRun: minutesRun + 1 } });
    } else {
      test.insert({ minutesRun: 1 });
    }
  });
  test1 += 1;
});

app.use("/api/v1/employees", EmployeeRouter);
app.use("/", (req, res) => {
  res.send({ message: test1 });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
