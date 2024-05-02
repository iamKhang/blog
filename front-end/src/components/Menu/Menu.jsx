import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export default function Menu() {
  const [courses, setCourses] = useState([]);
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedUniversity, setExpandedUniversity] = useState(false);

  const toggleUniversity = () => {
    setExpandedUniversity(!expandedUniversity);
  };

  useEffect(() => {
    fetch('http://localhost:3000/courses/show')
      .then(response => response.json())
      .then(data => setCourses(data.courses)) // Truy cập vào mảng "courses" trong dữ liệu trả về
      .catch(error => console.error('Error:', error));
  }, []);

  const toggleYear = (year) => {
    setExpandedYears({ ...expandedYears, [year]: !expandedYears[year] });
  };

  const toggleSemester = (year, semester) => {
    const key = `${year}-${semester}`;
    setExpandedSemesters({ ...expandedSemesters, [key]: !expandedSemesters[key] });
  };

  // Tạo một đối tượng để lưu trữ các khóa học theo năm học và học kỳ
  const coursesByYearAndSemester = {};

  courses.forEach(course => {
    const { academicYear, semester, subjectName } = course;

    // Nếu chưa có năm học này trong đối tượng, thêm nó
    if (!coursesByYearAndSemester[academicYear]) {
      coursesByYearAndSemester[academicYear] = {};
    }

    // Nếu chưa có học kỳ này trong năm học, thêm nó
    if (!coursesByYearAndSemester[academicYear][semester]) {
      coursesByYearAndSemester[academicYear][semester] = [];
    }

    // Thêm khóa học vào danh sách
    coursesByYearAndSemester[academicYear][semester].push(course);
  });

  // Hiển thị ra màn hình courses
  return (
    <div className="flex my-1">
      <div className="bg-blue-900 w-56 p-3">
        <h2 className="cursor-pointer font-semibold text-white flex justify-between items-center" onClick={toggleUniversity}>
          Đại học
          {expandedUniversity ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </h2>
        {expandedUniversity && Object.entries(coursesByYearAndSemester).map(([year, semesters]) => (
          <div key={year}>
            <h3 className="cursor-pointer flex justify-between ml-2 font-semibold text-white" onClick={() => toggleYear(year)}>
              <p>Năm học: {year}</p>
              <p>
                {expandedYears[year] ? (
                  <FontAwesomeIcon icon={faChevronUp} />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} />
                )}

              </p>
            </h3>
            {expandedYears[year] && Object.entries(semesters).map(([semester, subjects]) => (
              <div key={semester}>
                <h4 className="cursor-pointer ml-4 font-semibold text-white flex justify-between" onClick={() => toggleSemester(year, semester)}>{semester}
                  {expandedSemesters[`${year}-${semester}`] ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronDown} />
                  )}</h4>
                {expandedSemesters[`${year}-${semester}`] && (
                  <ul className="ml-6 text-white font-semibold">
                    {subjects.map((course, index) => (
                      <li className="cursor-pointer truncate" key={index} onClick={() => setSelectedCourse(course)}>{course.subjectName}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="">
        {selectedCourse && (
          <div>
            <h2>{selectedCourse.subjectName}</h2>
            {/* Thêm bất kỳ thông tin khác bạn muốn hiển thị ở đây */}
          </div>
        )}
      </div>
    </div>
  );
}