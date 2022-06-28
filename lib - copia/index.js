const config = require('./config/entorno.js'); 
const express = require('express');
const routes = require('./routes');
const utils = require('./utils/utils'); 
const bodyParser = require('body-parser'); 
var cors		= require('cors');  
const log4js = require("log4js"); 
 
//crea un app de express
const app = express(); 
log4js.configure({
    appenders: {
        siges_com_utilitario: {
        type: "dateFile",
        filename: "../log/siges-com-utilitario.log",
        pattern: "yyyy-MM-dd",
        compress: true,
      },
    },
    categories: {
      default: { appenders: ["siges_com_utilitario"], level: "debug" },
    },
  });
app.use(cors());
 
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json()) 
 
//Inicia Routes
app.use('/ms-com-utilitario/',  routes());
 
//Servidor y puerto
const host = config.HOST;
const port = config.PORT; 
const logger = log4js.getLogger("siges_com_utilitario"); 
app.listen(port, host, () => {
     console.log('Servidor funcionando correctamente en el puerto: ' + port);
     logger.debug('Servidor funcionando correctamente en el puerto: ' + port); 
});