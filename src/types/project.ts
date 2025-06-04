export interface Technology {
  id: string
  name: string
  url: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  excerpt: string
  thumbnail: string
  techStack: string[]
  status: boolean
  githubUrl?: string
  demoUrl?: string
  docsUrl?: string
  views: number
  likes: number
  isLikedByUser: boolean
  isPinned: boolean
  isHidden: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectsResponse {
  projects: Project[];
  metadata: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
} 