# Sheets API
Sheets API provides endpoints to login, read and update spreadsheets in google sheets

## Requirements

Nodejs and npm should be installed. Additionally, install the packages required by running,

```bash
npm i 
```

## Run the project

Run using the command
```bash
npm start
```

## APIs
1. http://localhost:8080/status

2. http://localhost:8080/auth/login

   Authorize your google account, the response will be a token, copy this to access the other endpoints

3. http://localhost:8080//spreadsheet/{spreadsheet_id_passed_here}

Headers
```
{
   token: {token received on logging in to be used here}
}
```

4. http://localhost:8080//spreadsheet/update

Headers
```
{
   token: {token received on logging in to be used here}
}
```

Example request
```
{
    "spreadsheet_id": "1Nyg_Hac9_bl24VBWXSTiEICo0MIJaGcdqQvwSC3_4kY", 
    "sheet_id": 717000713, 
    "row_number": 7,
    "column_number": 6, 
    "value": "cobra"
}
```