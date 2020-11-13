const { employees } = require("../../dbConfig");

// /api/v1/employees/get
exports.getEmployees = (req, res) => {
  // const item = { name: "tahu", payday: 20, phone: "081233476375" };
  // employees.insert(item);
  employees.find({}).then((data) => {
    res.send({ data: data });
  });
};

// /api/v1/employees/add
exports.insertEmployee = (req, res) => {
  const { name, payday, phone, role = "pegawai" } = req.body;

  employees.find({ name }).then((doc) => {
    if (doc.length > 0) {
      res.status(409).send(`${name} sudah terdaftar`);
    } else {
      const created = new Date();
      employees
        .insert({ name, payday, phone, role, created })
        .then((doc) => {
          res.status(201).send(`${name} berhasil didaftarkan`);
        })
        .catch((err) => {
          res.status(500).send("something went wrong");
          console.log(err);
        });
    }
  });
};
