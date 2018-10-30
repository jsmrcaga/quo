const utils = require('../utils/utils');

class API {
	constructor(endpoint) {
		this.cache = {};
		this.endpoint = endpoint;
	}

	fetch({ method = 'GET', path, query = {}, data = {}, headers = {}, cache = false, model = null, transform = null, extra}) {
		headers['Content-Type'] = 'application/json; charset=utf-8';

		let cacheKey = utils.cacheKey(Array.from(arguments)[0]);
		
		if(cache && this.cache[cacheKey]) {
			return Promise.resolve(this.cache[cacheKey]);
		}

		let _query = query ? `?${utils.querystring(query)}` : '';

		fetch(`${this.endpoint}${path}${_query}`, {
			method,
			headers,
			body: JSON.stringify(data),
			...extra

		}).then(res => res.json()).then(response => {
			if(model && !transform) {
				if(response instanceof Array) {
					response = response.map(object => new model(object));
				} else if (response instanceof Object) {
					response = new model(response);
				}
			}

			if(transform) {
				response = transform(response);
			}

			if(cache) {
				this.cache[cacheKey] = response;
			}

			return response;

		}).catch(error => {
			throw error;
		});
	}

	request(method, path, request) {
		request.method = method;
		request.path = path;
		return this.fetch(request);
	}

	// XXX: transform into PROXY
	get(path, request) {
		return this.request('GET', path, request);
	}

	post(path, request) {
		return this.request('POST', path, request);
	}

	put(path, request) {
		return this.request('PUT', path, request);
	}

	patch(path, request) {
		return this.request('PATCH', path, request);
	}

	delete(path, request) {
		return this.request('DELETE', path, request);
	}
}

module.exports = API;
