const API = require('./api');

class ReduxAPI extends API {
	constructor(endpoint, store) {
		super(endpoint);

		if(!store) {
			throw new Error('[QUO] ReduxAPI needs a store');
		}
		this.store = store;
	}

	fetch(params) {
		if(!params.action) {
			throw new Error('[QUO] Fetching with redux enabled needs an action<String> parameter that corresponds to its type');
		}

		let currentState = this.store.getState();

		if(params.cache && currentState[params.action]) {
			return currentState[params.action];
		}

		let reduxCache = !!params.cache;
		params.cache = false;

		super.fetch(params).then(response => {
			// get treated response 
			if(reduxCache) {
				this.store.dispatch({
					type: params.action,
					data: response
				});
			}

			return response;

		}).catch(error => {
			throw error;
		});
	}
}

module.exports = ReduxAPI;
