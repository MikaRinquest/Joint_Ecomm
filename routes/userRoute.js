const express = require("express");
const router = express.Router();
const con = require("../library/database_connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const middelware = require("../middleware/auth");

// Display all users
router.get("/", (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result[0]);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Display one user
router.get("/:id", (req, res) => {
  try {
    let sql = `SELECT * FROM users WHERE user_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Registers a user
router.post("/register", (req, res) => {
  try {
    let sql = "INSERT INTO users SET ?";
    const { fullname, type, email, password, shipping_address, phone_number } =
      req.body;

    // Start encrypting
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      fullname,
      type,
      email,
      password: hash,
      shipping_address,
      phone_number,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send(err);
    });
    res.json(`User ${user.fullname} was created.`);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Login user
router.post("/login", (req, res) => {
  try {
    let sql = "SELECT * FROM users WHERE ?";
    let user = { email: req.body.email };

    con.query(sql, user, async (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Email does not exist, please register.");
      } else {
        const isMatch = await bcrypt.compare(
          req.body.password,
          result[0].password
        );
        if (!isMatch) {
          res.send("Password is incorrect");
        } else {
          const payload = {
            user: {
              user_id: result[0].user_id,
              fullname: result[0].fullname,
              type: result[0].type,
              email: result[0].email,
              password: result[0].password,
              shipping_address: result[0].shipping_address,
              phone_number: result[0].phone_number,
            },
          };
          jwt.sign(
            payload,
            process.env.jwtSecret,
            {
              expiresIn: "365d",
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Edit user details
router.put("/:id", (req, res) => {
  try {
    let sql = "UPDATE users SET ?";
    const { fullname, type, email, password, shipping_address, phone_number } =
      req.body;
    // Start encrypting
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      fullname,
      type,
      email,
      password: hash,
      shipping_address,
      phone_number,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send(`${user.fullname} was edited successfully.`);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Turn user into an admin(uses patch method)

//Delete user
router.delete("/:id", (req, res) => {
  try {
    let sql = `DELETE FROM users WHERE user_id = ${req.params.id}`;

    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("User has been successfully deleted");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//Verify the user
router.get("/users/verify", (req, res) => {
  const token = req.header("x-auth-token");
  jwt.verify(token, process.env.jwtSecret, (error, decodedToken) => {
    if (error) {
      res.status(401).json({ alert: "Something is wrong with the token" });
    } else {
      res.status(200);
      res.send(decodedToken);
    }
  });
});

module.exports = router;
