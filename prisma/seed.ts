const { PrismaClient } = require('@prisma/client')
const { ObjectId } = require('mongodb')

const prisma = new PrismaClient()

const seedData = {
  profile: {
    id: new ObjectId().toString(),
    name: "Le Hoang Khang",
    title: "Full Stack Developer",
    bio: "I am a passionate Full Stack Developer with expertise in modern web technologies. I love building scalable applications and solving complex problems. With a strong foundation in both frontend and backend development, I strive to create efficient and user-friendly solutions.",
    avatar: "https://avatars.githubusercontent.com/u/your-github-id",
    email: "your.email@example.com",
    location: "Ho Chi Minh City, Vietnam",
    skills: [
      {
        name: "React",
        category: "Frontend",
        level: 5
      },
      {
        name: "Next.js",
        category: "Frontend",
        level: 5
      },
      {
        name: "TypeScript",
        category: "Language",
        level: 4
      },
      {
        name: "Node.js",
        category: "Backend",
        level: 4
      },
      {
        name: "MongoDB",
        category: "Database",
        level: 4
      },
      {
        name: "Prisma",
        category: "ORM",
        level: 4
      },
      {
        name: "Tailwind CSS",
        category: "Styling",
        level: 5
      }
    ],
    socialLinks: [
      {
        platform: "GitHub",
        url: "https://github.com/your-username"
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/your-username"
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/your-username"
      }
    ],
    education: [
      {
        school: "University of Technology",
        degree: "Bachelor of Computer Science",
        field: "Software Engineering",
        startDate: new Date("2018-09-01T00:00:00.000Z"),
        endDate: new Date("2022-06-30T00:00:00.000Z"),
        description: "Focused on software development, algorithms, and data structures. Participated in various hackathons and coding competitions."
      }
    ],
    experience: [
      {
        company: "Tech Company A",
        position: "Full Stack Developer",
        startDate: new Date("2022-07-01T00:00:00.000Z"),
        endDate: null,
        description: "Working on building and maintaining web applications using React, Next.js, and Node.js. Implementing new features and optimizing performance."
      },
      {
        company: "Startup B",
        position: "Frontend Developer Intern",
        startDate: new Date("2021-06-01T00:00:00.000Z"),
        endDate: new Date("2022-05-31T00:00:00.000Z"),
        description: "Developed user interfaces and implemented responsive designs. Collaborated with the team to deliver high-quality products."
      }
    ]
  }
}

async function main() {
  try {
    // Create profile with related data
    const profile = await prisma.profile.create({
      data: {
        id: seedData.profile.id,
        name: seedData.profile.name,
        title: seedData.profile.title,
        bio: seedData.profile.bio,
        avatar: seedData.profile.avatar,
        email: seedData.profile.email,
        location: seedData.profile.location,
        skills: {
          create: seedData.profile.skills
        },
        socialLinks: {
          create: seedData.profile.socialLinks
        },
        education: {
          create: seedData.profile.education
        },
        experience: {
          create: seedData.profile.experience
        }
      }
    })

    console.log('Profile created successfully:', profile)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 