const express = require("express");
const cors = require("cors");
const port = 4009;

const app = express();

app.use(cors({ origin: "*" }));

const EmployeeRouter = require("./routes/employees");

app.use("/employees", EmployeeRouter);
app.use("/", (req, res) => {
  res.send({ message: "hello" });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
