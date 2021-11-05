const express = require('express');

const PlaylistCollection = require('../models/playlistcollections');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const playlistCollection = req.body;
        const playlistCollectionCreated = await PlaylistCollection.create(playlistCollection);
        res.status(201).json({ success:true, value: playlistCollectionCreated});
    } catch {
        console.log('Failed to post');
    }
});

router.patch('/updateCollection/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const playlistId = req.query.playlistId;
        const playlistType = req.query.playlistType;
        const playlistCollectionUpdated = await PlaylistCollection.updateOne({userId: userId}, { $push: {'playlists': {id: playlistId, playlistType: playlistType}}});
        res.status(204).json({ success: true, value: playlistCollectionUpdated});
    } catch {
        console.log('Failed to patch');
    }
});

router.get('/', async (req, res) => {
    try {
        const playlistCollections = await PlaylistCollection.find();
        res.status(200).json({ value: playlistCollections });
    } catch(err) {
        console.log(err);
    }
});

router.delete('/deleteCollection/:playlistCollectionId', async (req, res) => {
    try {
        const playlistCollectionId = req.params.playlistCollectionId;
        await PlaylistCollection.deleteOne({userId: playlistCollectionId});
        res.status(204).json({ value: playlistCollectionId });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;