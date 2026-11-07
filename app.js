const express = require('express');

const postRouter = require('./routers/postRouter');
const userRouter = require('./routers/userRouter');
const sessionRouter = require('./routers/sessionRouter');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use('/posts', postRouter);
app.use('/users', userRouter);
app.use('/auth', sessionRouter);

app.listen(port, () => {
	console.log(`listening on port:`, port);
});
