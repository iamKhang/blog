import React from 'react'

export default function CourseDetail({ course }) {
    if (!course) {
        return <div>Chưa chọn khóa học</div>
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{course.subjectName}</h2>
            <p className="mb-2">Semester: {course.semester}</p>
            <p className="mb-2">Academic Year: {course.academicYear}</p>
            <p className="mb-2">Credits: {course.credits}</p>
            <p className="mb-2">Lecturer: {course.lecturer}</p>

            {course.referenceDocuments.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mt-4 mb-2">Reference Documents</h3>
                    {course.referenceDocuments.map((doc, index) => (
                        <p key={index}><a href={doc.link} className="text-blue-500">{doc.name}</a></p>
                    ))}
                </div>
            )}

            {course.exercises.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mt-4 mb-2">Exercises</h3>
                    {course.exercises.map((exercise, index) => (
                        <p key={index}><a href={exercise.link} className="text-blue-500">{exercise.name}</a></p>
                    ))}
                </div>
            )}

            {course.project && (
                <div>
                    <h3 className="text-xl font-bold mt-4 mb-2">Project</h3>
                    <p>Name: {course.project.name}</p>
                    <p>Presentation File: <a href={course.project.presentationFile} className="text-blue-500">Link</a></p>
                    <p>Source Code: <a href={course.project.sourceCode} className="text-blue-500">Link</a></p>
                    {course.project.documents.length > 0 && (
                        <div>
                            <h4 className="text-lg font-bold mt-2 mb-1">Project Documents</h4>
                            {course.project.documents.map((doc, index) => (
                                <p key={index}><a href={doc.link} className="text-blue-500">{doc.name}</a></p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {course.slides.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mt-4 mb-2">Slides</h3>
                    {course.slides.map((slide, index) => (
                        <p key={index}><a href={slide.link} className="text-blue-500">{slide.name}</a></p>
                    ))}
                </div>
            )}

            {course.labs.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mt-4 mb-2">Labs</h3>
                    {course.labs.map((lab, index) => (
                        <p key={index}><a href={lab.link} className="text-blue-500">{lab.name}</a></p>
                    ))}
                </div>
            )}

            {course.submissions.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold mt-4 mb-2">Submissions</h3>
                    {course.submissions.map((submission, index) => (
                        <p key={index}><a href={submission.link} className="text-blue-500">{submission.name}</a></p>
                    ))}
                </div>
            )}
        </div>
    );
}