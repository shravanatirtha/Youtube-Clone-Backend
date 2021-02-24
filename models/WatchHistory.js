const mongoose = require('mongoose');
const Schema = mongoose.Schema

const watchHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId },
    videoId: String
})

const WatchHistory = mongoose.model('WatchHistory', watchHistorySchema);

module.exports = WatchHistory;