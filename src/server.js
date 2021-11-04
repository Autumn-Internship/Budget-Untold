const express = require('express');
const connectDB = require('./utils/connectDB');
const playlistsRouter = require('./routes/playlistcollections');
const path = require('path');

const app = express();
const PORT = 8080;

connectDB();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/playlists', playlistsRouter);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));