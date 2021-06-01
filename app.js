const express = require('express');
const router = require('./src/routing');
const myRequestLogger = require('./src/utilities/requestLogger');
const port = process.env.PORT || 8000;
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(myRequestLogger);
app.use('/artists', router);
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
