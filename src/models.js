const mongoose = require('mongoose');

const postActionModel = mongoose.model('PostAction', {}, 'post_action');
const vendorModel = mongoose.model('Vendor', {}, 'vendor');
const postMasterModel = mongoose.model('PostMaster', {}, 'post_master');
const artistMasterModel = mongoose.model('ArtistMaster', {}, 'artist_master');
const cityModel = mongoose.model('City', {}, 'city');
const vendorMediaModel = mongoose.model('VendorMedia', {}, 'vendor_media');
const vendorReviewsModel = mongoose.model('VendorReviews', {}, 'vendor_reviews');

module.exports = { vendorModel, postActionModel, postMasterModel, artistMasterModel, cityModel, vendorMediaModel, vendorReviewsModel }