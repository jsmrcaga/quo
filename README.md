# quo.js

A simple JSON fetcher API for modern apps

> #### ⚠️ This library will sadly assume JSON formats for your API

## tl;dr

### Normal Usage
```js
const quo = require('quo').APIClient;

let myApiClient = new quo('https://my.api.location');

myApiClient.get('/users').then(response => {
	// do something
});

myApiClient.get('/users', {cache: true}).then(response => {
	// gets data from API
});

myApiClient.get('/users', {cache: true}).then(response => {
	// gets data from cache (2nd call)
});

myApiClient.post('/users', {
	data: {
		user: myUser
	}
}).then(response => {
	// posts data to API

});

myApiClient.get('/me', {
	model: UserModel
}).then(user => {
	user.callMethodBecauseIWasIntanciated();
});

myApiClient.get('/users', {
	model: UserModel
}).then(users => {
	// it also works on arrays!
});

myApiClient.get('/some/weird/stuff', {
	transform: (response) => User.weirdStuffFromApi(response)
}).then(data => {
	// whatever transform responded!
});
```

### React/Redux usage

```js
const quo = require('quo').ReduxAPIClient;

// same as before but:
let myApiClient = new quo('https://my.api.location', myReduxStore);

// dispatches a {type: 'storeProducts', data: <isntanciated products> } action
myApiClient.get('/products', {
	action: 'storeProducts',
	cache: true,
	model: Product
}).then(products => {
	// do something with my products
})
```

## Motivation
The way we (we beign I) see it, State and Data are two completely different things, that can influence one another. I've prepared a helpful chart for you to understand this: 

<img>

Many Redux libraries allow for API calls in actions, storing the responses in a Redux store. Sadly this gives access to many other components to those responses, it's just a `connect()()` away.

Cache should be handled by a cache manager, and state by a state manager. Redux is a wonderful library and should be used to manage Global State. Many times you won't even need Redux in your small-to-medium sized app.

Using Quo will allow you to write simple concise API calls, without wondering about network overload or caching:

```js
class MyUserList extends React.Component {
	constructor() {
		this.client = new quo('https://my.super.api/users');

		this.state = {
			users: null
		};
	}

	componentDidMount() {
		// no checking for props
		// no waiting in componentDidUpdate
		// the fetcher gets the data and returns it in a promise
		// e.v.e.r.y.t.i.m.e

		this.client.get('/users', {
			model: User,
			cache: true,
			action: 'getUserList' // you should have a reducer
		}).then(users => {
			this.setState({ users });
		});
	}

	render() {
		if(!this.state.users) {
			return <Loader/>;
		}

		return this.state.users.map(user => user.render());
	}
}

// connect if you need
// just remember to not connect if using the action from a fetcher
// since it will trigger a useless update/render
export default connect(mapState, mapDispatch)(MyUserList);
```
