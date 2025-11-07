import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button, Form } from "@heroui/react";
import {
  useGetAUserProfileByEmailQuery,
  useUserAddressUpdateMutation,
} from "../../../redux/api/slices/authSlice";
import ClientLoader from "../../../utils/loader/ClientLoader";
import Swal from "sweetalert2";

export default function Profile() {
  const email = localStorage?.getItem("email");
  const token = localStorage?.getItem("token");
  const { data: getUserSingleUserData, isLoading: singleUserLoader } =
    useGetAUserProfileByEmailQuery(email);
  const [userAddressUpdate, { isLoading: isUpdating }] =
    useUserAddressUpdateMutation();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    divisions: "",
    districts: "",
    upazillas: "",
    organizations: "",
  });

  // Populate form with fetched data
  useEffect(() => {
    if (getUserSingleUserData?.user) {
      const { userName, email, addresses } = getUserSingleUserData.user;
      setFormData({
        userName: userName || "",
        email: email || "",
        divisions: addresses?.divisions || "",
        districts: addresses?.districts || "",
        upazillas: addresses?.upazillas || "",
        organizations: addresses?.organizations || "",
      });
    }
  }, [getUserSingleUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const userUpdateFormData = {
        email: formData.email,
        userName: formData.userName,
        addresses: {
          divisions: formData.divisions,
          districts: formData.districts,
          upazillas: formData.upazillas,
          organizations: formData.organizations,
        },
      };
      const res = await userAddressUpdate({
        userUpdateFormData,
        token,
      }).unwrap();
      if (res?.user) {
        Swal.fire({
          title: "আপনার প্রোফাইল আপডেট হয়েছে।",
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "আপডেট হয়নি। আবার চেষ্টা করুন!",
          icon: "error",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      Swal.fire({
        title: err?.message,
        icon: "error",
        showCloseButton: true,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  if (singleUserLoader) {
    return <ClientLoader />;
  }

  return (
    <div className="ms-[270px] mt-24 me-3 solaimanlipi">
      <p className="solaimanlipi text-5xl font-bold text-center pt-3">
        আমার প্রোফাইল
      </p>
      <Card className="mt-5 p-4">
        <CardBody>
          <Form
            className="flex items-center justify-center flex-col"
            onSubmit={handleProfileUpdate}
          >
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 w-full">
              <Input
                isRequired
                label="Name"
                type="text"
                name="userName"
                value={formData?.userName}
                onChange={handleChange}
                className="w-full"
              />
              <Input
                isRequired
                label="Email"
                type="email"
                name="email"
                value={formData?.email}
                readOnly
                className="w-full"
              />
              <Input
                isRequired
                label="Division"
                type="text"
                name="divisions"
                value={formData?.divisions}
                onChange={handleChange}
                className="w-full"
              />
              <Input
                isRequired
                label="District"
                type="text"
                name="districts"
                value={formData.districts}
                onChange={handleChange}
                className="w-full"
              />
              <Input
                isRequired
                label="Upazillas/Road/House"
                type="text"
                name="upazillas"
                value={formData.upazillas}
                onChange={handleChange}
                className="w-full"
              />
              <Input
                isRequired
                label="Organization Name"
                type="text"
                name="organizations"
                value={formData.organizations}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <Button
              className="mt-10 text-xl"
              color="success"
              type="submit"
              isLoading={isUpdating}
            >
              আপডেট করুন
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
}
