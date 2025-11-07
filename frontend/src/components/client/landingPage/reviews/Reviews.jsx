import React from "react";
import { Image } from "antd";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
// import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Navigation } from "swiper/modules";

export default function Reviews() {
  return (
    <div style={{ marginTop: "40px" }}>
      <p className="text-center solaimanlipi font-bold text-5xl">
        সম্মানিত শিক্ষকরা যা বলছেন !
      </p>

      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className=""
        style={{ marginTop: "40px", width: "60%" }}
      >
        <SwiperSlide>
          <Image
            width="100%"
            src="https://images.unsplash.com/photo-1586253633232-8161270c5b6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width="100%"
            src="https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Image
            width="100%"
            src="https://images.unsplash.com/photo-1586170321662-e378ccc81ee6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
