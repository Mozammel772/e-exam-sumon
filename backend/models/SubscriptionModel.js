// const mongoose = require("mongoose");

// const SubscriptionSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phoneNumber: { type: String, required: true },
//     packages: [{ type: String, required: true }],
//     price: { type: String, required: true },
//     isPremium: { type: Boolean, default: false },
//     paymentMethod: { type: String, required: true },
//     transactionId: { type: String, required: true },
//     isApproved: { type: Boolean, required: false },
//     subscriptionValidity: {
//       type: Date,
//       default: () => {
//         const now = new Date();
//         now.setFullYear(now.getFullYear() + 1);
//         return now;
//       },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Subscription", SubscriptionSchema);




// const mongoose = require("mongoose");

// const SubscriptionSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phoneNumber: { type: String, required: true },

//     // active packages list
//     packages: [{ type: String, required: true }],

//     // total spent money
//     totalPrice: { type: Number, default: 0 },

//     // premium checking
//     isPremium: { type: Boolean, default: false },

//     // multi-purchase history
//     purchases: [
//       {
//         packages: [{ type: String }],
//         price: Number,
//         paymentMethod: String,
//         transactionId: String,
//         isApproved: Boolean,
//         date: { type: Date, default: Date.now }
//       }
//     ],

//     subscriptionValidity: {
//       type: Date,
//       default: () => {
//         const now = new Date();
//         now.setFullYear(now.getFullYear() + 1);
//         return now;
//       }
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Subscription", SubscriptionSchema);
const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    // active packages list
    packages: [{ type: String, required: true }],

    // total spent money from approved purchases
    totalPrice: { type: Number, default: 0 },

    // premium checking
    isPremium: { type: Boolean, default: false },

    // multi-purchase history
    purchases: [
      {
        packages: [{ type: String }],
        price: { type: Number, required: true },
        paymentMethod: { type: String, required: true },
        transactionId: { type: String, required: true },
        phoneNumber: { type: String },
        isApproved: { type: Boolean, default: false },
        date: { type: Date, default: Date.now },
        expiredAt: { type: Date, default: null }, // per-purchase expiration
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
