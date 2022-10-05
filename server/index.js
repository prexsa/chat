require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// middleware needs to be before routes
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server listening on PORT ${PORT}`));