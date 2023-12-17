import React, { useState } from "react";

export default function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHocKy, setExpandedHocKy] = useState(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleHocKyToggle = (index) => {
    if (expandedHocKy === index) {
      setExpandedHocKy(null);
    } else {
      setExpandedHocKy(index);
    }
  };

  const hocKyData = [
    {
      hocKy: "Học kỳ 1",
      namHoc: "2023 - 2024",
      monHoc: [
        {
          tenMon: "Lý thuyết đồ thị",
          soTinChi: 3,
          giaoVien: "Ths. Bùi Công Danh",
          taiLieuThamKhao: [
            {
              ten: "Chương 1: Đại cương, các loại đồ thị",
              link: "demo",
            },
            {
              ten: "Chương 2: Đồ thị Euler",
              link: "demo",
            },
          ],
        },
        {
          tenMon: "Mô hình hóa dữ liệu NoSQL MongoDB",
          soTinChi: 3,
          giaoVien: "TS Nguyễn Thị Hạnh",
          taiLieuThamKhao: [
            {
              ten: "Chương 1: Đại cương, các loại đồ thị",
              link: "demo",
            },
            {
              ten: "Chương 2: Đồ thị Euler",
              link: "demo",
            },
          ],
        },
      ],
    },
    {
      hocKy: "Học kỳ 2",
      namHoc: "2023 - 2024",
      monHoc: [
        {
          tenMon: "Lý thuyết đồ thị",
          soTinChi: 3,
          giaoVien: "Ths. Bùi Công Danh",
          taiLieuThamKhao: [
            {
              ten: "Chương 1: Đại cương, các loại đồ thị",
              link: "demo",
            },
            {
              ten: "Chương 2: Đồ thị Euler",
              link: "demo",
            },
          ],
        },
        {
          tenMon: "Mô hình hóa dữ liệu NoSQL MongoDB",
          soTinChi: 3,
          giaoVien: "TS Nguyễn Thị Hạnh",
          taiLieuThamKhao: [
            {
              ten: "Chương 1: Đại cương, các loại đồ thị",
              link: "demo",
            },
            {
              ten: "Chương 2: Đồ thị Euler",
              link: "demo",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="w-64 h-screen bg-blue-900 text-white my-3 mb-3">
      <ul className="space-y-2">
        <li className="text-left hover:bg-blue-800 hover:text-amber-500 hover:bg-white mx-2">
          <div className="flex justify-between ">
            Đại Học
            <button onClick={handleToggle}>{isExpanded ? "▲" : "▼"}</button>
          </div>
          {isExpanded &&
            hocKyData.map((hocKy, index) => (
              <li className="text-left hover:bg-blue-800 hover:text-slate-200">
                <div className="flex justify-between mx-2 items-center">
                  {hocKy.hocKy}
                  <button onClick={() => handleHocKyToggle(index)}>
                    {expandedHocKy === index ? "▲" : "▼"}
                  </button>
                </div>
                {expandedHocKy === index &&
                  hocKy.monHoc.map((monHoc) => (
                    <li className="pl-4 hover:bg-blue-700 hover:text-slate-200">
                      {monHoc.tenMon}
                    </li>
                  ))}
              </li>
            ))}
        </li>
        <li className="text-left hover:bg-blue-800 hover:text-amber-500 hover:bg-white mx-2">
          Tiếng Anh
        </li>
        <li className="text-left hover:bg-blue-800 hover:text-amber-500 hover:bg-white mx-2">
          Kinh tế
        </li>
        <li className="text-left hover:bg-blue-800 hover:text-amber-500 hover:bg-white mx-2">
          Khác
        </li>
      </ul>
    </div>
  );
}
