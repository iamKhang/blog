import React, { useEffect, useState } from "react";

export default function Menu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedHocKy, setExpandedHocKy] = useState(null);
  const [selectedMonHoc, setSelectedMonHoc] = useState(null);
  const [hocKyData, setHocKyData] = useState([]);

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

  const handleMonHocClick = (monHoc) => {
    setSelectedMonHoc(monHoc);
  };

  useEffect(() => {
    fetch("/public/data/blog-data.dai-hoc.json")
      .then((response) => response.json())
      .then((data) => setHocKyData(data));
  }, []);

  return (
    <div className="flex">
      <div className="w-64 h-[1000px] my-3 mb-3 bg-blue-900 font-bold text-orange-50">
        <ul className="space-y-2">
          <li className="text-left   mx-2">
            <div className="flex justify-between ">
              Đại Học
              <button onClick={handleToggle}>{isExpanded ? "▲" : "▼"}</button>
            </div>
            {isExpanded &&
              hocKyData.map((hocKy, index) => (
                <li className="text-left">
                  <div className="flex justify-between mx-2 items-center">
                    {`${hocKy.hocKy} (${hocKy.namHoc})`}
                    <button onClick={() => handleHocKyToggle(index)}>
                      {expandedHocKy === index ? "▲" : "▼"}
                    </button>
                  </div>
                  {expandedHocKy === index &&
                    hocKy.monHoc.map((monHoc) => (
                      <li
                        className="pl-4 hover:bg-orange-50 hover:text-orange-500"
                        onClick={() => handleMonHocClick(monHoc)}
                      >
                        {monHoc.tenMon.length > 20
                          ? `${monHoc.tenMon.substring(0, 23)}...`
                          : monHoc.tenMon}
                      </li>
                    ))}
                </li>
              ))}
          </li>
          <li className="text-left hover:text-amber-500 hover:bg-white mx-2">
            Tiếng Anh
          </li>
          <li className="text-left hover:text-amber-500 hover:bg-white mx-2">
            Kinh tế
          </li>
          <li className="text-left hover:text-amber-500 hover:bg-white mx-2">
            Khác
          </li>
        </ul>
      </div>
      {selectedMonHoc && (
  <div className="p-4 w-full">
    <h2 className="text-center text-5xl text-green-700 font-bold">
      {selectedMonHoc.tenMon}
    </h2>
    <p>Số tín chỉ: {selectedMonHoc.soTinChi}</p>
    <p>Giáo viên: {selectedMonHoc.giaoVien}</p>
    <h3 className="text-xl text-green-500 font-bold">Tài liệu tham khảo:</h3>
    <ul>
      {selectedMonHoc.taiLieuThamKhao.map((taiLieu) => (
        <li key={taiLieu.ten} className="flex">
          <p className="mx-3">{taiLieu.ten}:</p>
          <a href={taiLieu.link} className="text-cyan-600 underline">
            {taiLieu.link}
          </a>
        </li>
      ))}
    </ul>
    {selectedMonHoc.deMau && Array.isArray(selectedMonHoc.deMau) && (
      <>
        <h3 className="text-xl text-red-500 font-bold">Đề thi/Kiểm tra mẫu:</h3>
        <ul>
          {selectedMonHoc.deMau.map((taiLieu) => (
            <li key={taiLieu.ten} className="flex">
              <p className="mx-3">{taiLieu.ten}:</p>
              <a href={taiLieu.link} className="text-cyan-600 underline">
                {taiLieu.link}
              </a>
            </li>
          ))}
        </ul>
      </>
    )}
    {selectedMonHoc.baiTap && Array.isArray(selectedMonHoc.baiTap) && (
      <>
        <h3 className="text-xl text-yellow-600 font-bold">Bài tập:</h3>
        <ul>
          {selectedMonHoc.baiTap.map((baiTap) => (
            <li key={baiTap.ten} className="flex">
              <p className="mx-3">{baiTap.ten}:</p>
              <a href={baiTap.link} className="text-cyan-600 underline">
                {baiTap.link}
              </a>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
)}
    </div>
  );
}
