const mongoose = require("mongoose");
const Subscription = require("../models/SubscriptionModel");
const User = require("../models/UserModel");
const Subject = require("../models/SubjectModel");


// Create Multi-Payment Subscription
// exports.createSubscription = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phoneNumber,
//       packages,
//       price,
//       paymentMethod,
//       transactionId,
//       isApproved
//     } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.isVerified) {
//       return res.status(403).json({ message: "User is not verified" });
//     }

//     const numericPrice = parseFloat(price);
//     const isPremium = numericPrice >= 1000;

//     let subscription = await Subscription.findOne({ email });

//     // Prepare purchase history object
//     const purchase = {
//       packages,
//       price: numericPrice,
//       paymentMethod,
//       transactionId,
//       phoneNumber,
//       isApproved,
//       date: new Date(),
//     };

//     if (subscription) {
//       // Append purchase history
//       subscription.purchases.push(purchase);

//       // Merge packages (unique)
//       subscription.packages = [
//         ...new Set([...subscription.packages, ...packages]),
//       ];

//       // Total price update
//       subscription.totalPrice = (subscription.totalPrice || 0) + numericPrice;

//       subscription.isPremium =
//         (subscription.totalPrice || numericPrice) >= 1000;

//       subscription.subscriptionValidity = new Date(
//         new Date().setFullYear(new Date().getFullYear() + 1)
//       );

//       await subscription.save();
//     } else {
//       subscription = await Subscription.create({
//         name,
//         email,
//         phoneNumber,
//         packages,
//         totalPrice: numericPrice,
//         isPremium,
//         purchases: [purchase],
//         subscriptionValidity: new Date(
//           new Date().setFullYear(new Date().getFullYear() + 1)
//         ),
//       });
//     }

//     user.subscription = true;
//     await user.save();

//     return res.status(200).json({
//       message: subscription ? "Purchase added successfully" : "Subscription created",
//       data: subscription
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error creating subscription", error: err.message });
//   }
// };


exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });

    const formatted = subscriptions.map((sub) => {
      const lastPayment =
        sub.purchases?.[sub.purchases.length - 1] || {};

      return {
        ...sub.toObject(),
        price: lastPayment.price || 0,
        paymentMethod: lastPayment.paymentMethod || "N/A",
        transactionId: lastPayment.transactionId || "N/A",
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch subscriptions",
      error: err.message,
    });
  }
};

// Get Subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching subscription", error: err.message });
  }
};



// Admin approve subscription (UI switch)
exports.updateSubscription = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const { id } = req.params;

    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // 1️⃣ subscription level approve
    subscription.isApproved = isApproved;

    // 2️⃣ update all purchases
    subscription.purchases.forEach((purchase) => {
      purchase.isApproved = isApproved;
    });

    // 3️⃣ calculate total approved price
    let totalApprovedPrice = 0;

    if (isApproved) {
      totalApprovedPrice = subscription.purchases.reduce(
        (sum, p) => sum + p.price,
        0
      );
    }

    subscription.totalPrice = totalApprovedPrice;
    subscription.isPremium = totalApprovedPrice >= 1000;

    // 4️⃣ validity
    subscription.subscriptionValidity = isApproved
      ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      : null;

    await subscription.save();

    // 5️⃣ user subscription flag
    await User.updateOne(
      { email: subscription.email },
      { subscription: isApproved }
    );

    res.status(200).json({
      message: isApproved
        ? "Subscription approved successfully"
        : "Subscription rejected successfully",
      data: subscription,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating subscription",
      error: err.message,
    });
  }
};




exports.deleteSubscription = async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await User.updateOne(
      { email: deleted.email },
      { subscription: false }
    );

    res.status(200).json({ message: "Subscription deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting subscription",
      error: err.message,
    });
  }
};



// Get user subscription and user info by email
// exports.getUserSubscriptionAndInfo = async (req, res) => {
//   try {
//     const { email } = req.params;

//     // 1. Fetch user by email (case-insensitive), exclude password
//     const user = await User.findOne({
//       email: new RegExp(`^${email}$`, "i"),
//     }).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 2. Fetch all subscriptions for the user
//     const subscriptions = await Subscription.find({ email }).sort({
//       createdAt: -1,
//     });

//     // 3. Extract all package IDs from all subscriptions
//     const allPackageIds = subscriptions.flatMap((sub) =>
//       sub.packages.map((pkgId) => new mongoose.Types.ObjectId(pkgId))
//     );

//     // 4. Fetch all matching subject details
//     const subjects = await Subject.find({
//       _id: { $in: allPackageIds },
//     }).populate("subjectClassName");

//     // 5. Return everything
//     res.status(200).json({
//       user,
//       subscriptions,
//       packages: subjects,
//       totalSubscriptions: subscriptions.length,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error fetching user subscription info",
//       error: err.message,
//     });
//   }
// };
// Approve a single payment
// exports.approveSinglePayment = async (req, res) => {
//   try {
//     const { subscriptionId, paymentId } = req.params;

//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription)
//       return res.status(404).json({ message: "Subscription not found" });

//     // Find the purchase
//     const purchase = subscription.purchases.id(paymentId);
//     if (!purchase)
//       return res.status(404).json({ message: "Payment not found" });

//     // ✅ Approve the payment
//     purchase.isApproved = true;

//     // Recalculate total approved price
//     const totalApprovedPrice = subscription.purchases
//       .filter((p) => p.isApproved)
//       .reduce((sum, p) => sum + p.price, 0);

//     subscription.totalPrice = totalApprovedPrice;
//     subscription.isPremium = totalApprovedPrice >= 1000;

//     // Update subscription validity if at least one approved payment
//     subscription.subscriptionValidity =
//       totalApprovedPrice > 0
//         ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
//         : null;

//     await subscription.save();

//     // Update user's subscription flag
//     await User.updateOne(
//       { email: subscription.email },
//       { subscription: totalApprovedPrice > 0 }
//     );

//     res.status(200).json({
//       message: "Payment approved successfully",
//       data: subscription,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Error approving payment", error: err.message });
//   }
// };
exports.getUserSubscriptionAndInfo = async (req, res) => {
  try {
    const { email } = req.params;

    // 1️⃣ Find user
    const user = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Fetch subscriptions
    const subscriptions = await Subscription.find({ email }).sort({
      createdAt: -1,
    });

    const now = new Date();

    // 3️⃣ Collect valid (approved + not expired) package IDs
    const validPackageIds = [];

    subscriptions.forEach((sub) => {
      sub.purchases.forEach((purchase) => {
        if (
          purchase.isApproved === true &&
          purchase.expiredAt &&
          purchase.expiredAt > now
        ) {
          purchase.packages.forEach((pkgId) => {
            validPackageIds.push(new mongoose.Types.ObjectId(pkgId));
          });
        }
      });
    });

    // ❌ no valid payment
    if (validPackageIds.length === 0) {
      return res.status(200).json({
        user,
        subscriptions,
        packages: [],
        hasActiveSubscription: false,
      });
    }

    // 4️⃣ Fetch subjects
    const subjects = await Subject.find({
      _id: { $in: [...new Set(validPackageIds.map(String))] },
    }).populate("subjectClassName");

    // 5️⃣ Response
    res.status(200).json({
      user,
      subscriptions,
      packages: subjects,
      hasActiveSubscription: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user subscription info",
      error: err.message,
    });
  }
};


// Create Multi-Payment Subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      packages,
      price,
      paymentMethod,
      transactionId,
      isApproved = false, // default false
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    const numericPrice = parseFloat(price);
    const isPremium = numericPrice >= 1000;

    let subscription = await Subscription.findOne({ email });

    // Prepare purchase object with its own expiration date
    const purchase = {
      packages,
      price: numericPrice,
      paymentMethod,
      transactionId,
      phoneNumber,
      isApproved,
      date: new Date(),
      expiredAt: isApproved
        ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        : null, // if approved, set 1-year validity
    };

    if (subscription) {
      subscription.purchases.push(purchase);
      subscription.packages = [...new Set([...subscription.packages, ...packages])];

      // Recalculate total price only from approved purchases
      const totalApprovedPrice = subscription.purchases
        .filter((p) => p.isApproved)
        .reduce((sum, p) => sum + p.price, 0);

      subscription.totalPrice = totalApprovedPrice;
      subscription.isPremium = totalApprovedPrice >= 1000;

      await subscription.save();
    } else {
      subscription = await Subscription.create({
        name,
        email,
        phoneNumber,
        packages,
        totalPrice: isApproved ? numericPrice : 0,
        isPremium: isApproved ? isPremium : false,
        purchases: [purchase],
      });
    }

    // Update user's subscription flag if any approved purchases
    user.subscription = subscription.purchases.some((p) => p.isApproved);
    await user.save();

    return res.status(200).json({
      message: subscription ? "Purchase added successfully" : "Subscription created",
      data: subscription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating subscription", error: err.message });
  }
};

// Approve a single payment
exports.approveSinglePayment = async (req, res) => {
  try {
    const { subscriptionId, paymentId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    const purchase = subscription.purchases.id(paymentId);
    if (!purchase)
      return res.status(404).json({ message: "Payment not found" });

    // Approve payment and set its own expiredAt
    purchase.isApproved = true;
    purchase.expiredAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    // Recalculate total approved price
    const totalApprovedPrice = subscription.purchases
      .filter((p) => p.isApproved)
      .reduce((sum, p) => sum + p.price, 0);

    subscription.totalPrice = totalApprovedPrice;
    subscription.isPremium = totalApprovedPrice >= 1000;

    await subscription.save();

    // Update user's subscription flag
    await User.updateOne(
      { email: subscription.email },
      { subscription: totalApprovedPrice > 0 }
    );

    res.status(200).json({
      message: "Payment approved successfully",
      data: subscription,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving payment", error: err.message });
  }
};
