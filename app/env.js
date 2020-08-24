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
        case 'unsplash_access':
            if (process.env.MODE === 'debug')
                return "M2zzatn7WJ3EpYYtAmucqrrv24deqkZ5WZ11YjXvL3g";   
            return process.env.unsplash_access;
        case 'unsplash_secret':
            if (process.env.MODE === 'debug')
                return "OIpkWomTcG9daIzVDJWv0RN7fhov0Y4IEQHnASiPm8g";   
            return process.env.unsplash_secret;
        case 'MONGODB_URL':
            if (process.env.MODE === 'debug')
                return "mongodb://localhost:27017";   
            return process.env.MONGODB_URL;
        default:
            return '';
    }
}
module.exports = {
    getEnvVar
};