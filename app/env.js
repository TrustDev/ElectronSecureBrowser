require('dotenv').config()

function getEnvVar(key) {
    switch(key) {
        case 'auth0_domain':
            return process.env.auth0_domain;
        case 'auth0_client_id':            
            return process.env.auth0_client_id;
        default:
            return '';
    }
}
module.exports = {
    getEnvVar
};