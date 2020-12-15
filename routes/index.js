const express = require('express');
const router = express.Router(); 

const emailRxBusiness       = require('../business/EmailRxBusiness');    

module.exports = function(){ 
    router.post('/enviaremailmasivo' , emailRxBusiness.enviarEmailMasivo); 
    router.post('/enviaremail' , emailRxBusiness.enviarEmail);   
    return router;
}

