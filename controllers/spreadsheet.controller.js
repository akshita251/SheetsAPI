const httpError = require('http-errors')
const { google } = require('googleapis');
var { oAuth2Client } = require('../configs/oauth.config')

module.exports = {
    read: async (req, res, next) => {
        try {

            //check for tokens
            if (req.headers.token == null) throw httpError.BadRequest('Token not found')

            oAuth2Client.setCredentials(JSON.parse(req.headers.token));
            const googleSheets = google.sheets({ version: 'v4', auth: oAuth2Client });

            const spreadsheet_id = req.params.spreadsheet_id
            //check for spreadsheet_id
            if (!spreadsheet_id) throw httpError.BadRequest('Spreadsheet id not found')

            var fetchedData = {}

            //obtain sheets' properties in the spreadsheet
            await googleSheets.spreadsheets.get({
                spreadsheetId: spreadsheet_id,
            }).then(async (sheets, err) => {

                if (err) throw httpError(err);

                sheets = sheets.data.sheets;
                for (i = 0; i < sheets.length; i++) {
                    var sheetId = sheets[i].properties.sheetId
                    var sheetTitle = sheets[i].properties.title

                    //adding the sheet into the response data
                    fetchedData[sheetId] = []
                    //ranging the entire sheet
                    range = sheetTitle + '!A1:ZZ'

                    //obtaining the values in th respective sheet
                    await googleSheets.spreadsheets.values.get({
                        spreadsheetId: spreadsheet_id,
                        range: range,
                    }).then(async (sheetData, err) => {
                        if (err)
                            throw httpError(err)

                        const rows = sheetData.data.values;
                        if (rows.length) {
                            await rows.forEach(row => {
                                if (row.length) {
                                    row_data = {}

                                    for (j = 0; j < row.length; j++) {
                                        row_data[j] = row[j]
                                    }
                                    fetchedData[sheetId].push(row_data);
                                }
                            });
                        } else {
                            console.log('No data found in ' + sheetTitle);
                        }
                    })

                    if (i == (sheets.length - 1))
                        res.send(fetchedData)
                };

            })
        } catch (error) {
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {

            //check for token
            if (req.headers.token == null) return res.status(400).send('Token not found');

            oAuth2Client.setCredentials(JSON.parse(req.headers.token));
            const googleSheets = google.sheets({ version: 'v4', auth: oAuth2Client });

            spreadsheet_id = req.body.spreadsheet_id
            //check for spreadsheet_id
            if (!spreadsheet_id) throw httpError.BadRequest('Spreadsheet id not found')

            await googleSheets.spreadsheets.get({
                spreadsheetId: spreadsheet_id
            }).then(async (sheets, err) => {
                if (err) return console.log('The API returned an error: ' + err);

                sheets = sheets.data.sheets;
                if(sheets == null) throw httpError.BadRequest('Invalid Sheet id')
                var sheetTitle

                await sheets.forEach(sheet => {
                    var sheetId = sheet.properties.sheetId

                    if (sheetId == req.body.sheet_id) {
                        sheetTitle = sheet.properties.title
                    }
                });

                if (sheetTitle) {

                    row = parseInt(req.body.row_number);
                    column_number = parseInt(req.body.column_number);
               
                    if(row == null || isNaN(row) || column_number== null || isNaN(column_number))
                        throw httpError.BadRequest('Number of rows or column not found')

                    column = (column_number + 9).toString(36).toUpperCase()

                    range = sheetTitle + '!' + column + row

                    value = req.body.value
                    if(value == null)
                        throw httpError.BadRequest('Value not found')

                    await googleSheets.spreadsheets.values.update({
                        spreadsheetId: spreadsheet_id,
                        range: range,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: {
                            "range": range,
                            "values": [[value]]
                        },
                        auth: oAuth2Client,
                    }).then((data, err) => {
                        if (err) {                    
                            console.log(err)
                            throw httpError(err)
                        }
                        var response = { sucess: true }
                        res.send(response)
                    })
                } else {
                    throw httpError.BadRequest('Invalid sheet_id')
                }

            })
        } catch (error) {
            next(error)
        }
    }
}