const mongoose =require('mongoose');
mongoose.connect("mongodb://localhost:27017/user_management")
const express= require('express');

//set port
const PORT = 3000;
const app = express();

//cache controle
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

//for user route
const userRoute = require('./routes/userRoute')
app.use('/',userRoute);

// for Admin route
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute);

//error handling function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});