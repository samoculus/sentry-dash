const express = require('express');

const router = express.Router();

router.get('/', function(req, res){
    res.json('JSON STATUS CODE.')

});

module.exports = router;