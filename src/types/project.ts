export interface Technology {
  id: string
  name: string
  url: string
}

export interface Project {
  id: string
  title: string
  description: string
  excerpt: string
  thumbnail: string
  technologies: Technology[]
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'
  githubUrl?: string
  demoUrl?: string
  docsUrl?: string
  views: number
  likes: number
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