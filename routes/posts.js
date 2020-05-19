const express = require('express');
const router = express.Router();
const multer = require('multer');
const {cloudinary, storage} = require('../cloudinary');
const upload = multer({storage});
const { asyncErrorHandler, isLoggedIn, isAuthor, searchAndFilterPosts } = require('../middleware');
const { getPosts, newPost, createPost, showPost, editPost, updatePost, deletePost } = require('../controllers/posts');

/* GET posts page. */
router.get('/', asyncErrorHandler(searchAndFilterPosts), asyncErrorHandler(getPosts));

/* GET new posts page. */
router.get('/new', isLoggedIn ,newPost);

/* POST Create posts page. */
router.post('/', upload.array('images', 4) ,createPost);

/* GET posts id page. */
router.get('/:id', showPost);

/* GET edit page. */
router.get('/:id/edit', isLoggedIn ,isAuthor ,editPost);

/* PUT Update page. */
router.put('/:id', isLoggedIn ,isAuthor ,upload.array('images', 4), updatePost);

/* DELETE destroy page. */
router.delete('/:id', isLoggedIn ,isAuthor ,deletePost);

module.exports = router;