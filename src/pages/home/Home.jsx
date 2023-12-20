import React, { useState } from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import Marquee from "react-fast-marquee";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const images = [
  "/public/img/programming-language-logo/android-color-svgrepo-com.svg",
  "/public/img/programming-language-logo/bootstrap-svgrepo-com.svg",
  "/public/img/programming-language-logo/css-3-svgrepo-com.svg",
  "/public/img/programming-language-logo/github-142-svgrepo-com.svg",
  "/public/img/programming-language-logo/html-svgrepo-com.svg",
  "/public/img/programming-language-logo/java-svgrepo-com.svg",
  "/public/img/programming-language-logo/javascript-svgrepo-com.svg",
  "/public/img/programming-language-logo/python-svgrepo-com.svg",
  "/public/img/programming-language-logo/react-svgrepo-com.svg",
  "/public/img/programming-language-logo/scss-svgrepo-com.svg",
  "/public/img/programming-language-logo/spring-svgrepo-com.svg",
  "/public/img/programming-language-logo/sql-database-sql-azure-svgrepo-com.svg",
  "/public/img/programming-language-logo/tailwindcss-icon-svgrepo-com.svg",
  "/public/img/programming-language-logo/php-svgrepo-com.svg",
  "/public/img/programming-language-logo/c.svg",
  "/public/img/programming-language-logo/c--4.svg",
];

export default function Home() {
  return (
    <div>
      <Header />
      <div className="h-[2000px] bg-slate-200">
        <div className="px-36 flex justify-around pt-7">
          <div className="w-1/2">
            <img
              className="animate-float h-full"
              src="/public/img/hero-2a493943.svg"
              alt=""
            />
          </div>
          <div className="bg-red-700 w-1/2"></div>
        </div>
        <Marquee className="flex">
          <div className="h-16 flex space-x-7 justify-between mt-10 overflow-hidden">
            {images.map((image) => (
              <div className="text-6xl" key={image}>
                <img src={image} alt="" />
              </div>
            ))}
          </div>
          <div className="h-16 flex space-x-7 justify-between mt-10 overflow-hidden mx-7">
            {images.map((image) => (
              <div className="text-6xl" key={image}>
                <img src={image} alt="" />
              </div>
            ))}
          </div>
        </Marquee>

        {/* Tìm kiếm */}

        <div className="flex justify-center mt-10">
          <div className="mt-5 flex w-1/4">
            <input
              className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="search"
              placeholder="Search..."
            />
            <button className="ml-2 bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-orange-400">
              Search
            </button>
          </div>
        </div>
       
      </div>
            
      <Footer />
    </div>
  );
}
