const mongoose = require('mongoose')

async function connectToMongoDB(url) {
    return mongoose.connect(url).then(
        () => console.log('Connected to MongoDB'),
        err => console.error('Error connecting to MongoDB:', err)
        
    )
}

module.exports ={
    connectToMongoDB,
}