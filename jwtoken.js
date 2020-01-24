const jwt = require('jsonwebtoken');

const createclienttoken = (data) => {
	
	console.log(data)
	try {

		var token = jwt.sign({_id: data}, 'dfbkuydgviubdlubgwudilak');

		return token;

	} catch (err) {

		return err;
	}

}

module.exports.createclienttoken = createclienttoken;