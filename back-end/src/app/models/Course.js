// Path: back-end/app/models/Course.js

const  mongoose = require('mongoose');
// const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-plugin');




const CourseSchema = new mongoose.Schema({
    semester: { type: String, required: true },
    academicYear: { type: String, required: true },
    subjectName: { type: String, required: true },
    credits: { type: String, required: true },
    lecturer: { type: String, required: true },
    referenceDocuments: [
        {
            name: { type: String, required: false },
            link: { type: String, required: false }
        }
    ],
    exercises: [
        {
            name: { type: String, required: false },
            link: { type: String, required: false }
        }
    ],
    project: {
        name: { type: String, required: false },
        presentationFile: { type: String, required: false },
        documents: [
            {
                name: { type: String, required: false },
                link: { type: String, required: false }
            }
        ],
        sourceCode: { type: String, required: false }
    },
    slides: [
        {
            name: { type: String, required: false },
            link: { type: String, required: false }
        }
    ],
    labs: [
        {
            name: { type: String, required: false },
            link: { type: String, required: false }
        }
    ],
    submissions: [
        {
            name: { type: String, required: false },
            link: { type: String, required: false }
        }
    ]
  });
  
// Add plugins
// CourseSchema.plugin(slug);
CourseSchema.plugin(slug, { tmpl: '<%=subjectName%>' });
// CourseSchema.plugin(mongooseDelete, {
//     deletedAt: true,
//     overrideMethods: 'all',
// });

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;