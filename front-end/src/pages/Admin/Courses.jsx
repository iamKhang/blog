import React from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPlus, faRotateRight } from '@fortawesome/free-solid-svg-icons';

export default function Courses() {
    const { register, handleSubmit, control, formState: { errors } } = useForm();

    const onSubmit = data => {
        axios.post('http://localhost:3000/api/courses/add', data)
            .then(response => {
                console.log(response.data);
                // Handle success here
            })
            .catch(error => {
                console.error(error);
                // Handle error here
            });
    };


    const { fields, append, remove } = useFieldArray({
        control,
        name: "referenceDocuments"
    });
    const { fields: exerciseFields, append: appendExercise, remove: removeExercise } = useFieldArray({
        control,
        name: "exercises"
    });

    const { fields: slideFields, append: appendSlide, remove: removeSlide } = useFieldArray({
        control,
        name: "slides"
    });

    const { fields: labFields, append: appendLab, remove: removeLab } = useFieldArray({
        control,
        name: "labs"
    });

    const { fields: submissionFields, append: appendSubmission, remove: removeSubmission } = useFieldArray({
        control,
        name: "submissions"
    });

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "project.documents"
    });


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className='flex justify-between items-center'>
                    <div>
                        <label>Học kỳ: <span className="text-red-500">*</span></label>
                        <select {...register('semester', { required: "Học kỳ là bắt buộc" })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
                            <option value="">Chọn học kỳ</option>
                            <option value="Học kỳ 1">Học kỳ 1</option>
                            <option value="Học kỳ 2">Học kỳ 2</option>
                            <option value="Học kỳ 3">Học kỳ 3</option>
                        </select>
                        {errors.semester && <p>{errors.semester.message}</p>}
                    </div>

                    <div>
                        <label>Năm học: <span className="text-red-500">*</span></label>
                        <select {...register('academicYear', { required: "Năm học là bắt buộc" })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
                            <option value="">Chọn năm học: </option>
                            <option value="2021 - 2022">2021 - 2022</option>
                            <option value="2022 - 2023">2022 - 2023</option>
                            <option value="2023 - 2024">2023 - 2024</option>
                            <option value="2024 - 2025">2024 - 2025</option>
                            <option value="2025 - 2026">2025 - 2026</option>
                        </select>
                        {errors.academicYear && <p>{errors.academicYear.message}</p>}
                    </div>
                    <div>
                        <label>Số tín chỉ: <span className="text-red-500">*</span></label>
                        <select {...register('credits', { required: "Số tín chỉ là bắt buộc" })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4">
                            <option value="">Chọn số tín chỉ</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="8">8</option>
                        </select>
                        {errors.credits && <p>{errors.credits.message}</p>}
                    </div>
                    <div className='flex justify-between '>

                        <div className="mr-3">
                            <label>Tên môn học: <span className="text-red-500">*</span></label>
                            <input {...register('subjectName', { required: "Tên môn học không được bỏ trống" })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" placeholder="Tên môn học" />
                            {errors.subjectName && <p>{errors.subjectName.message}</p>}
                        </div>

                        <div className="">
                            <label>Giảng viên <span className="text-red-500">*</span></label>
                            <input {...register('lecturer', { required: "Giảng viên không được bỏ trống" })} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" placeholder="Giảng viên" />
                            {errors.lecturer && <p>{errors.lecturer.message}</p>}
                        </div>
                    </div>
                </div>


                <div>
                    <h2 className='font-semibold'>Tài liệu tham thảo: </h2>
                    {fields.map((item, index) => (
                        <div key={item.id} className='flex items-stretch justify-between'>
                            <input {...register(`referenceDocuments.${index}.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Name" />
                            <input {...register(`referenceDocuments.${index}.link`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Link" />
                            <button className='py-2 mb-4' type="button" onClick={() => remove(index)}>
                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                            </button>
                        </div>
                    ))}
                    <button className='btn btn-primary' type="button" onClick={() => append({ name: "", link: "" })}>
                        <FontAwesomeIcon className='text-green-700' icon={faPlus} />

                        Tài liệu</button>
                </div>

                <div>
                    <h2 className='font-semibold'>Bài tập: </h2>
                    {exerciseFields.map((item, index) => (
                        <div key={item.id} className='flex items-stretch justify-between'>
                            <input {...register(`exercises.${index}.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Name" />
                            <input {...register(`exercises.${index}.link`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Link" />
                            <button className='py-2 mb-4' type="button" onClick={() => removeExercise(index)}>
                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => appendExercise({ name: "", link: "" })}>                        <FontAwesomeIcon className='text-green-700' icon={faPlus} />
                        Bài tập</button>
                </div>

                <div>
                    <h2 className='font-semibold'>Slides</h2>
                    {slideFields.map((item, index) => (
                        <div key={item.id} className='flex items-stretch justify-between'>
                            <input {...register(`slides.${index}.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Name" />
                            <input {...register(`slides.${index}.link`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Link" />
                            <button className='py-2 mb-4' type="button" onClick={() => removeSlide(index)}>
                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => appendSlide({ name: "", link: "" })}>
                        <FontAwesomeIcon className='text-green-700' icon={faPlus} />
                        Slide</button>
                </div>

                <div>
                    <h2 className='font-semibold'>Bài tập thực hành: </h2>
                    {labFields.map((item, index) => (
                        <div key={item.id} className='flex items-stretch justify-between'>
                            <input {...register(`labs.${index}.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Name" />
                            <input {...register(`labs.${index}.link`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Link" />
                            <button className='py-2 mb-4' type="button" onClick={() => removeLab(index)}>
                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => appendLab({ name: "", link: "" })}>                        <FontAwesomeIcon className='text-green-700' icon={faPlus} />
                        Bài tập</button>
                </div>

                <div>
                    <h2 className='font-semibold'>Project:</h2>
                    <div className='flex justify-between items-center'>
                        <label className='w-40 py-2 mb-4'>Đề tài:</label>
                        <input {...register(`project.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Project Name" />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className='w-40 py-2 mb-4'>File trình chiếu:</label>
                        <input {...register(`project.presentationFile`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Presentation File" />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className='w-40 py-2 mb-4'>Source code:</label>
                        <input {...register(`project.sourceCode`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Source Code" />
                    </div>
                    <h3>Tài liệu báo cáo: </h3>
                    {projectFields.map((item, index) => (
                        <div key={item.id} className='flex items-stretch justify-between'>
                            <input {...register(`project.documents.${index}.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Document Name" />
                            <input {...register(`project.documents.${index}.link`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Document Link" />
                            <button className='py-2 mb-4' type="button" onClick={() => removeProject(index)}>
                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => appendProject({ name: "", link: "" })}><FontAwesomeIcon className='text-green-700' icon={faPlus} /> Tài liệu</button>
                </div>

                <div>
                    {/* Your existing form fields... */}
                    <h2 className='font-semibold'>Bài nộp: </h2>
                    {submissionFields.map((item, index) => (
                        <div key={item.id} className='flex items-stretch justify-between'>
                            <input {...register(`submissions.${index}.name`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Name" />
                            <input {...register(`submissions.${index}.link`)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4 mr-2" placeholder="Link" />
                            <button className='py-2 mb-4' type="button" onClick={() => removeSubmission(index)}>
                                <FontAwesomeIcon className='text-red-600' icon={faTrashCan} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => appendSubmission({ name: "", link: "" })}>
                        <FontAwesomeIcon className='text-green-700' icon={faPlus} />
                        Bài nộp
                    </button>
                </div>



                <div className="flex justify-center">
                    <button type="submit" className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
                    <button type="" className="mx-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        <FontAwesomeIcon icon={faRotateRight} /> Reset
                    </button>
                </div>
            </form>
        </div>
    );
}