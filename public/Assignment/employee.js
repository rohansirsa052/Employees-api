const express = require("express");
const app = express();
const hbs = require("hbs");
const validator = require("validator");

const mongoose = require("mongoose");
app.set("view engine", "hbs");
app.get("/", (req, res) => {
  res.render("index");
});
mongoose
  .connect("mongodb://127.0.0.1:27017/Employee-api")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const employeeScema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, // custom validator
  },
  Address: {
    type: String,
    required: true,
  },
  Position: {
    type: String,
    required: true,
    uppercase: true,
  },
  gender: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("email is invalid");
    },
  },
  Phone: {
    type: Number,
    unique: true,
  },
  Phone2: {
    type: Number,
    unique: true,
  },
});

const employeeData = new mongoose.model("employeeData", employeeScema);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/", async (req, res) => {
  try {
    const first_document = new employeeData({
      Name: req.body.Name,
      gender: req.body.gender,
      Email: req.body.Email,
      Position: req.body.Position,
      Address: req.body.Address,
      Phone: req.body.Phone,
      Phone2: req.body.Phone2,
    });
    const result = await first_document.save(); // To save the data into database
    console.log(result);
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Read the data from employee database

app.get("/employees", async (req, res) => {
  try {
    const result = await employeeData.find();
    res.json(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get individual employee data using id
app.get("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await employeeData.findById({ _id: id });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
// update the employees by id
app.patch("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await employeeData.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Delete the studendts by id
app.delete("/employees/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await employeeData.findByIdAndDelete(id);
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

const port = process.env.PORT || 9090;
app.listen(port, () => console.log(`Server running at ${port}`));
// In this project we can create new employees , update existing employees, get employee and delete existing employee data from the database with the help of nodeJs and Express
