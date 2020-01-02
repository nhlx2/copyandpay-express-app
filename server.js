var express = require('express');
var app = express();
const port = 3000

var https = require('https');
var querystring = require('querystring');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


function checkout(callback) {
    var path='/v1/checkouts';
    var data = querystring.stringify( {
	'entityId':'8a8294185a184b44015a18be521a02b0',
	'amount':'85.00',
	'currency':'ZAR',
	'paymentType':'DB'
    });
    var options = {
	port: 443,
	host: 'test.letswhoosh.co.za',
	path: path,
	method: 'POST',
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': data.length,
	    'Authorization': 'Bearer OGE4Mjk0MTg1YTE4NGI0NDAxNWExOGJlNTI2YzAyYjR8Nk1XRGo3azg1OQ=='
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


function status(checkoutId, callback) {
    var path=`/v1/checkouts/${checkoutId}/payment`;
    path += '?entityId=8a8294185a184b44015a18be521a02b0';
    var options = {
	port: 443,
	host: 'test.letswhoosh.co.za',
	path: path,
	method: 'GET',
	headers: {
	    'Authorization': 'Bearer OGE4Mjk0MTg1YTE4NGI0NDAxNWExOGJlNTI2YzAyYjR8Nk1XRGo3azg1OQ=='
	}
    };
    var sendRequest = https.request(options, (res) => {
	res.setEncoding('utf8');
	res.on('data', chunk => {
	    jsonRes = JSON.parse(chunk);
	    return callback(jsonRes);
	});
    });
    sendRequest.end();
}
var checkoutId;

app.get('/', (req, res) => {var checkoutId;
			    checkout((responseData => {
			    	checkoutId = responseData['id'];
				console.log('firstCheckoutId: ' + checkoutId);
				res.render('index.html', {checkoutId: checkoutId});
			    }))
			    
			   })
app.get('/yes', (req, res) => {var statusResultCode;
			       var checkoutId = req.query.id;
			       console.log('checkoutId: ' + checkoutId)
			       status(checkoutId, (responseData => {
				   statusResultCode = responseData['result']['code']

				   if (statusResultCode === '000.100.110')
				       res.send('Payment processed. See you there! <br>');
				   else
				       res.send('Something went wrong: ' + responseData['result']['description'] )
			       }))				   
			      });


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
