import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-between px-10 bg-blue-900">
      <div className="info mt-3">
        <header className="font-extrabold text-white">
          Thông tin liên lạc:
        </header>
        <div className="flex">
          <label
            htmlFor="numberPhone"
            className="mr-2 font-semibold text-white"
          >
            Số điện thoại:{" "}
          </label>
          <a href="" className="font-semibold text-white">
            0383741660
          </a>
        </div>
        <div className="flex">
          <label
            htmlFor="emailAddress"
            className="mr-2 font-semibold text-white"
          >
            Email:{" "}
          </label>
          <a href="" className="font-semibold text-white">
            iamhoangkhang@icloud.com
          </a>
        </div>
        <div className="flex">
          <label htmlFor="address" className="mr-2 font-semibold text-white">
            Địa chỉ:{" "}
          </label>
          <a href="" className="font-semibold text-white">
            Gò Dầu - Tây Ninh
          </a>
        </div>
      </div>
      {/* Google Map */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d244.92873272905206!2d106.68668725241035!3d10.822045259635482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDQ5JzE5LjciTiAxMDbCsDQxJzEyLjkiRQ!5e0!3m2!1svi!2s!4v1702702592850!5m2!1svi!2s"
        width="400"
        height="200"
        style={{ border: 0 }}
        loading="lazy"
      ></iframe>
    </footer>
  );
};

export default Footer;
