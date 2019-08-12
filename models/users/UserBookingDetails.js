const mongooes = require('mongoose');

const UserBookingDetailsSchema = new mongooes.Schema({
    order_no:{type:String,required:true},
    booking_status:{type:Boolean,required:true},
    vendor_id:{type:String,required:true},
    service: [{service_id:String,service_name:String,service_amount:Number,service_discount:Number,stylist_id:String,stylist_name:String}],
    booking_date:{type:String,required:true},
    booking_time:{type:String,required:true},
    booking_amount:{type:Number,required:true},
    created_at:{type:Date,default:Date.now}
},{collection:'user_booking_details'});

module.exports = mongooes.model('UserBookingDetails',UserBookingDetailsSchema);