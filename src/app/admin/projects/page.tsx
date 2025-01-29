"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const fetchProjects = async () => {
  const response = await fetch("/api/projects");
  if (!response.ok) throw new Error("Failed to fetch projects");
  return response.json();
};

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/add-project">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Settings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project: any) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    project.status === "COMPLETED"
                      ? "default"
                      : project.status === "IN_PROGRESS"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech: any) => (
                    <Badge key={tech.id} variant="outline">
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(project.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {project.isPinned && <Badge>Pinned</Badge>}
                  {project.isHidden && <Badge variant="secondary">Hidden</Badge>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 