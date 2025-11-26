const express = require('express');
const bodyParser = require('body-parser');
const itemsRouter = require('./routes/items');

const app = express();
app.use(bodyParser.json());

app.use('/items', itemsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
