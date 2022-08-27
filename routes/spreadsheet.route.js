const router = require('express').Router()
const spreadsheetController = require('../controllers/spreadsheet.controller')

router.get("/:spreadsheet_id", spreadsheetController.read);
router.post("/update", spreadsheetController.update);

module.exports = router