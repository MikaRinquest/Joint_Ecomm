const express = require("express");
const router = express.Router();
const con = require("../library/database_connection");
// const middleware = require("../middleware/auth");

// View all
router.get("/", (req, res) => {
  try {
    con.query("SELECT * FROM products", (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// View one
router.get("/:id", (req, res) => {
  try {
    let sql = "SELECT * FROM products WHERE product_id = ?";
    let products = {
      product_id: req.body.product_id,
    };
    con.query(sql, products, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add a product
// router.post("/add", (req, res) => {
//     try {
//         let sql = "INSERT INTO products SET ?"
//         const = {

//         }
//     }
// })

module.exports = router;
