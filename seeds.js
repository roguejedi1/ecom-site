const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
    await Post.deleteMany({});
    for(const i of new Array(600)) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random5 = Math.floor(Math.random() * 6);
        const title = faker.lorem.word();
        const description = faker.lorem.text();
        const postData = {
            title,
            description,
            price: random1000,
            avgRating: random5,
            author: ""
        }
        await Post.create(postData);
    }
    console.log('600 posts created');
}

module.exports = seedPosts;