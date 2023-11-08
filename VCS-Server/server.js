const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./Routes/authRoutes.js');
const searchRoutes = require('./Routes/searchRoutes.js');
const projectRoutes = require('./Routes/projectRoutes.js');
const commandRoutes = require('./Routes/commandRoutes.js');

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());

app.use(cors({origin : process.env.CLIENT_ORIGIN.toString() , credentials : true}));

app.use(authRoutes);
app.use(searchRoutes);
app.use(projectRoutes);
app.use(commandRoutes);

app.listen(process.env.PORT, () => {
    console.log(`DB server running at PORT ${process.env.PORT}`);
})