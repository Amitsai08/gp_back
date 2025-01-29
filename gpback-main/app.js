const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('./db/conn');  // Database connection
const Router = require('./router/auth');
const User = require('./model/userSchema');

dotenv.config({ path: './config.env' });

const app = express();

// 🔹 Enable trust proxy for cookies when deployed
app.set('trust proxy', 1);

// 🔹 CORS Configuration for Vercel Frontend
const corsOptions = {
  origin: "https://bankagentbridgegreivanceportal.vercel.app", // ✅ Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // ✅ Allows cookies
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 🔹 Apply CORS middleware globally
app.use(cors(corsOptions));

// 🔹 Middleware for parsing cookies and JSON body
app.use(cookieParser());
app.use(express.json());

// 🔹 Handle preflight OPTIONS requests globally
app.options('*', cors(corsOptions));

// 🔹 Use routes from the router module
app.use(Router);

// 🔹 Set port from environment variables or default to 5000
const port = process.env.PORT || 5000;

// Debugging logs
console.log(`Backend running on port: ${port}`);
console.log(`CORS Config: `, corsOptions);

// 🔹 Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
