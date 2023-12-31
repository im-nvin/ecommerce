const express = require('express');
const app = express();
const dotenv = require("dotenv");
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const stripeRoute = require('./routes/stripe');

const cors=require('cors')



dotenv.config();

const mongoose = require("mongoose");
//connecting mongoose to our mongodb db
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB connection is successfull"))
    .catch((err) => { console.log(err) })

app.use(express.json());
app.use(cors())
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productsRoute)
app.use("/api/cart", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/checkout", stripeRoute)




app.listen(process.env.PORT || 3001, () => {
    console.log("Backend server is running");
})