if(process.env.NODE_ENV == 'local') { 
	module.exports = { 
		BASE_API: 'http://localhost:3015',
		instagram: { 
			ACCESS_TOKEN_API: 'https://api.instagram.com/oauth/access_token',
			client_id: '44ad44c78b284d6fb56d4698d281b4b5',
			client_secret: 'f2bc49ded9d441049b0e7a5ce76f92fc',
			grant_type: 'authorization_code',
			redirect_uri: 'http://localhost:8080/login'
		}, 
		key: 1617
	};
}

else if(process.env.NODE_ENV == 'prod') { 
	module.exports = { 
		BASE_API: 'http://ec2-52-5-116-41.compute-1.amazonaws.com',
		instagram: { 
			ACCESS_TOKEN_API: 'https://api.instagram.com/oauth/access_token',
			client_id: '269b540d4fbf45958074742f4b8061e9',
			client_secret: '73d78ceefdf341ebad436e53f62fb86f',
			grant_type: 'authorization_code',
			redirect_uri: 'http://ec2-52-5-95-215.compute-1.amazonaws.com/login'
		}, 
		key: 1617
	};
}