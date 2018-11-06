if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://root:0987imgmp@ds151533.mlab.com:51533/vidjot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}