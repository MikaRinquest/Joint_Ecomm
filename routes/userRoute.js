const express = require("express");
const router = express.Router();
const con = require("../library/database_connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const middleware = require("../middleware/auth");

// Display all users
router.get("/", (req, res) => {
  try {
    let sql = "SELECT * FROM users";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
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
    const { fullname, email, password, shipping_address, phone_number } =
      req.body;
    // Start encrypting
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    let user = {
      fullname,
      email,
      password: hash,
      shipping_address,
      phone_number,
    };
    con.query(sql, user, (err, result) => {
      if (err) throw err;
      res.send(`User ${user.fullname} was created.`);
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400).send(error);
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
router.patch("/:id", (req, res) => {
  try {
    let sql = `UPDATE users SET type = "Admin" where user_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("User has successfully became an Admin.");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

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

// Get all items from cart
router.get("/:id/cart", (req, res) => {
  let cart = [];
  try {
    let sql = "SELECT * FROM cart";
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        res.send("Cart is empty.");
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Adding to cart
router.post("/:id/cart", (req, res) => {
  try {
    let sql = "INSERT INTO cart SET ?";
    const { user_id, quantity, cart_items } = req.body;
    let jsonCart = JSON.stringify(cart_items);
    let cart = {
      user_id,
      quantity,
      cart_items: jsonCart,
    };
    con.query(sql, cart, (err, result) => {
      if (err) throw err;
      res.send("Added to cart successfully.");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Deleting one item from cart
router.delete("/:id/cart/:id", (req, res) => {
  try {
    let sql = `DELETE FROM cart WHERE cart_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("Item has been successfully removed.");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Clear cart
router.delete("/:id/cart", (req, res) => {
  try {
    let sql = "TRUNCATE TABLE cart";
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("Cart has been cleared");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Edit cart
router.patch("/:id/cart/:id", (req, res) => {
  try {
    let sql = "UPDATE cart SET ?";
    let cart = {
      quantity: req.body.quantity,
    };
    con.query(sql, cart, (err, result) => {
      if (err) throw err;
      res.send("Quantity has been updated");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

/*
{
"user_id":"1",
"quantity":"2",
"cart_items":[{"product_id": 3,
    "name": "Love Bracelet",
    "brand": "Cartier",
    "description": "Beautiful bracelet for your love.",
    "price": 10000,
    "type": "women's jewelry",
    "state": "new",
    "url": "https://i.postimg.cc/B6LJ6mN5/pngwing-com-7.png",
    "user_id": 1,
    "qty":2}]
}
*/
module.exports = router;
