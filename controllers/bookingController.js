const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");

const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,

    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name}`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100, // The price of the item in cents
        },
        quantity: 1, // The quantity of the item being purchased
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

exports.createBookingCheckout=catchAsync( async(req,res,next)=>{
  // this is only temporary , beacouse it is UNSECURE : everyone can make booking without paying
  const {tour,price,user}=req.query;


  if(!tour && !user && !price) return next();
  await  Booking.create({tour,user,price})
  res.redirect(req.originalUrl.split('?')[0])
})
exports.createBooking=factory.createOne(Booking);
exports.getBooking=factory.getOne(Booking);
exports.getAllBooking=factory.getAll(Booking);
exports.updateBooking=factory.UdateOne(Booking);
exports.deleteBooking=factory.deletOne(Booking);
