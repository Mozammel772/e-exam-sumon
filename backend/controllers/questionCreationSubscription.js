const Subscription = require("../models/questionCreationSubscriptionModel");
const UserModel = require("../models/UserModel");

// Create Subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      email,
      phoneNumber,
      className,
      subjects,
      price,
      paymentMethod,
      transactionId,
      paymentStatus,
      allQuestions,
    } = req.body;

    // Calculate validity for one year (until Dec 31, 2025)
    const currentYear = new Date().getFullYear();
    const validity = new Date(`${currentYear + 1}-12-31T23:59:59Z`);

    const newSubscription = new Subscription({
      email,
      phoneNumber,
      className,
      subjects,
      price,
      paymentMethod,
      transactionId,
      validity,
      paymentStatus,
      allQuestions,
    });

    const userEmail = await UserModel.findOne({ email });
    if (!userEmail) {
      return res
        .status(400)
        .json({ msg: "Email doesn't exists in our system." });
    }

    await newSubscription.save();
    res.status(201).json({
      message: "Subscription created successfully",
      subscription: newSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Subscription
exports.getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json({ subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, status } = req.body;

    // Check if the email exists in the User model
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's payment status to true
    user.payment = status;
    await user.save();

    // Update the subscription
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({
      message: "Subscription updated and payment status updated",
      subscription: updatedSubscription,
      userPaymentUpdated: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Subscription
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
