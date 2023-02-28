const mongoose = require('mongoose');

const vacationInSeasonlistenerSchema = mongoose.Schema({
  email: String,
  skus: [String]
});

const VacationInSeasonListener = mongoose.model('VacationInSeasonListener', vacationInSeasonlistenerSchema);
module.exports = VacationInSeasonListener;
