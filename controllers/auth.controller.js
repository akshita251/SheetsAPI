const httpError = require('http-errors')
var { oAuth2Client, SCOPES } = require('../configs/oauth.config')

module.exports = {
    login: async (req, res, next) => {
        try {

            //generate the authentication url and redirect the user to the generated url
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            res.redirect(301, authUrl);

        } catch (error) {
            next(error)
        }
    },
    google: async (req, res, next) => {
        try {

            //obtain the code from the url and use it to get the token
            code = req.query.code
            oAuth2Client.getToken(code, (error, token) => {
                if (error) {
                    console.error('Error retrieving token', error);
                    throw httpError.BadRequest('Error retrieving token: ' + error)
                }
                res.send(token);
            });

        } catch (error) {
            next(error)
        }
    }
}