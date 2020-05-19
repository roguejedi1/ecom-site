const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {
    async createReview(req, res, next) {
    // find post by id
    let post = await Post.findById(req.params.id).populate('reviews').exec();
    let haveReviewed = post.reviews.filter(review => {
        return review.author.equals(req.user._id);
    }).length;
    if(haveReviewed){
        req.session.error = 'Already reviewed this';
        return res.redirect(`/posts/${post.id}`);
    }
    // create review
    req.body.review.author = req.user._id;
    let review = await Review.create(req.body.review);
    // assign review to post
    post.reviews.push(review);
    // save post
    post.save();
    // redirect to post
    req.session.success = 'Review added successfully!';
    res.redirect(`/posts/${post.id}`);
    },
    async updateReview(req, res, next) {
     await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
     req.session.success = 'Review updated successfully';
     res.redirect(`/posts/${req.params.id}`);
    },
    async deleteReview(req, res, next) {
       await Post.findByIdAndUpdate(req.params.id, {
           $pull: {
               reviews: req.params.review_id
           }
       });
       await Review.findByIdAndRemove(req.params.review_id);
       req.session.success = 'Review Deleted';
       res.redirect(`/posts/${req.params.id}`);
    }
}
