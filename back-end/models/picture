const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Picture', pictureSchema);
