    
    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log({ message: `uncaughtExceptionMonitor : ${err} ${origin}` });

    });
    process.on('unhandledRejection', (reason, promise) => {
        console.log({ message: `Unhandled Rejection : ${reason} ${promise}` });
    });
    require('dotenv').config();
    const compression = require('compression');
    const express = require('express');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const app = new express();
    const mongoose = require('mongoose');
    const cors = require('cors');
    const path = require('path');
    const checkAuth = require('./middlewares/check-auth');
    const logger = require('./middlewares/logger');
    const autoIncrement = require('mongoose-auto-increment');
    const fs = require('fs');
    const routes = fs.readdirSync('./Controllers/').map(file => file.replace('.js', ''));
    // Body-parser to prase request body and convert it to json
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ limit: "50mb" })); 
    app.use(compression());
    app.use(cookieParser());
    app.use(cors());
    var port = process.env.PORT || 8500;
    // Middlewares 
    app.use(express.static('.well-known'));
    app.all('*', logger);
    app.all('*', checkAuth);
    // Connect to the DB
    mongoose.connect(process.env.DB_URL).then(function(connection) {
        console.log({ message: `v1 Mongo connected: ${/[^/]*$/.exec(process.env.DB_URL)[0]}` });
        global.mongooseInstance = mongoose;
        autoIncrement.initialize(connection);
        let server = app.listen(port, async() => {
            try {
                for (let route of routes)
                app.use(`/api/${route}`, require(`./Controllers/${route}`)(app, express, server));
                global.applicationMetadataReference = {
                    server,
                    app
                }
            } catch (err) {
                console.log({ message: `"Server Error : ${err}` });
            }
        });
    }).catch(function(err) {
        console.log({ message: `"Mongo connection error : ${err}` });
    });
