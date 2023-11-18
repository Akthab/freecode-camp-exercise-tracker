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
// const userNewLogs = [];
const userNewLogs = new Array();
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
	const user = {
		username: req.body.username,
		_id: uuidv4(),
	};
	users.push(user);

	res.json({ username: user.username, _id: user._id });
});

app.get('/api/users', (req, res) => {
	res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
	let newUser;

	for (const userObject of users) {
		if (userObject._id === req.params._id) {
			newUser = userObject;
			break;
		}
	}

	if (newUser) {
		const userDetails = req.body;

		let createdDate = new Date();

		if (userDetails.date) {
			createdDate = new Date(userDetails.date);
		}

		const userLog = {
			description: userDetails.description,
			duration: parseInt(userDetails.duration),
			date: createdDate.toDateString(),
		};

		userNewLogs.push(userLog);

		// const user = {
		// 	username: newUser.username,
		// 	description: userDetails.description,
		// 	duration: userDetails.duration * 60,
		// 	date: createdDate.toDateString(),
		// 	_id: newUser._id,
		// };

		const user = {};

		console.log('Duration ', typeof userDetails.duration);
		(user.username = newUser.username),
			(user.description = userDetails.description),
			(user.duration = parseInt(userDetails.duration)),
			(user.date = createdDate.toDateString()),
			(user._id = newUser._id),
			res.send(user);
	} else {
		console.log('In the error');
		res.send(`User with ID ${req.params._id} not found`);
	}
});

// app.get('/api/users/:_id/logs', (req, res) => {
// 	let user;

// 	for (const userObject of users) {
// 		if (userObject._id === req.params._id) {
// 			user = userObject;
// 			break;
// 		}
// 	}

// 	console.log('TYPE OF ' + typeof userNewLogs);
// 	if (user) {
// 		// const user = {};
// 		// (user.username = newUser.username),
// 		// 	(user.count = userNewLogs.length),
// 		// 	(user._id = newUser._id),
// 		// 	(user.log = userNewLogs),
// 		// 	res.send(user);
// 		res.json({
// 			username: user.username,
// 			count: userNewLogs.length,
// 			_id: user._id,
// 			log: userNewLogs,
// 		});
// 	} else {
// 		res.send(`User with ID ${req.params._id} not found`);
// 	}
// });

app.get('/api/users/:_id/logs', (req, res) => {
	let user;

	for (const userObject of users) {
		if (userObject._id === req.params._id) {
			user = userObject;
			break;
		}
	}

	console.log('THIS IS THE QUERY  ' + req.query);

	if (user) {
		let logs = userNewLogs;

		// Filter logs based on from and to dates
		if (req.query.from && req.query.to) {
			const fromDate = new Date(req.query.from);
			const toDate = new Date(req.query.to);

			logs = logs.filter((log) => {
				const logDate = new Date(log.date);
				return logDate >= fromDate && logDate <= toDate;
			});
		}

		// Limit the number of logs
		if (req.query.limit) {
			const limit = parseInt(req.query.limit);
			logs = logs.slice(0, limit);
		}

		res.json({
			username: user.username,
			count: logs.length,
			_id: user._id,
			log: logs,
		});
	} else {
		res.send(`User with ID ${req.params._id} not found`);
	}
});

// app.get('/api/users/:_id/logs', (req, res) => {
// 	const userId = req.params._id;
// 	const fromDate = req.query.from ? new Date(req.query.from) : undefined;
// 	const toDate = req.query.to ? new Date(req.query.to) : undefined;
// 	const limit = parseInt(req.query.limit) || 10;

// 	let user;

// 	for (const userObject of users) {
// 		if (userObject._id === userId) {
// 			user = userObject;
// 			break;
// 		}
// 	}

// 	if (user) {
// 		let filteredLogs = userNewLogs;
// 		// let filteredLogs = user.logs;

// 		if (fromDate) {
// 			filteredLogs = filteredLogs.filter(
// 				(log) => new Date(log.date) >= fromDate
// 			);
// 		}

// 		if (toDate) {
// 			filteredLogs = filteredLogs.filter((log) => new Date(log.date) <= toDate);
// 		}

// 		filteredLogs = filteredLogs.slice(0, limit);

// 		res.json({
// 			username: user.username,
// 			count: logs.length,
// 			_id: user._id,
// 			logs: filteredLogs,
// 		});
// 	} else {
// 		res.status(404).send('User not found');
// 	}
// });

const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port);
});
