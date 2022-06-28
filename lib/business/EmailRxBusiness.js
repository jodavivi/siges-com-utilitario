const nodemailer 	= require("nodemailer");
const hbs 			= require('nodemailer-express-handlebars');
const path 			= require('path');
var smtpTransport 	= require("nodemailer-smtp-transport");
var handlebars 		= require('handlebars');
var fs 				= require('fs');
const utils 		= require('../utils/utils'); 
const config 	 	= require('../config/config.json');  
const configEntorno = require('../config/entorno.js'); 

//const msgData					= require ('../i18n/messages.json');
 
/**
 * @description Función que permite enviar email individual
 * @creation David Villanueva 15/12/2020
 * @update David Villanueva 26/06/2022
 */
exports.enviarEmail = async (req, res) => { 
	var oResponse	  = {};
	oResponse.oData  = {}; 
	try { 
	  
	   var oData    = req.body;

	   const handlebarOptions = {
			viewEngine: {
				partialsDir: configEntorno.EMAIL_TEMPLATES,
				defaultLayout: false,
			},
			viewPath: configEntorno.EMAIL_TEMPLATES,
		};

		var transport = nodemailer.createTransport({
			host: configEntorno.EMAIL_HOST,
			port: configEntorno.EMAIL_PORT,
			auth: {
			  user: configEntorno.EMAIL_USUARIO,
			  pass: configEntorno.EMAIL_CLAVE
			},
			debug: false, // activar degub
  			logger: false // ver informacion en console
		  });
		  // compilamos el template
		  transport.use('compile', hbs(handlebarOptions))

		  //Verificamos si es email masivo 
		  var aCorreoEnvio = [];
		  if(oData.aListaEmail 
			&& oData.aListaEmail != ""
				&& oData.aListaEmail.length > 0){
					aCorreoEnvio = oData.aListaEmail;
		  }else{
				aCorreoEnvio.push(oData.sCorreo);
		  }
		  aCorreoEnvio.forEach(function(e){
			var mailOptions = {};
			mailOptions.from = configEntorno.EMAIL_SERVER;
			mailOptions.to = e;
			if(oData.sCc 
			  && oData.sCc != ""){
				  mailOptions.cc = oData.sCc; 
			  }
			if(oData.sBcc 
			  && oData.sBcc != ""){
				  mailOptions.bcc = oData.sBcc; 
			} 
			mailOptions.subject = oData.sAsunto;
			if(oData.sTemplate 
				  && oData.sTemplate != ""){
					  mailOptions.template = oData.sTemplate;
					  mailOptions.context  = oData.oContexto;
			}else{
			  mailOptions.html = oData.sCuerpoMensaje;
			}
			if(oData.aArchivoBase64 
					  && oData.aArchivoBase64 != ""
						  && oData.aArchivoBase64.length > 0){
							  mailOptions.attachments = [];
							  oData.aArchivoBase64.forEach(function(e){
								  mailOptions.attachments.push(
									  {"filename":e.sNombreArchivo,
										"path":e.sArchivo
									  }
								  ); 
							  }); 
			  }
		   
			
			transport.sendMail(mailOptions, function(error, info){
				if(error){
					return console.log(error);
				}
				console.log('Message sent: ' + info.response);
			});

		  });
		  

	   /*let transporter = nodemailer.createTransport(smtpTransport({
		   host: "smtp.gmail.com", // hostname
		   secure: false, // use SSL
		   port: 25,
		   auth: {
			   user: config.user,
			   pass: config.pass
		   },
		   tls: {
			   rejectUnauthorized: false
		   }
	  }));*/ 
	   oResponse.iCode		= 1;
	   oResponse.sMessage	= 'OK'; 

	} catch (e) { 
	   var oError = utils.customError(e);
	   if (e.name === 'Error') {
		   oResponse.iCode 	= oError.iCode; 
		   oResponse.sMessage	= oError.sMessage;
	   }else{
		   oResponse.iCode 		= -2;
		   oResponse.sMessage		=  "Ocurrio un error en el proceso: " + e.toString(); 
	   } 
	}finally{
		oResponse.sIdTransaccion =  req.headers.sidtransaccion;
		oResponse = utils.customResponse(oResponse);
	}  
	
	res.json(oResponse) 
	 
};
