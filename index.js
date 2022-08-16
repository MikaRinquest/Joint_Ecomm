const express = require("express"); //Sets the server
const cors = require("cors");
const app = express();
// const middleware = require("./middleware/auth");

// Importing routes
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");

app.set("port", process.env.PORT || 8008); //Sets up the port that holds the api
app.use(express.json()); //Sets up the api as a json server
app.use(cors());

// Console logs where to access the api in the browser
app.listen(app.get("port"), (req, res) => {
  console.log(`Access port at localhost:${app.get("port")}`);
  console.log("Press Ctrl+C to cut off connection to the server");
});

// What will display when you first open the local host/heroku link
app.get("/", (req, res) => {
  res.json({
    users: "/users",
    products: "/products",
  });
});

// Setting the route links
app.use("/users", userRoute);
app.use("/products", productRoute);

// Fixing cors error
app.use(
  cors({
    origin: ["http://192.168.9.148:8080/", "http://localhost:8080/"],
    credentials: true,
  })
);
{
  credentials: "include";
}
