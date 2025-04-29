'use client'

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
import { Loader2, Plus, Search } from "lucide-react";
import { format } from "date-fns";

interface Series {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    posts: number;
  };
}

export default function SeriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["series", page, search],
    queryFn: async () => {
      const response = await fetch(
        `/api/series?page=${page}&limit=${limit}&search=${search}&includeInactive=true`
      );
      if (!response.ok) throw new Error("Failed to fetch series");
      return response.json();
    },
  });

  const seriesList: Series[] = data?.series || [];
  const metadata = data?.metadata;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Series</h1>
        <Button onClick={() => router.push("/admin/series/add-series")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Series
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search series..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seriesList.map((series) => (
                <TableRow key={series.id}>
                  <TableCell className="font-medium">{series.title}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {series.description}
                  </TableCell>
                  <TableCell>{series._count.posts}</TableCell>
                  <TableCell>
                    {series.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(series.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/admin/series/edit-series/${series.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/admin/series/manage-posts/${series.id}`)}
                      >
                        Manage Posts
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {metadata && (
            <div className="flex justify-between items-center mt-4">
              <div>
                Showing {seriesList.length} of {metadata.total} series
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= metadata.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
