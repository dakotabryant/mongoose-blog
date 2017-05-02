// mongo ds129281.mlab.com:29281/blog-api -u dev -p donald
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

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
			res.json(posts);
		});
});
app.get('/posts/:id', (req, res) => {
	Post
		.findById(req.params.id)
		.exec()
		.then(post => {
			res.json(post);
		})
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

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {
	app,
	runServer,
	closeServer
};

// var myPost2 = {
//   title: 'Global Warming',
//   content: 'Ice Melting',
//   author: 'Al Gore',
//   created: new Date()
// };
