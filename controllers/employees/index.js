const { employees } = require("../../dbConfig");

exports.getEmployees = (req, res) => {
  // const item = { name: "tahu", payday: 20, phone: "081233476375" };
  // employees.insert(item);
  employees.find({}).then((data) => {
    res.send({ data: data });
  });
};

exports.insertEmployee = (req, res) => {
  res.send("Insert Employees");
};
