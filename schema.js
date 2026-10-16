const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        discription: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required(),
    }).required()
});

module.exports = {
    listingSchema,
    reviewSchema
};