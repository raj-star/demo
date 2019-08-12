const UserBooking = require('../../models/users/UserBooking');
const UserBookingDetails = require('../../models/users/UserBookingDetails');
const VendorProfile = require("../../models/vendors/VendorProfile");
var _ = require('lodash');

module.exports = (app) =>{
    app.post('/api/serviceManagement/store/service',(req,res,next)=>{
        const {body} = req;
        let {cartData,cartDate,cartTime,cartTotalPrice,user_id} = body;
        let order_no = Date.now()+_.random(123456);
        console.log(`order no ${order_no}`);
        const uBook = new UserBooking();
        uBook.user_id = user_id;
        uBook.order_no = order_no;
        uBook.booking_date = cartDate;
        uBook.booking_time = cartTime;
        uBook.booking_total_amount = cartTotalPrice;
        uBook.save((err,uBook)=>{
            if(err){
                return res.status(500).send({
                    status:false,
                    message:"Error : Server Error save parent ",
                    err:err
                });
            }
    
            let groupByCartData = _.groupBy(cartData,'vendor_id')
           
            _.forEach(groupByCartData,(value,key)=>{
                let vendor_id = key;
                let booking_status = false;
                let booking_amount;
                let service = [];
                let arrPrice = []
                _.forEach(value,(subValue)=>{
                    let data = {
                        service_id : subValue._id,
                        service_name:subValue.service_name,
                        service_amount : subValue.discount_price,
                        service_discount : subValue.discount,
                        stylist_id : _.get(subValue.stylist,'_id'),
                        stylist_name : _.get(subValue.stylist,'name'),
                    }
                    service.push(data);
                    arrPrice.push(parseInt(subValue.discount_price));
                });
                booking_amount = _.sum(arrPrice);
                console.log("=========================================");
                const uBooingDetails = new UserBookingDetails();
                uBooingDetails.order_no = order_no;
                uBooingDetails.vendor_id = vendor_id;
                uBooingDetails.service = service;
                uBooingDetails.booking_date = cartDate;
                uBooingDetails.booking_time = cartTime;
                uBooingDetails.booking_amount = booking_amount;
                uBooingDetails.booking_status = booking_status;

                uBooingDetails.save((err,result)=>{
                    if(err){
                        res.status(500).send({
                            status : false,
                            message : "Error : Server error"
                        });
                    }
                   // return res.send({status:getProcessResult,message:'booked'});
                })
            });
            return res.send({status:true,message:'booked'});
        });      
    });


    //get bookings========================
    app.get('/api/serviceManagement/booking/getByUserId/:id',(req,res,next)=>{
        UserBooking.find({user_id:req.params.id},(err,result)=>{
            if(err){
                res.send({
                    status:false,
                    message:"Error : Server Error"
                });
                return;
            }
            res.send({
                status:true,
                result:result
            });
            return;
        });
    });
    //End get bookings========================

    //get booking Details by order-no
    app.get('/api/serviceManagement/bookingDetails/getByOrderNo/:id',(req,res,next)=>{
        UserBookingDetails.find({order_no:req.params.id},(err,result) => {
            global.arrGetVendorDetails = [...result];
            if(err){
                res.send({
                    status:false,
                    message:"Error : Server Error"
                });
                return;
            }
            res.send({
                status:true,
                result:arrGetVendorDetails
            });
            return;
        });
    })
    //end get by orderNo

} 