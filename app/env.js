require('dotenv').config()

function getEnvVar(key) {
    switch(key) {
        case 'auth0_domain':            
            if (process.env.MODE === 'debug')
                return "dev-k0t2a7u1.us.auth0.com";
            return process.env.auth0_domain;
        case 'auth0_client_id':
            if (process.env.MODE === 'debug')
                return "ay2sjNI2hQUrNSK40y40Ynv4EScHrRi5";            
            return process.env.auth0_client_id;
        default:
            return '';
    }
}
module.exports = {
    getEnvVar
};