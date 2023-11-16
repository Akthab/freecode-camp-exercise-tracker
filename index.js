const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const users = [];
const userNewLogs = [];
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
	const user = {
		username: req.body.username,
		_id: uuidv4(),
	};
	users.push(user);

	res.json({ user });
});

app.get('/api/users', (req, res) => {
	res.json({ users });
});

app.post('/api/users/:_id/exercises', (req, res) => {
	let user;

	for (const userObject of users) {
		if (userObject._id === req.params._id) {
			user = userObject;
			break;
		}
	}

	if (user) {
		const userDetails = req.body;
		const createdDate = new Date(userDetails.date);

		const userLog = {
			description: userDetails.description,
			duration: userDetails.duration,
			date: createdDate.toDateString(),
		};

		userNewLogs.push(userLog);

		res.json({
			username: user.username,
			description: userDetails.description,
			duration: userDetails.duration,
			date: createdDate.toDateString(),
			_id: user._id,
		});
	} else {
		res.send(`User with ID ${req.params._id} not found`);
	}
});

app.get('/api/users/:_id/logs', (req, res) => {
	let user;

	for (const userObject of users) {
		if (userObject._id === req.params._id) {
			user = userObject;
			break;
		}
	}

	if (user) {
		user.count = userNewLogs.length;
		user.log = userNewLogs;
		res.json({ user });
	} else {
		res.send(`User with ID ${req.params._id} not found`);
	}
});

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
