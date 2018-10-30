const utils = {};

utils.sortObject = (object) => {
	return Object.keys(object).sort().reduce((res, key) => {
		res[key] = object[key]; 
	}, {});
};

utils.cacheKey = ({ method, path, query, data, headers }) => {
	let _query = JSON.stringify(utils.sortObject(query));
	let _data = JSON.stringify(utils.sortObject(data));
	let _headers = JSON.stringify(utils.sortObject(headers));
	return `${method}${path}${_query}${_data}${_headers}`;
};

utils.percentEncode = (string) => {
	let char, charCode, i;
	let encodedString = '';

	for (i=0; i<string.length; i++) {
		char = string.charAt(i); 

		if ((char >= '0' && char <= '9') ||
			(char >= 'A' && char <= 'Z') ||
			(char >= 'a' && char <= 'z') ||
			(char == '-') || (char == '.') || 
			(char == '_') || (char == '~')) {
		
			encodedString += char;

		} else {
			charCode = string.charCodeAt(i);
			encodedString += '%' + charCode.toString(16).toUpperCase();
		}
	}

	return encodedString;
}

utils.querystring = (query) => {
	return Object.keys(query).reduce((ret, key) => {
		if(query[key] instanceof Array) {

		}
		
		ret += `&${utils.percentEncode(key)}=${utils.percentEncode(query[key])}`;
		return ret;
	}, '');
};

module.exports = utils;
