'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { VisuallyHidden } from "@/components/ui/visually-hidden"

// Định nghĩa kiểu dữ liệu cho tài liệu
interface Resource {
  id: string
  title: string
  description: string
  category: string // Thêm trường category để nhóm các môn học
  materials: {
    type: string
    items: {
      name: string
      link: string
    }[]
  }[]
}

// Dữ liệu mẫu được tổ chức theo category
const resources: Resource[] = [
  {
    id: "dsa",
    title: "Cấu trúc dữ liệu và Giải thuật",
    category: "Chuyên ngành",
    description: "Tài liệu học tập về Cấu trúc dữ liệu và Giải thuật",
    materials: [
      {
        type: "Slide bài giảng",
        items: [
          {
            name: "Lecture 1: Introduction to Algorithms",
            link: "#"
          },
          {
            name: "Lecture 2: Data Structures Basics",
            link: "#"
          }
        ]
      },
      {
        type: "Sách tham khảo",
        items: [
          {
            name: "Introduction to Algorithms - CLRS",
            link: "#"
          },
          {
            name: "Data Structures and Algorithms in Python",
            link: "#"
          }
        ]
      },
      {
        type: "Bài tập & Đề thi mẫu",
        items: [
          {
            name: "Practice Problems Set 1",
            link: "#"
          },
          {
            name: "Sample Exam 2023",
            link: "#"
          }
        ]
      }
    ]
  },
  {
    id: "tech-english",
    title: "Tiếng Anh chuyên ngành CNTT",
    category: "Ngoại ngữ",
    description: "Tài liệu học tiếng Anh chuyên ngành Công nghệ thông tin",
    materials: [
      {
        type: "Từ vựng chuyên ngành",
        items: [
          {
            name: "IT Vocabulary List",
            link: "#"
          }
        ]
      },
      {
        type: "Website học tập",
        items: [
          {
            name: "FreeCodeCamp English Resources",
            link: "#"
          }
        ]
      }
    ]
  },
  {
    id: "calculus",
    title: "Toán cao cấp",
    category: "Cơ sở",
    description: "Tài liệu học phần Toán cao cấp",
    materials: [
      {
        type: "Slide bài giảng",
        items: [
          {
            name: "Lecture 1: Introduction to Algorithms",
            link: "#"
          },
          {
            name: "Lecture 2: Data Structures Basics",
            link: "#"
          }
        ]
      },
      {
        type: "Sách tham khảo",
        items: [
          {
            name: "Introduction to Algorithms - CLRS",
            link: "#"
          },
          {
            name: "Data Structures and Algorithms in Python",
            link: "#"
          }
        ]
      },
      {
        type: "Bài tập & Đề thi mẫu",
        items: [
          {
            name: "Practice Problems Set 1",
            link: "#"
          },
          {
            name: "Sample Exam 2023",
            link: "#"
          }
        ]
      }
    ]
  }
]

export default function ResourcesPage() {
  const [selectedResource, setSelectedResource] = useState<string>(resources[0].id)

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  const currentResource = resources.find((r) => r.id === selectedResource)

  const ResourceList = () => (
    <ScrollArea className="h-[calc(100vh-200px)] rounded-lg border">
      <div className="p-4">
        {Object.entries(groupedResources).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
              {category.toUpperCase()}
            </h3>
            <div className="space-y-1">
              {items.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => setSelectedResource(resource.id)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                    selectedResource === resource.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {resource.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tài nguyên học tập</h1>
        <p className="text-muted-foreground">
          Tổng hợp các tài liệu học tập theo chủ đề
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-72 shrink-0">
          <ResourceList />
        </div>

        {/* Sidebar for small screens */}
        <div className="lg:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="mr-2 h-4 w-4" />
                Chọn tài nguyên
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle>Danh sách tài nguyên</SheetTitle>
              <ResourceList />
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {currentResource && (
            <Card>
              <CardHeader>
                <CardTitle>{currentResource.title}</CardTitle>
                <CardDescription>{currentResource.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentResource.materials.map((material, index) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-3">{material.type}</h3>
                    <ul className="space-y-2">
                      {material.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <a
                            href={item.link}
                            className="text-blue-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

