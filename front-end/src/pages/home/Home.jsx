// import React, { useState } from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import Marquee from "react-fast-marquee";
import Modal from "react-modal";

import heroIcon from "./imgs/hero-2a493943.svg"

import androidLogo from "./imgs/android-color-svgrepo-com.svg";
import bootstrapLogo from "./imgs/bootstrap-svgrepo-com.svg";
import cssLogo from "./imgs/css-3-svgrepo-com.svg";
import githubLogo from "./imgs/github-142-svgrepo-com.svg";
import htmlLogo from "./imgs/html-svgrepo-com.svg";
import javaLogo from "./imgs/java-svgrepo-com.svg";
import javascriptLogo from "./imgs/javascript-svgrepo-com.svg";
import pythonLogo from "./imgs/python-svgrepo-com.svg";
import reactLogo from "./imgs/react-svgrepo-com.svg";
import scssLogo from "./imgs/scss-svgrepo-com.svg";
import springLogo from "./imgs/spring-svgrepo-com.svg";
import sqlLogo from "./imgs/sql-database-sql-azure-svgrepo-com.svg";
import tailwindLogo from "./imgs/tailwindcss-icon-svgrepo-com.svg";
import phpLogo from "./imgs/php-svgrepo-com.svg";
import cLogo from "./imgs/c.svg";
import cppLogo from "./imgs/c--4.svg";
import postgreLogo from "./imgs/postgresql-icon.svg";

Modal.setAppElement("#root");

const images = [
  androidLogo,
  bootstrapLogo,
  cssLogo,
  githubLogo,
  htmlLogo,
  javaLogo,
  javascriptLogo,
  pythonLogo,
  reactLogo,
  scssLogo,
  springLogo,
  sqlLogo,
  tailwindLogo,
  phpLogo,
  cLogo,
  cppLogo,
  postgreLogo,
];

export default function Home() {
  return (
    <div>
      <Header />
      <div className="h-[2000px] bg-slate-200">
        <div className="md:px-36 sm:px-2 flex justify-around pt-7">
          <div className="w-1/2">
            <img
              className="animate-float h-full"
              src={heroIcon}
              alt=""
            />
          </div>
          <div className="bg-red-700 w-1/2"></div>
        </div>
        <Marquee className="flex">
          <div className="h-16 flex space-x-7 justify-between mt-10 overflow-hidden sm:space-x-4 md:space-x-6 lg:space-x-7">
            {images.map((image) => (
              <div className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl" key={image}>
                <img src={image} alt="" className="xs:w-9 xs:h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
              </div>
            ))}
          </div>
          <div className="h-16 flex space-x-7 justify-between mt-10 overflow-hidden mx-7 sm:space-x-4 md:space-x-6 lg:space-x-7">
            {images.map((image) => (
              <div className="text-6xl sm:text-4xl md:text-5xl lg:text-6xl" key={image}>
                <img src={image} alt="" className="xs:w-9 xs:h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />
              </div>
            ))}
          </div>
        </Marquee>
        {/* Tìm kiếm */}

        <div className="flex justify-center mt-10 sm:mt-6 xs:mt-4">
          <div className="mt-5 flex md:w-1/4 sm:w-1/2 xs:w-3/4">
            <input
              className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
              type="search"
              placeholder="Search..."

            />
            <button className="w-15 ml-2 bg-blue-900 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-orange-400">
              Search
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
