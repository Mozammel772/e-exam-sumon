import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { subscriptionSchema } from "../../../../../utils/validationSchema"; // adjust path
import { useEffect } from "react";
import { useCreateASubscriptionMutation } from "../../../../redux/api/slices/subscriptionSlice";
import { Button } from "@heroui/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SubscriptionForm = ({
  selectedCount,
  selectedSubjects,
  currentAmount,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(subscriptionSchema),
    defaultValues: {
      packages: [],
    },
  });
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("01933520904");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setValue("packages", selectedSubjects);
  }, [selectedSubjects, setValue]);

  const [createASubscription, { isLoading }] = useCreateASubscriptionMutation();

  const onSubmit = async (data) => {
    const totalPrice = currentAmount - currentAmount * 0.1;
    const isPremium = totalPrice >= 1000;

    const subscriptionData = {
      ...data,
      price: totalPrice?.toString(),
      paymentMethod: "bkash",
      isPremium,
      isApproved: false,
    };

    try {
      Swal.fire({
        title: "রিকোয়েস্ট পাঠানো হচ্ছে...",
        text: "অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await createASubscription(subscriptionData);

      if (res?.data) {
        Swal.fire({
          title: "সাবস্ক্রিপশন সফল!",
          text: "দয়া করে কিছুক্ষন অপেক্ষা করুন। আমাদের প্রতিনিধি খুব দ্রুত আপনার রিকোয়েস্টটির সাড়া দিবে।",
          icon: "success",
          confirmButtonText: "ঠিক আছে",
          confirmButtonColor: "#6366f1",
        });
      } else {
        Swal.fire({
          title: "সাবস্ক্রিপশন ব্যর্থ",
          text: res?.error?.data?.message || "দুঃখিত, কিছু ভুল হয়েছে!",
          icon: "error",
          confirmButtonText: "আবার চেষ্টা করুন",
          confirmButtonColor: "#ef4444",
        });
        navigate();
      }
    } catch (error) {
      Swal.fire({
        title: "একটি ত্রুটি ঘটেছে",
        text: error?.message || "দয়া করে পরে আবার চেষ্টা করুন",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const toBengaliNumber = (number) =>
    number.toString().replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-full mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 solaimanlipi"
    >
      <div className="border-b pb-4 mb-4 bg-green-50 rounded-md p-4 shadow-sm">
        <p className="text-xl font-semibold text-blue-900">
          মূল্য:{" "}
          <span className="text-blue-800 font-bold">
            {toBengaliNumber(currentAmount)}
          </span>{" "}
          টাকা
        </p>
        <p className="text-md font-semibold text-green-600 mt-2">
          ডিসকাউন্ট মূল্য:
          <span className="ml-1 text-green-700">
            {toBengaliNumber((currentAmount * 0.1).toFixed(2))}
          </span>{" "}
          টাকা
        </p>
        <p className="text-xl font-bold text-red-700 mt-2 border-t pt-2">
          সর্বমোট:{" "}
          <span className="text-red-800">
            {toBengaliNumber(currentAmount - currentAmount * 0.1)}
          </span>{" "}
          টাকা
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="আপনার নাম লিখুন"
            {...register("name")}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="email"
              placeholder="আপনার ইমেইল"
              {...register("email")}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              placeholder="আপনার মোবাইল নাম্বার"
              {...register("phoneNumber")}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className="mb-2 text-lg">
              উক্ত নম্বরে সেন্ড মানি করুন বিকাশ/নগদ/রকেট/উপায়
            </label>
            <input
              type="text"
              value="01933520904"
              disabled
              className="w-full text-xl font-bold p-3 rounded-md border border-green-500 bg-[#00FF00] shadow-inner focus:ring-2 focus:ring-green-400 opacity-90 backdrop-blur-sm"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-2/3 transform -translate-y-1/2 bg-red-900 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              কপি করুন
            </button>
            {copied && (
              <p className="text-green-600 text-sm mt-1">নম্বর কপি হয়েছে</p>
            )}
          </div>

          <div>
            <label className="mb-2 text-lg">ট্রানসাকশান আইডি দিন</label>
            <input
              type="text"
              placeholder="ট্রানসাকশান আইডি"
              {...register("transactionId")}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.transactionId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.transactionId.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-3">
        By confirming, I agree to the{" "}
        <a href="#" className="text-blue-600 font-medium">
          Terms and Conditions
        </a>
      </p>

      <Button
        isLoading={isLoading}
        type="submit"
        className="w-full mt-4 bg-[#024544] text-white font-semibold py-3 rounded-md"
      >
        পেমেন্ট সম্পন্ন করুন
      </Button>
    </form>
  );
};
