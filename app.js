const express = require('express');
const bodyParser = require('body-parser');
const itemsRouter = require('./routes/items');

const app = express();
app.use(bodyParser.json());

app.use('/items', itemsRouter);

// Listen with retry on port conflict (EADDRINUSE)
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const MAX_RETRIES = 10;

function listenWithRetry(startPort = DEFAULT_PORT, retriesLeft = MAX_RETRIES) {
	const server = app
		.listen(startPort, () => console.log(`Server listening on port ${startPort}`))
		.on('error', (err) => {
			if (err && err.code === 'EADDRINUSE') {
				console.error(`Port ${startPort} is in use.`);
				if (retriesLeft > 0) {
					console.log(`Trying port ${startPort + 1} (${retriesLeft - 1} retries left)...`);
					setTimeout(() => listenWithRetry(startPort + 1, retriesLeft - 1), 500);
				} else {
					console.error('All retries exhausted. Exiting.');
					process.exit(1);
				}
			} else {
				console.error('Server error:', err);
				process.exit(1);
			}
		});

	return server;
}

listenWithRetry();
