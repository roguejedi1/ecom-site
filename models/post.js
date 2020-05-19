const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,
    images: [ {url: String, public_id: String} ],
    location: String,
    coordinates: {
        type: [Number]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: { type:Number, default: 0 },
    ship: String
});

PostSchema.pre('remove', async function(){
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});

// Calculate average rating
PostSchema.methods.calculateAvgRating = function() {
    let ratingTotal = 0;
    if(this.reviews.length){
        this.reviews.forEach(review => {
            ratingTotal += review.rating;
        });
        this.avgRating = Math.round((ratingTotal / this.reviews.length) * 10) / 10;
    } else {
        this.avgRating = ratingTotal;
    }
    const floorRating = Math.floor(this.avgRating);
    this.save();
    return floorRating;
}

PostSchema.plugin(mongoosePaginate);

PostSchema.index({geometry: '2dsphere'});

module.exports = mongoose.model('Post', PostSchema);