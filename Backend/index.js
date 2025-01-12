const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const route = require('./src/routes')
require('dotenv').config()
const Port = process.env.PORT || 3001;
const mongoURI = process.env.mongoURI;

const app = express();
app.use(express.json());
app.use(cors({origin: 'http://localhost:5173'}));
app.use("/store",route);
mongoose
.connect(mongoURI)
.then(()=>console.log("Connected"))
.catch((err)=>console.error("Couldn't connect",err));

app.listen(Port,()=>console.log(`Listen on port ${Port}`));