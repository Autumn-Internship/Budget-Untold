const express = require("express");

const PlaylistCollection = require("../models/playlistcollections");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const playlistCollection = req.body;
    const playlistCollectionCreated = await PlaylistCollection.create(
      playlistCollection
    );
    res.status(201).json({ success: true, value: playlistCollectionCreated });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.patch("/updateCollection/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlistId = req.query.playlistId;
    const playlistType = req.query.playlistType;
    const playlistCollectionUpdated = await PlaylistCollection.updateOne(
      { userId: userId },
      { $push: { playlists: { id: playlistId, playlistType: playlistType } } }
    );
    res.status(204).json({ success: true, value: playlistCollectionUpdated });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.get("/", async (req, res) => {
  try {
    const playlistCollections = await PlaylistCollection.find();
    res.status(200).json({ value: playlistCollections });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.delete("/deleteCollection/:playlistCollectionId", async (req, res) => {
  try {
    const playlistCollectionId = req.params.playlistCollectionId;
    await PlaylistCollection.deleteOne({ userId: playlistCollectionId });
    res.status(204).json({ value: playlistCollectionId });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlistCollections = await PlaylistCollection.findOne({
      userId: userId,
    });
    res.status(200).json({ value: playlistCollections.playlists });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.patch("/updateCollectionSlice/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlistId = req.query.playlistId;
    const playlistType = req.query.playlistType;
    const playlistCollectionUpdated = await PlaylistCollection.updateOne(
      { userId: userId },
      { $slice: { playlists: { id: playlistId, playlistType: playlistType } } }
    );
    res.status(204).json({ success: true, value: playlistCollectionUpdated });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});
module.exports = router;
