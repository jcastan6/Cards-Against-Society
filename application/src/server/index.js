const express = require('express');
const os = require('os');
const path = require('path');
const sequelize = require('sequelize');
const cors = require('cors');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users-router');

const app = express();

var io = require("socket.io")();
io.listen(8080);
app.set("socketio", io);

io.of("/lobby").on("connection", socket => {
  socket.on("subscribeToChat", msg => {
    io.of("/lobby").emit("message", msg);
  });
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

app.set('view engine', 'ejs');
app.listen(4000, () => console.log('Listening on port 4000!'));

app.get('/', indexRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
