const express = require("express");

const PlaylistCollection = require("../models/playlistcollections");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const playlistCollections = await PlaylistCollection.find();
    res.status(200).json({ value: playlistCollections });
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

router.get("/:playlistType", async (req, res) => {
  try {
    const playlistType = req.params.playlistType;
    const playlistCollections = await PlaylistCollection.findOne({
      playlistType: playlistType,
    });
    res.status(200).json({ value: playlistCollections.playlists });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

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
    res.status(200).json({ success: true, value: playlistCollectionUpdated });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.put("/upsert/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlistId = req.query.playlistId;
    const playlistType = req.query.playlistType;
    const playlistCollectionUpdated = await PlaylistCollection.findOneAndUpdate(
      {userId: userId},
      { $push: { playlists: { id: playlistId, playlistType: playlistType } } },
      { new: true,
        upsert: true }
    );
    res.status(200).json({ success: true, value: playlistCollectionUpdated });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});

router.delete("/deleteCollection/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    await PlaylistCollection.deleteOne({ userId: userId });
    res.status(200).json({ value: userId });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});


router.patch("/removePlaylist/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const playlistId = req.query.playlistId;
    const playlistCollectionUpdated = await PlaylistCollection.updateOne(
      { userId: userId },
      { $pull: { playlists: { id: playlistId } } },
    );
    res.status(200).json({ success: true, value: playlistCollectionUpdated });
  } catch (error) {
    console.log("ERROR IS:", error);
  }
});
module.exports = router;
