const Post = require('../models/post');
const mapboxgl = require('mapbox/dist/mapbox-sdk.js');
const mapboxgeo = require('mapbox/lib/services/geocoding');
mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
var geocodingClient = mapboxgl.accessToken;
const {cloudinary} = require('../cloudinary');

module.exports = {
    async getPosts(req, res, next) {
        const { dbQuery } = res.locals;
        delete res.locals.dbQuery;
        let posts = await Post.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 10,
            sort: '-_id'
        });
        posts.page = Number(posts.page);
        if (!posts.docs.length && res.locals.query) {
            res.locals.error = 'No results match that query.';
        }
        res.render('posts/index', { posts, title: 'Posts Index' });
    },
    newPost(req, res, next){
        res.render('posts/new');
    },
    async createPost(req, res, next) {
        req.body.post.images = [];
        for (const file of req.files) {
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        let dispatch = req.body.ship;
        req.body.post.author = req.user._id;
        let post = await Post.create(req.body.post);
        req.session.success = 'Post Created Successfully!';
        res.redirect(`/posts/${post.id}`);
    },
    async showPost(req, res, next) {
       let post = await Post.findById(req.params.id).populate({
           path: 'reviews',
           options: { sort: { '_id': -1 } },
           populate: {
               path: 'author',
               model: 'User'
           }
       });
    //    const floorRating = post.calculateAvgRating();
    const floorRating = post.avgRating;
       res.render('posts/show', { post, floorRating });
    },
    editPost(req, res, next) {
        res.render('posts/edit');
    },
    async updatePost(req, res, next){
        // destrcuture post
        const { post } = res.locals;
        // check if there is any images for deletion
        if (req.body.deleteImages && req.body.deleteImages.length){
            // assign deleteImages from req.body to a variable
            let deleteImages = req.body.deleteImages;
            // loop over deleteImages
            for(const public_id of deleteImages) { //for images of cloudinary
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id); //.destroy is a method from cloudinary
                //delete image from post.images 
                for(const image of post.images) {
                    if(image.public_id === public_id){
                        let index = post.images.indexOf(image);
                        post.images.splice(index, 1);
                    }
                }
            }
            // check if there is any new images for upload
            if(req.files){
                // upload new images
                for (const file of req.files) {
                    // add images to post images array
                    post.images.push({
                        url: file.secure_url,
                        public_id: file.public_id
                    });
                }
            } 
        }
        // update post with any new properties
        post.title = req.body.post.title;
        post.price = req.body.post.price;
        post.description = req.body.post.description;
        post.location = req.body.post.location;
        post.ship = req.body.post.ship;
        // save updates to db
        await post.save();
        // redirect to show page
        res.redirect(`/posts/${post.id}`);
    },
    async deletePost(req, res, next){
        const { post } = res.locals;
        for(const image of post.images){
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted';
        res.redirect('/posts');
    }
}
