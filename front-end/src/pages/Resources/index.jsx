// import React from "react";
import Menu from "../../components/Menu/Menu";
import CourseDetail from "./CourseDetail";
import { useState } from "react";

export default function Resources() {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="flex">
      <Menu setSelectedCourse={setSelectedCourse}/>
      <CourseDetail course={selectedCourse}/>
    </div>
  );
}