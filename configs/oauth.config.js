const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const credentials = require('../credentials.json');

const {client_id, client_secret, redirect_uris} = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

module.exports = {SCOPES, oAuth2Client};
