var express = require('express');
var router = express.Router({ mergeParams: true});
const { asyncErrorHandler, isReviewAuthor } = require('../middleware');
const {createReview, updateReview, deleteReview} = require('../controllers/reviews');

/* POST Create reviewss page. */
router.post('/', createReview);

/* PUT Update page. */
router.put('/:review_id', isReviewAuthor ,updateReview);


/* DELETE destroy page. */
router.delete('/:review_id', isReviewAuthor ,deleteReview);

module.exports = router;
