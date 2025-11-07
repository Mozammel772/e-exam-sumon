import * as Yup from "yup";

export const subscriptionSchema = Yup.object().shape({
  name: Yup.string().required("নাম আবশ্যক"),
  email: Yup.string().email("সঠিক ইমেইল দিন").required("ইমেইল আবশ্যক"),
  phoneNumber: Yup.string()
    .matches(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নম্বর দিন")
    .required("মোবাইল নম্বর আবশ্যক"),
  transactionId: Yup.string().required("ট্রানসাকশান আইডি আবশ্যক"),
  packages: Yup.array()
    .min(1, "কমপক্ষে একটি সাবজেক্ট বাছাই করুন")
    .required("সাবজেক্ট প্যাকেজ আবশ্যক"),
});
