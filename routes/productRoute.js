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
    let sql = `SELECT * FROM products WHERE product_id = ${req.params.id}`;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Add a product
router.post("/", (req, res) => {
  try {
    let sql = "INSERT INTO products SET ?";
    const { name, brand, description, price, type, state, url, user_id } =
      req.body;
    let products = {
      name,
      brand,
      description,
      price,
      type,
      state,
      url,
      user_id,
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

// Edit single product
router.put("/:id", (req, res) => {
  try {
    let sql = `UPDATE products SET ? where product_id = ${req.params.id}`;
    const { name, brand, description, price, type, state, url } = req.body;
    let product = { name, brand, description, price, type, state, url };
    con.query(sql, product, (err, result) => {
      if (err) throw err;
      res.send(`${product.name} updated successfully`);
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete a product
router.delete("/:id", (req, res) => {
  try {
    let sql = `DELETE FROM products WHERE product_id = ${req.params.id}`;

    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send("Product was successfully deleted.");
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
