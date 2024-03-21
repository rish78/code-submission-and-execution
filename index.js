const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

const submissionsRouter = require('./routes/submissions');
app.use('/api/submissions', submissionsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});