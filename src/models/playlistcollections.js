const mongoose = require('mongoose');

const PlaylistCollectionsSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            sparse: true,
        },
        playlists: {
            type: [
                {
                  id: String,
                  playlistType: String,
                }
            ]
        }
    }
);

module.exports = mongoose.model('PlaylistCollection', PlaylistCollectionsSchema);
