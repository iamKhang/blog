import React from "react";
import "./header.css";
import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faDonate,
  faEnvelope,
  faMobile,
  faToilet,
  faUser,
  faAddressBook,
  faHouse,
  faFileCode,
  faNewspaper, // Add the missing import
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  return (
    <header className="bg-blue-900 flex justify-between items-center px-2 p-4">
      <a className="text-white font-extrabold ml-2 flex items-end">
        <p>iam</p>
        <p className="text-amber-400 text-xl">HoangKhang</p>
        <p className="text-green-400 text-xs">.github.io</p>
      </a>
      <nav className="">
        <ul className="flex justify-end space-x-14 px-8">
          <li>
            <a href="/" className="text-white hover:text-gray-300 navItems">
              <FontAwesomeIcon icon={faHouse} /> Trang chủ
            </a>
          </li>
          <li>
            <a
              href="/resources"
              className="text-white hover:text-gray-300 navItems"
            >
              <FontAwesomeIcon icon={faFileCode} /> Tài nguyên
            </a>
          </li>
          <li>
            <a href="/blog" className="text-white hover:text-gray-300 navItems">
              <FontAwesomeIcon icon={faNewspaper} /> Bài viết
            </a>
          </li>
          <li>
            <Tippy
              interactive
              arrow={true}
              offset={[0, 20]}
              content={
                <div className="bg-blue-900 py-3 rounded">
                  <div className="flex mx-4">
                    <label className="text-white font-semibold mr-1">
                      <FontAwesomeIcon icon={faMobile} /> Số điện thoại:
                    </label>
                    <a href="" className="font-semibold text-white">
                      0383741660
                    </a>
                  </div>
                  <div className="flex mx-4">
                    <label className="text-white font-semibold mr-1">
                      <FontAwesomeIcon icon={faEnvelope} /> Email:
                    </label>
                    <a href="" className="font-semibold text-white">
                      iamhoangkhang@icloud.com
                    </a>
                  </div>
                  <div className="flex mx-4">
                    <label className="text-white font-semibold mr-1 flex">
                      <img
                        src="/public/img/icon-facebook.svg"
                        className="text-white"
                        alt=""
                      />{" "}
                      Facebook:
                    </label>
                    <a href="" className="font-semibold text-white">
                      Lê Hoàng Khang
                    </a>
                  </div>
                </div>
              }
            >
              <p className="text-white hover:text-gray-300 navItems">
                <FontAwesomeIcon icon={faAddressBook} /> Liên hệ
              </p>
            </Tippy>
          </li>
          <li>
            <Tippy
              offset={[0, 20]}
              interactive
              arrow={true}
              content={
                <img
                  src="/public/img/qr.jpg"
                  alt="Logo"
                  style={{ width: "350px" }}
                />
              }
            >
              <p className="text-white hover:text-gray-300 navItems">
                <FontAwesomeIcon icon={faCoins} /> Donate
              </p>
            </Tippy>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
