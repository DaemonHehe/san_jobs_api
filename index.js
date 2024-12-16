const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection(process.env.DATABASE_URL);

app.get("/", (req, res) => {
  res.send("Hello world!!");
});

// users
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", function (err, results, fields) {
    res.send(results);
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    function (err, results, fields) {
      res.send(results);
    }
  );
});

app.post("/users", (req, res) => {
  connection.query(
    "INSERT INTO `users` (`fname`, `lname`, `username`, `password`, `avatar`) VALUES (?, ?, ?, ?, ?)",
    [
      req.body.fname,
      req.body.lname,
      req.body.username,
      req.body.password,
      req.body.avatar,
    ],
    function (err, results, fields) {
      if (err) {
        console.error("Error in POST /users:", err);
        res.status(500).send("Error adding user");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

app.put("/users", (req, res) => {
  connection.query(
    "UPDATE `users` SET `fname`=?, `lname`=?, `username`=?, `password`=?, `avatar`=? WHERE id =?",
    [
      req.body.fname,
      req.body.lname,
      req.body.username,
      req.body.password,
      req.body.avatar,
      req.body.id,
    ],
    function (err, results, fields) {
      res.send(results);
    }
  );
});

app.delete("/users", (req, res) => {
  connection.query(
    "DELETE FROM `users` WHERE id =?",
    [req.body.id],
    function (err, results, fields) {
      res.send(results);
    }
  );
});

// jobs 
app.get("/jobs", (req, res) => {
  connection.query("SELECT * FROM jobs", function (err, results, fields) {
    if (err) {
      console.error("Error in GET /jobs:", err);
      res.status(500).send("Error fetching jobs");
    } else {
      res.send(results);
    }
  });
});

// Get a single job by ID
app.get("/jobs/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM jobs WHERE id = ?",
    [id],
    function (err, results, fields) {
      if (err) {
        console.error("Error in GET /jobs/:id:", err);
        res.status(500).send("Error fetching job");
      } else {
        res.send(results);
      }
    }
  );
});

// Add a new job
app.post("/jobs", (req, res) => {
  connection.query(
    "INSERT INTO `jobs` (`company`, `logourl`, `isMark`, `title`, `location`, `time`, `requirements`, `category`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.company,
      req.body.logourl,
      req.body.isMark,
      req.body.title,
      req.body.location,
      req.body.time,
      req.body.requirements,
      req.body.category,
    ],
    function (err, results, fields) {
      if (err) {
        console.error("Error in POST /jobs:", err);
        res.status(500).send("Error adding job");
      } else {
        res.status(200).send(results);
      }
    }
  );
});

// Update a job
app.put("/jobs", (req, res) => {
  connection.query(
    "UPDATE `jobs` SET `company`=?, `logourl`=?, `isMark`=?, `title`=?, `location`=?, `time`=?, `requirements`=?, `category`=? WHERE id = ?",
    [
      req.body.company,
      req.body.logourl,
      req.body.isMark,
      req.body.title,
      req.body.location,
      req.body.time,
      req.body.requirements,
      req.body.category,
      req.body.id,
    ],
    function (err, results, fields) {
      if (err) {
        console.error("Error in PUT /jobs:", err);
        res.status(500).send("Error updating job");
      } else {
        res.send(results);
      }
    }
  );
});

// Delete a job
app.delete("/jobs", (req, res) => {
  connection.query(
    "DELETE FROM `jobs` WHERE id = ?",
    [req.body.id],
    function (err, results, fields) {
      if (err) {
        console.error("Error in DELETE /jobs:", err);
        res.status(500).send("Error deleting job");
      } else {
        res.send(results);
      }
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("CORS-enabled web server listening on port 3000");
});

// Export the app for Vercel serverless functions
module.exports = app;
