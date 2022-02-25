const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
   res.send('GET route on page.');
});
router.post('/', function(req, res){
   res.send('POST route on page.');
});

module.exports = router;