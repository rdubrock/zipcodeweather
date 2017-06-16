const express = require('express');
const app = express();
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
// reply to request with "Hello World!"
//app.get('/', function (req, res) {
 // res.send();
//});

//start a server on port 80 and log its start to our console
const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log('Find your zip code on port', port);
});
