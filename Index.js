require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const userRouter = require("./src/Routes/user");
const bodyParser = require('body-parser');
const cors = require("cors");
const xXssProtection = require("x-xss-protection");
const helmet = require("helmet");
require("./src/DB/conn");

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(xXssProtection());

// CORS setup
const whitelist = [process.env.CLIENT_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.options('/', cors());
app.use(cors({ origin: corsOptions, credentials: true }));

// Security headers setup
app.use(function (req, res, next) {
    next();
});

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

// Trust proxy
app.set('trust proxy', 1);

// Common error handling middleware
app.use((err, req, res, next) => {
    // Handle JSON processing errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.sendStatus(400);
    }
    next();
});

// Routes
app.use(userRouter);

// Start server
const port = process.env.API_PORT;
app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});