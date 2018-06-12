
const express = require('express');
const morgan = require('morgan');

const app = express();

const getAndPostBlogRouter = require('./blog-posts');
const deleteAndUpdateBlogRouter = require('./blog-posts');

app.use('/blog-posts', getAndPostBlogRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
