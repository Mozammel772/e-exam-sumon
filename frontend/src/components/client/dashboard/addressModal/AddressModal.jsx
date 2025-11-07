import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
} from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

import { useState } from "react";
import { useUserAddressUpdateMutation } from "../../../../redux/api/slices/authSlice";
import Swal from "sweetalert2";

// Sample Bangladesh location data
const bangladeshData = {
  dhaka: {
    name: "Dhaka",
    districts: {
      dhaka: {
        name: "Dhaka",
        upazilas: [
          "Dhaka Sadar",
          "Dhamrai",
          "Dohar",
          "Keraniganj",
          "Nawabganj",
          "Savar",
        ],
      },
      faridpur: {
        name: "Faridpur",
        upazilas: [
          "Alfadanga",
          "Faridpur Sadar",
          "Bhanga",
          "Boalmari",
          "Char Bhadrasan",
          "Faridpur Sadar",
          "Madhukhali",
          "Nagarkanda",
          "Sadarpur",
          "Saltha",
        ],
      },
      gazipur: {
        name: "Gazipur",
        upazilas: [
          "Gazipur Sadar",
          "Kaliakair",
          "Kaliganj",
          "Kapasia",
          "Sreepur",
        ],
      },
      gopalganj: {
        name: "Gopalganj",
        upazilas: [
          "Gopalganj Sadar",
          "Kashiani",
          "Kotalipara",
          "Muksudpur",
          "Tungipara",
        ],
      },
      kishoreganj: {
        name: "Kishoreganj",
        upazilas: [
          "Austagram",
          "Bajitpur",
          "Bhairab",
          "Hossainpur",
          "Itna",
          "Karimganj",
          "Katiadi",
          "Kishoreganj Sadar",
          "Kuliarchar",
          "Mithamain",
          "Nikli",
          "Pakundia",
          "Tarail",
        ],
      },
      madaripur: {
        name: "Madaripur",
        upazilas: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"],
      },
      manikganj: {
        name: "Manikganj",
        upazilas: [
          "Daulatpur",
          "Ghior",
          "Harirampur",
          "Manikganj Sadar",
          "Saturia",
          "Shibalaya",
          "Singair",
        ],
      },
      munshiganj: {
        name: "Munshiganj",
        upazilas: [
          "Gazaria",
          "Lohajang",
          "Munshiganj Sadar",
          "Sirajdikhan",
          "Sreenagar",
          "Tongibari",
        ],
      },
      narayanganj: {
        name: "Narayanganj",
        upazilas: [
          "Araihazar",
          "Bandar",
          "Narayanganj Sadar",
          "Rupganj",
          "Sonargaon",
        ],
      },
      narsingdi: {
        name: "Narsingdi",
        upazilas: [
          "Belabo",
          "Monohardi",
          "Narsingdi Sadar",
          "Palash",
          "Raipura",
          "Shibpur",
        ],
      },
      rajbari: {
        name: "Rajbari",
        upazilas: ["Baliakandi", "Goalandaghat", "Pangsha", "Rajbari Sadar"],
      },
      shariatpur: {
        name: "Shariatpur",
        upazilas: [
          "Bhedarganj",
          "Damudya",
          "Gosairhat",
          "Naria",
          "Shakhipur",
          "Shariatpur Sadar",
        ],
      },
      tangail: {
        name: "Tangail",
        upazilas: [
          "Basail",
          "Bhuapur",
          "Delduar",
          "Dhanbari",
          "Ghatail",
          "Gopalpur",
          "Kalihati",
          "Madhupur",
          "Mirzapur",
          "Nagarpur",
          "Sakhipur",
          "Tangail Sadar",
        ],
      },
    },
  },
  chottogram: {
    name: "Chottogram",
    districts: {
      chottogram: {
        name: "Chottogram",
        upazilas: [
          "Anwara",
          "Banshkhali",
          "Boalkhali",
          "Chandanaish",
          "Fatikchhari",
          "Hathazari",
          "Lohagara",
          "Mirsharai",
          "Patiya",
          "Rangunia",
          "Sandwip",
          "Satkania",
          "Sitakunda",
        ],
      },
      bandarbans: {
        name: "Bandarban",
        upazilas: [
          "Bandarban Sadar",
          "Boga Lake",
          "Chimbuk",
          "Rowangchhari",
          "Thanchi",
          "Ruma",
        ],
      },
      brahmanbaria: {
        name: "Brahmanbaria",
        upazilas: [
          "Ashuganj",
          "Brahmanbaria Sadar",
          "Kasba",
          "Nabinagar",
          "Nasirnagar",
          "Sarail",
        ],
      },
      comilla: {
        name: "Comilla",
        upazilas: [
          "Comilla Sadar",
          "Chandpur",
          "Daudkandi",
          "Chauddagram",
          "Debidwar",
          "Homna",
          "Laksam",
          "Madhyamgram",
          "Manohorgonj",
          "Muradnagar",
          "Nangalkot",
          "Noyapur",
          "Titas",
        ],
      },
      coxsbazar: {
        name: "Cox's Bazar",
        upazilas: [
          "Cox's Bazar Sadar",
          "Chakaria",
          "Kutubdia",
          "Maheshkhali",
          "Pekua",
          "Ramu",
          "Teknaf",
          "Ukhia",
        ],
      },
      khagrachari: {
        name: "Khagrachari",
        upazilas: [
          "Khagrachhari Sadar",
          "Dighinala",
          "Lakshmipur",
          "Manikchhari",
          "Mahalchhari",
          "Mirsarai",
          "Ramgarh",
        ],
      },
      lakshmipur: {
        name: "Lakshmipur",
        upazilas: [
          "Lakshmipur Sadar",
          "Raipur",
          "Begumganj",
          "Kamalgazi",
          "Kamalnagar",
          "Monohorganj",
          "Sadarghat",
        ],
      },
      noakhali: {
        name: "Noakhali",
        upazilas: [
          "Begumganj",
          "Chatkhil",
          "Companiganj",
          "Haimchar",
          "Noakhali Sadar",
          "Senbagh",
          "Subarnachar",
        ],
      },
      rangamati: {
        name: "Rangamati",
        upazilas: [
          "Rangamati Sadar",
          "Baghaichhari",
          "Barkal",
          "Kaptai",
          "Kanchana",
          "Khilchhari",
          "Kumarghat",
        ],
      },
    },
  },
  khulna: {
    name: "Khulna",
    districts: {
      bagerhat: {
        name: "Bagerhat",
        upazilas: [
          "Bagerhat Sadar",
          "Chitalmari",
          "Kachua",
          "Mollarhat",
          "Morrelganj",
          "Rampal",
          "Sharankhola",
          "Ujjalganj",
        ],
      },
      chuadanga: {
        name: "Chuadanga",
        upazilas: [
          "Chuadanga Sadar",
          "Alamdanga",
          "Damurhuda",
          "Jibannagar",
          "Meherpur",
          "Muktagacha",
        ],
      },
      jashore: {
        name: "Jashore",
        upazilas: [
          "Jashore Sadar",
          "Bagherpara",
          "Chaugachha",
          "Jhikra",
          "Keshabpur",
          "Manirampur",
          "Shyamnagar",
        ],
      },
      khulna: {
        name: "Khulna",
        upazilas: [
          "Khulna Sadar",
          "Dighalia",
          "Koyra",
          "Paikgachha",
          "Rupsha",
          "Terakota",
        ],
      },
      meherpur: {
        name: "Meherpur",
        upazilas: ["Meherpur Sadar", "Mujibnagar"],
      },
      satkhira: {
        name: "Satkhira",
        upazilas: [
          "Satkhira Sadar",
          "Ashashuni",
          "Debhata",
          "Kalaroa",
          "Kaliganj",
          "Shyamnagar",
        ],
      },
    },
  },
  rajshahi: {
    name: "Rajshahi",
    districts: {
      bogura: {
        name: "Bogura",
        upazilas: [
          "Bogura Sadar",
          "Dhunat",
          "Gabtali",
          "Kahaloo",
          "Kundapura",
          "Sherpur",
          "Shibganj",
        ],
      },
      chapainawabganj: {
        name: "Chapainawabganj",
        upazilas: [
          "Chapainawabganj Sadar",
          "Gomostapur",
          "Nawabganj",
          "Shibganj",
        ],
      },
      dinajpur: {
        name: "Dinajpur",
        upazilas: [
          "Dinajpur Sadar",
          "Birampur",
          "Chirirbander",
          "Kaharole",
          "Khansama",
          "Ghoraghat",
        ],
      },
      naogaon: {
        name: "Naogaon",
        upazilas: [
          "Naogaon Sadar",
          "Badalgachhi",
          "Manda",
          "Mahadevpur",
          "Raninagar",
        ],
      },
      rajshahi: {
        name: "Rajshahi",
        upazilas: [
          "Rajshahi Sadar",
          "Bagha",
          "Charghat",
          "Durgapur",
          "Godagari",
          "Mohanpur",
          "Puthia",
        ],
      },
      sirajganj: {
        name: "Sirajganj",
        upazilas: [
          "Sirajganj Sadar",
          "Kamarkhanda",
          "Kazipur",
          "Shahjadpur",
          "Chauhali",
          "Raiganj",
          "Tarash",
        ],
      },
    },
  },
  // Other divisions can follow in the same pattern...
};

export default function AddressModal({ isOpen, onOpenChange }) {
  const token = localStorage.getItem("token");

  const [divisionValue, setDivisionValue] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [addressValue, setAddressValue] = useState("");
  const [organizationValue, setOrganizationValue] = useState("");

  const [userAddressUpdate, { isLoading }] = useUserAddressUpdateMutation();

  const handleDivisionChange = (key) => {
    setDivisionValue(key);
    setDistrictValue("");
  };

  const handleDistrictChange = (key) => {
    setDistrictValue(key);
  };

  const divisionKeys = Object.keys(bangladeshData);
  const districtKeys = divisionValue
    ? Object.keys(bangladeshData[divisionValue]?.districts || {})
    : [];

  const handleAddressFromSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    const userUpdateFormData = {
      email,
      addresses: {
        upazillas: addressValue,
        organizations: organizationValue,
        divisions: divisionValue,
        districts: districtValue,
      },
    };

    try {
      const response = await userAddressUpdate({
        userUpdateFormData,
        token,
      }).unwrap();

      if (response) {
        Swal.fire({
          title: response?.msg,
          icon: "success",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response?.msg,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      onOpenChange(false);
    }
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <Form
            className="w-full flex flex-col gap-4 p-4 justify-center items-center"
            onSubmit={handleAddressFromSubmit}
          >
            <ModalHeader className="flex flex-col gap-1 text-center">
              <p className="solaimanlipi text-2xl">
                আপনার এড্রেস ফর্মটি ফিলাপ করুন
              </p>
            </ModalHeader>
            <ModalBody className="w-full flex flex-col gap-4 p-4">
              {/* Division Selector */}
              <Select
                isRequired
                label="আপনার বিভাগ নির্বাচন করুন"
                selectedKeys={
                  divisionValue ? new Set([divisionValue]) : new Set([])
                }
                onSelectionChange={(keys) =>
                  handleDivisionChange(Array.from(keys)[0])
                }
              >
                {divisionKeys.map((key) => (
                  <SelectItem key={key}>{bangladeshData[key].name}</SelectItem>
                ))}
              </Select>

              {/* District Selector */}
              <Select
                label="আপনার জিলা নির্বাচন করুন"
                isRequired
                isDisabled={!divisionValue}
                className=" text-3xl"
                selectedKeys={
                  districtValue ? new Set([districtValue]) : new Set([])
                }
                onSelectionChange={(keys) =>
                  handleDistrictChange(Array.from(keys)[0])
                }
              >
                {districtKeys.map((key) => (
                  <SelectItem key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </SelectItem>
                ))}
              </Select>

              {/* Upazila Selector */}
              <Input
                isRequired
                label="আপনার পুরো এড্রেসটা দিন"
                type="text"
                className=" text-3xl"
                value={addressValue}
                onValueChange={(setValue) => setAddressValue(setValue)}
              />

              <Input
                isRequired
                label="আপনার প্রতিষ্ঠানের নাম দিন"
                type="text"
                className=" text-3xl"
                value={organizationValue}
                onValueChange={(setValue) => setOrganizationValue(setValue)}
              />
            </ModalBody>
            <div className="flex justify-center items-center">
              <Button
                isLoading={isLoading}
                color="success"
                variant="light"
                type="submit"
              >
                <p className="solaimanlipi text-xl">ঠিকানা যোগ করুন</p>
              </Button>
            </div>
          </Form>
        )}
      </ModalContent>
    </Modal>
  );
}
