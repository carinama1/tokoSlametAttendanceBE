const express = require("express");
const cors = require("cors");
const schedule = require("node-schedule");
const port = process.env.PORT || 4009;

let test = 1;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const EmployeeRouter = require("./routes/employees");

app.use("/time", (req, res) => {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();
  const hour = today.getHours();
  const minutes = today.getMinutes();
  const day = today.getDay();

  res.send({ date, month, year, day, hour, minutes });
});

const execute = schedule.scheduleJob({ second: 20 }, () => {
  console.log("asd");
  test += 1;
});

app.use("/api/v1/employees", EmployeeRouter);
app.use("/", (req, res) => {
  res.send({ message: test });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
