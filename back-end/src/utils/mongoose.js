// Path: back-end/utils/mongoose.js
module.exports = {
    multipaleMongooseToObject: function (mongooseArrays){
        return mongooseArrays.map(mongoose => mongoose.toObject())
    },
    mongooseToObject: function(mongoose){
        return mongoose ? mongoose.toObject() : mongoose;
    }
}