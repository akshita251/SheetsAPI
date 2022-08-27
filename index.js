const express = require("express");
const cors = require('cors')
const morgan = require('morgan')
const httpError = require('http-errors');
require('dotenv').config();

const app = express();
PORT = process.env.PORT || 8080
VERSION = process.env.VERSION || '0.0'

//miiddlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

//route constants
const authRoute = require('./routes/auth.route')
const spreadsheetRoute = require('./routes/spreadsheet.route')

//to check the status of the server
app.get('/status', (req, res) => {
    res.status(200).send('Version: ' + VERSION)
})
app.use('/auth', authRoute)
app.use('/spreadsheet', spreadsheetRoute)

//handle invalid route
app.use(async (req, res, next) => {
    next(httpError.NotFound('This route does not exist'))
})

//error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        success: false,
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

app.listen(PORT, () => console.log("Server running on " + PORT));
