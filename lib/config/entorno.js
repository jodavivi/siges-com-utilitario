require('dotenv').config({path:process.env.NODE_ENV +'.env'});  
module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT ,
    EMAIL_USUARIO: process.env.EMAIL_USUARIO,
    EMAIL_CLAVE: process.env.EMAIL_CLAVE,
    EMAIL_TEMPLATES:process.env.EMAIL_TEMPLATES
  }
 