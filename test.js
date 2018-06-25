const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('./server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list blog posts on GET', function() {
        return chai
            .request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(0);
                const expectedKeys = ['title', 'content', 'author'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add blog posts on POST', function() {
        const newPost = {title: 'A new post', author: 'Bill', content: 'This is for testing'};
        return chai
            .request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).include.keys('title', 'content', 'author');
                expect(res.body.id).to.not.equal(null);
                expect(res.body.publishDate).to.not.equal(null);
                expect(res.body).to.deep.equal(
                    Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate})
                );
            });
    });

    it('should update blog posts on PUT', function() {
        const updatePost = {
            title: 'testing post',
            author: 'tester',
            content: 'this is for testing purposes'
        };

        return (
            chai
                .request(app)
                .get('/blog-posts')
                .then(function(res) {
                    updatePost.id = res.body[0].id;
                    return chai
                        .request(app)
                        .put(`/blog-posts/${updatePost.id}`)
                        .send(updatePost);
                })

                .then(function(res) {
                    expect(res).to.have.status(204);
                })
        );
    });

    it('should delete blog posts on DELETE', function() {
        return (
            chai
                .request(app)
                .get('/blog-posts')
                .then(function(res) {
                    return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                })
        );
    });
});