// Path: back-end/routers/index.js
const courseRouter = require('./courses')
const quoteRouter = require('./quotes')

function route(app) {
    app.use('/api/courses', courseRouter)
    app.use('/api/quotes', quoteRouter)
 
}

module.exports = route;
