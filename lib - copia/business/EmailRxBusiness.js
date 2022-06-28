const nodemailer 	= require("nodemailer");
var smtpTransport 	= require("nodemailer-smtp-transport");
var handlebars 		= require('handlebars');
var fs 				= require('fs');
const utils 		= require('../utils/utils'); 
const config 	 	= require('../config/config.json');  

//const msgData					= require ('../i18n/messages.json');
/**
 * @description Función que permite enviar email masivo
 * @creation David Villanueva 14/12/2020
 * @update
 */
exports.enviarEmailMasivo = async (req, res) => { 
	 var oResponse	  = {};
	 oResponse.oData  = {}; 
     try { 
		//var text = await fs.readFileSync(__dirname + '\\demo.html','utf8'); 
		var oData    = req.body;
		let transporter = nodemailer.createTransport(smtpTransport({
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
	   }));
	   /*var htmlToSend = "";
	   var template = handlebars.compile(text);
			var replacements = {
				username: "David Villanueva"
			};
		htmlToSend = template(replacements); 
		*/
		await oData.forEach( async function(e){ 
			var htmlToSend = e.sCuerpoMensaje;
			var envioCorreo = await transporter.sendMail({
						from: config.user, // sender address
						to: e.sCorreo, // list of receivers
						subject: e.sAsunto, // Subject line 
						html: htmlToSend, // html body
			});  

		});
		
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
 
/**
 * @description Función que permite enviar email individual
 * @creation David Villanueva 15/12/2020
 * @update
 */
exports.enviarEmail = async (req, res) => { 
	var oResponse	  = {};
	oResponse.oData  = {}; 
	try { 
	   //var text = await fs.readFileSync(__dirname + '\\demo.html','utf8'); 
	   var oData    = req.body;
	   let transporter = nodemailer.createTransport(smtpTransport({
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
	  }));
	  /*var htmlToSend = "";
	  var template = handlebars.compile(text);
		   var replacements = {
			   username: "David Villanueva"
		   };
	   htmlToSend = template(replacements); 
	   */
	  
		   var htmlToSend = oData.sCuerpoMensaje;
		   var envioCorreo = await transporter.sendMail({
					   from: config.user, // sender address
					   to: oData.sCorreo, // list of receivers
					   subject: oData.sAsunto, // Subject line 
					   html: htmlToSend, // html body
		   });  

	 
	   
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
