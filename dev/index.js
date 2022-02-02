const express = require('express')
const fs = require('fs')
const app = express()
const port = 80

app.use(express.static('../'))
app.post('/post', function(request, respond) {
    var body = '';
    filePath = __dirname + '/data.txt';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
            respond.end();
        });
    });
});

app.listen(port, () => console.log(`Dev server listening at http://localhost:${port}`))
