import { useState } from "react";
import "./header.css";
import Tippy from "@tippyjs/react";
import 'tippy.js/animations/scale.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import qr_momo from "./imgs/qr.jpg";
import {
  faBars,
  faCoins,
  faEnvelope,
  faMobile,
  faAddressBook,
  faHouse,
  faFileCode,
  faNewspaper, // Add the missing import
  faUserTie
} from "@fortawesome/free-solid-svg-icons";


const Header = () => {
  return (
    <header className="bg-blue-900 flex justify-between items-center px-2 md:p-4">
      <a className="text-white font-extrabold ml-2 flex items-end">
        <p>iam</p>
        <p className="text-amber-400 text-xl">HoangKhang</p>
      </a>

      <nav className="hidden md:block">
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
            <a href="/post" className="text-white hover:text-gray-300 navItems">
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
                  src={qr_momo}
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
          <li>
            <a
              href="/admin"
              className="text-white hover:text-gray-300 navItems"
            >
              <FontAwesomeIcon icon={faUserTie} /> Quản lý
            </a>
          </li>
        </ul>
      </nav>

      <nav className="md:hidden d-block">
        <Tippy
          interactive
          arrow={true}
          offset={[0, 0]}
          trigger="click"
          animation="scale"
          content={
            <nav className="bg-blue-900 p-5">
              <ul className="space-y-2">
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
                  <a href="/post" className="text-white hover:text-gray-300 navItems">
                    <FontAwesomeIcon icon={faNewspaper} /> Bài viết
                  </a>
                </li>
                <li>
                  <Tippy
                    interactive
                    arrow={true}
                    placement="right"
                    offset={[10, 22]}
                    content={
                      <div className="bg-blue-900 rounded px-3">
                        <div className="flex">
                          <label className="text-white font-semibold mr-1 flex items-center">
                            <FontAwesomeIcon icon={faMobile} /> 
                            <p className="mx-1">Số điện thoại:</p>
                          </label>
                          <a href="" className="font-semibold text-white">
                            0383741660
                          </a>
                        </div>
                        <div className="flex">
                          <label className="text-white font-semibold mr-1 flex justify-center items-center">
                            <FontAwesomeIcon icon={faEnvelope} /> 
                            <p className="mx-1">Email: </p>
                          </label>

                          <a href="" className="font-semibold text-white">
                            iamhoangkhang@icloud.com
                          </a>

                        </div>
                        {/* <div className="flex mx-4">
                          <a href="" className="font-semibold text-white">
                            Lê Hoàng Khang
                          </a>
                        </div> */}
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
                    placement="right"
                    maxWidth="none" // add this line
                    content={
                      <img
                        src={qr_momo}
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
          }
        >
          <p className="text-white hover:text-gray-300 navItems px-2 p-4">
            <FontAwesomeIcon icon={faBars} />
          </p>
        </Tippy>
      </nav>


    </header>
  );
};

export default Header;
