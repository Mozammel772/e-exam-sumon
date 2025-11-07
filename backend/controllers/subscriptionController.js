const mongoose = require("mongoose");
const Subscription = require("../models/SubscriptionModel");
const User = require("../models/UserModel");
const Subject = require("../models/SubjectModel");

// Create Subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      packages: newPackages,
      price,
      paymentMethod,
      transactionId,
      isApproved,
    } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "User is not verified" });
    }

    const numericPrice = parseFloat(price);
    const isPremium = numericPrice >= 1000;

    let finalSubscription;

    const existingSubscription = await Subscription.findOne({ email });

    if (existingSubscription) {
      const combinedPackages = [
        ...new Set([...existingSubscription.packages, ...newPackages]),
      ];

      existingSubscription.name = name;
      existingSubscription.phoneNumber = phoneNumber;
      existingSubscription.packages = combinedPackages;

      const oldPrice = parseFloat(existingSubscription.price) || 0;
      const updatedPrice = oldPrice + numericPrice;
      existingSubscription.price = updatedPrice.toString();

      existingSubscription.paymentMethod = paymentMethod;
      existingSubscription.transactionId = transactionId;
      existingSubscription.isPremium = updatedPrice >= 1000;
      existingSubscription.isApproved = isApproved;
      existingSubscription.subscriptionValidity = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      );

      await existingSubscription.save();
      finalSubscription = existingSubscription;
    } else {
      finalSubscription = await Subscription.create({
        name,
        email,
        phoneNumber,
        packages: newPackages,
        price: price.toString(),
        isPremium,
        paymentMethod,
        transactionId,
        isApproved,
        subscriptionValidity: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      });
    }

    // Update only subscription status (not array)
    user.subscription = true;
    await user.save();

    return res.status(existingSubscription ? 200 : 201).json({
      message: existingSubscription
        ? "New packages added to existing user"
        : "Subscription created successfully",
      data: {
        subscription: finalSubscription,
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating subscription",
      error: err.message,
    });
  }
};

// Get All Subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch subscriptions", error: err.message });
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

// Update Subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { price } = req.body;

    if (price) {
      req.body.isPremium = price > 1000;
    }

    const updated = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription updated", data: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating subscription", error: err.message });
  }
};

// Delete Subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const deleted = await Subscription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ message: "Subscription deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting subscription", error: err.message });
  }
};

// Get user subscription and user info by email
exports.getUserSubscriptionAndInfo = async (req, res) => {
  try {
    const { email } = req.params;

    // 1. Fetch user by email (case-insensitive), exclude password
    const user = await User.findOne({
      email: new RegExp(`^${email}$`, "i"),
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch all subscriptions for the user
    const subscriptions = await Subscription.find({ email }).sort({
      createdAt: -1,
    });

    // 3. Extract all package IDs from all subscriptions
    const allPackageIds = subscriptions.flatMap((sub) =>
      sub.packages.map((pkgId) => new mongoose.Types.ObjectId(pkgId))
    );

    // 4. Fetch all matching subject details
    const subjects = await Subject.find({
      _id: { $in: allPackageIds },
    }).populate("subjectClassName");

    // 5. Return everything
    res.status(200).json({
      user,
      subscriptions,
      packages: subjects,
      totalSubscriptions: subscriptions.length,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user subscription info",
      error: err.message,
    });
  }
};
