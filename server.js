const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");
const port = process.env.PORT || 4009;
const { test } = require("./dbConfig/");

let test = 1;

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

const execute = schedule.scheduleJob({ second: 20 }, () => {
  test.find({}).then((doc) => {
    if (doc.length > 0) {
      const { minutesRun, _id } = doc[0];

      test.update({ _id }, { $set: { minutesRun: minutesRun + 1 } });
    } else {
      test.insert({ minutesRun: 1 });
    }
  });
  test += 1;
});

app.use("/api/v1/employees", EmployeeRouter);
app.use("/", (req, res) => {
  res.send({ message: test });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
