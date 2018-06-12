const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const {BlogPosts} = require('./blogPostModel');

BlogPosts.create('Test Blog', 'This is a test blog post', 'Steve');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i<requiredFields.length; i++){
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        };
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(item);
});

module.exports=router;

// reate: function(title, content, author, publishDate)

// const item = Recipes.create(req.body.name, req.body.ingredients);
// res.status(201).json(item);

