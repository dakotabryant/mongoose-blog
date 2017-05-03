// mongo ds129281.mlab.com:29281/blog-api -u dev -p donald
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

const {
	DATABASE_URL,
	PORT
} = require('./config');
const {
	Post
} = require('./models');


const app = express();
app.use(bodyParser.json());


app.get('/posts', (req, res) => {
	Post
		.find()
		.exec()
		.then(posts => {
			res.json(posts.map(post => post.apiRepr()));
		});
});
app.get('/posts/:id', (req, res) => {
	Post
		.findById(req.params.id)
		.exec()
		.then(post => {
			res.json(post.apiRepr());
		});
});
app.post('/posts', (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Post
		.create({
			title: req.body.title,
			content: req.body.content,
			author: req.body.author
		})
		.then(post => res.status(201).json(post.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({
				error: 'You broke it'
			});
		});
});

app.put('/posts/:id', (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`);
		console.error(message);
		res.status(400).json({
			message: message
		});
	}

	const updatedEntry = {};
	const editableFields = ['title', 'content', 'author'];
	editableFields.forEach(field => {
		if (field in req.body) {
			updatedEntry[field] = req.body[field];
		}
	});

	Post
		.findByIdAndUpdate(req.params.id, {
			$set: updatedEntry
		}, {
			new: true
		})
		.exec()
		.then(post => {
			console.log(post);
			res.status(201).json(post.apiRepr());
		});
});


app.delete('/posts/:id', (req, res) => {
	Post
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(() => {
			res.status(204).end();
		});
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
					console.log(`Your app is listening on port ${port}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {runServer().catch(err => console.error(err));}

module.exports = {
	app,
	runServer,
	closeServer
};
