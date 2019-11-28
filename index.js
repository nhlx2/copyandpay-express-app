const express = require('express')
const app = express()
const port = 3000

var https = require('https');
var querystring = require('querystring');

function request(callback) {
    var path='/v1/checkouts';
    var data = querystring.stringify( {
	'entityId':'8ac7a4c86ea13cf0016ea21836dc017c',
	'amount':'92.00',
	'currency':'ZAR',
	'paymentType':'DB'
    });
    var options = {
	port: 443,
	protocol:'https:',
	host: 'test.letswhoosh.co.za',
	path: path,
	method: 'POST',
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': data.length,
	    'Authorization': 'Bearer OGE4Mjk0MTg2NGQ2MzI1ZTAxNjRkYzAzMzgzYjEyNDJ8NHlKZ3RSYmhmOA=='
	}
    };
    var postRequest = https.request(options, (res) => {
	res.setEncoding('utf8');
	res.on('data', chunk => {
	    jsonRes = JSON.parse(chunk);
	    return callback(jsonRes);
	});
    });
    postRequest.write(data);
    postRequest.end();
}
var checkoutId;
request((responseData => {
    checkoutId = responseData['id']
}))




app.get('/', (req, res) => res.send(`<h1>New Year Eve Music Fest</h1>
Admit: 1 <br>
Amount: R92.00 <script src="https://test.letswhoosh.co.za/v1/paymentWidgets.js?checkoutId=${checkoutId}"></script>\
                                     <form action="http://localhost:3000/yes" class="paymentWidgets" data-brands="VISA MASTER AMEX"></form>`))
app.get('/yes', (req, res) => res.send('Payment processed. See you there! <br>'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
