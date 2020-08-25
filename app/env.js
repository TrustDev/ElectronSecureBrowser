require('dotenv').config()
function getEnvVar(key) {
    switch(key) {
        case 'auth0_domain':
            return process.env.auth0_domain;
        case 'auth0_client_id':
            return process.env.auth0_client_id;
        case 'unsplash_access':
            return process.env.unsplash_access;
        case 'unsplash_secret':
            return process.env.unsplash_secret;
        case 'MONGODB_URL':
            return process.env.MONGODB_URL;
        default:
            return '';
    }
}
module.exports = {
    getEnvVar
};