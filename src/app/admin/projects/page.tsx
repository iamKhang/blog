"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Search, Edit, Eye, Calendar, Code } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  excerpt: string;
  status: boolean;
  techStack: string[];
  isPinned: boolean;
  isHidden: boolean;
  createdAt: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["projects", page, search],
    queryFn: async () => {
      const response = await fetch(
        `/api/projects?page=${page}&limit=${limit}&search=${search}`
      );
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

  const projects: Project[] = data?.projects || [];
  const metadata = data?.metadata;

  return (
    <div className="h-full flex flex-col min-h-0 p-6 space-y-6 bg-background">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your projects
          </p>
        </div>
        <Button 
          onClick={() => router.push("/admin/projects/add-project")}
          className="bg-primary hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>

      {/* Search Section */}
      <div className="flex items-center space-x-2 bg-card p-4 rounded-lg shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by title, description, or technologies..."
            className="pl-10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-card rounded-lg shadow-sm border flex-1 min-h-0 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead className="w-[20%]">Technologies</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Created At</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm">Create your first project to get started</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow 
                      key={project.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="line-clamp-1">{project.title}</span>
                          <span className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {project.excerpt}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack && project.techStack.length > 0 ? (
                            project.techStack.slice(0, 3).map((tech, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="bg-secondary/50 hover:bg-secondary/70 transition-colors"
                              >
                                <Code className="h-3 w-3 mr-1" />
                                {tech.trim()}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">No technologies</span>
                          )}
                          {project.techStack.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.techStack.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          {project.isPinned && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                              Pinned
                            </Badge>
                          )}
                          {project.isHidden && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                              Hidden
                            </Badge>
                          )}
                          <Badge
                            variant={project.status ? "default" : "secondary"}
                            className={cn(
                              project.status 
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            )}
                          >
                            {project.status ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(project.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/projects/edit/${project.id}`)}
                            className="hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/projects/${project.id}`)}
                            className="hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      {metadata && (
        <div className="flex justify-between items-center bg-card p-4 rounded-lg shadow-sm">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, metadata.total || 0)} of{" "}
            {metadata.total || 0} projects
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="hover:bg-muted"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === metadata.totalPages}
              onClick={() => setPage(page + 1)}
              className="hover:bg-muted"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 