const express = require('express');
const mongoose = require('mongoose');
const models = require('./models');
const routing = express.Router();
const cloudURL = 'MONGODB_URL_HERE';
mongoose.connect(cloudURL, { useNewUrlParser: true, useUnifiedTopology: true });

// Route to check API health
routing.get('/health', (req, res, next) => {
    res.status(200).json({ 'Status': 'Up and running' });
})

// Route to get all artists
routing.get('/', async (request, response, next) => {
    try {
        await models.vendorModel.find({})
            .then(
                (result) => {
                    response.send(result);
                }
            );
        next();
    }
    catch (err) {
        response.status(500).send('Oops! Someone might have unplugged a cable at our servers');
    }
});

// Route to get artist suggestions
routing.get('/suggest/:query', async (request, response, next) => {
    let suggestions = [];
    try {
        const queryName = request.params.query;
        const vendors = await models.vendorModel.find({ vendor_name: new RegExp(queryName, 'i') });
        vendors.forEach(
            async function (vendor) {
                let { 'vendor_id': vendorId, 'vendor_name': name, 'vendor_page_url': pageUrl, 'artist_type': artistCat, 'vendor_city': cityCode } = vendor.toObject();
                await models.artistMasterModel.findOne({ id: artistCat }).then(
                    async function (artistData) {
                        await models.cityModel.findOne({ city_id: cityCode }).then(
                            (cityData) => {
                                let { 'city_name': cityName } = cityData.toObject();
                                let { 'artist_type': artistType } = artistData.toObject();
                                let suggestion = { vendorId: vendorId, name: name, pageUrl: pageUrl, cityName: cityName, artistType: artistType }
                                suggestions.push(suggestion);
                            }
                        )
                    }
                )
            }
        )
        setTimeout(() => {
            response.json(suggestions);
        }, 200)
    }
    catch (err) {
        response.status(500).send('Oops! Someone might have unplugged a cable at our servers' + err);
    }
});



// Route to get artist data
routing.get('/:id', async (request, response, next) => {
    try {
        const vendorId = request.params.id;
        const vendor = await models.vendorModel.findOne({ vendor_id: vendorId });
        const postCount = await models.postMasterModel.find({ post_user_id: vendorId, post_status: "1" }).count();
        const followers = await models.postActionModel.find({ actor_id: vendorId, post_action_type: "Follow" }).count();
        const following = await models.postActionModel.find({ post_user_id: vendorId, post_action_type: "Follow" }).count();
        const reviews = await models.vendorReviewsModel.find({ vendor_id: vendorId, is_approved: "1" });
        const media = await models.vendorMediaModel.find({ vendor_id: vendorId, media_status: "1" });
        let { 'artist_type': artistCat, 'vendor_name': name, 'vendor_city': cityCode, 'vendor_about': about, 'vendor_avatar': avatar } = vendor.toObject();
        const cityData = await models.cityModel.findOne({ city_id: cityCode });
        const artistData = await models.artistMasterModel.findOne({ id: artistCat });
        let { 'city_name': city, 'country_code': country } = cityData.toObject();
        let { 'artist_type': artistType } = artistData.toObject();
        response.status(200).send({ name, avatar, artistType, about, city, country, postCount, followers, following, reviews, media });
        next();
    }
    catch (err) {
        console.log(err)
        response.status(500).send('Oops! Someone might have unplugged a cable at our servers');
    }
});

module.exports = routing;