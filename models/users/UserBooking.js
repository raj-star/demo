const mongooes = require('mongoose');

const UserBookingSchema = new mongooes.Schema({
    user_id:{type:String,required:true},
    order_no:{ type:String,required:true},
    booking_date:{type:String,required:true},
    booking_time:{type:String,required:true},
    booking_total_amount:{type:Number,required:true},
    created_at:{type:Date,default:Date.now}

},{collection:'user_bookings'});

module.exports = mongooes.model('UserBooking',UserBookingSchema);