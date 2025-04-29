"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen } from "lucide-react";

interface Series {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  slug: string;
  _count: {
    posts: number;
  };
}

const SeriesCard = ({ series }: { series: Series }) => (
  <Card className="flex flex-col h-full">
    <Link href={`/series/${series.slug}`}>
      <CardHeader className="p-0">
        <Image
          src={series.coverImage || "/placeholder-series.jpg"}
          alt={series.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="flex-grow p-4 flex flex-col">
        <CardTitle className="text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
          {series.title}
        </CardTitle>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow min-h-[4.5rem]">
          {series.description}
        </p>
      </CardContent>
    </Link>
    <CardFooter className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center space-x-2">
        <BookOpen size={16} />
        <span className="text-sm">{series._count.posts} posts</span>
      </div>
    </CardFooter>
  </Card>
);

export default function SeriesPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const seriesPerPage = 6;

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(
          `/api/series?page=${currentPage}&limit=${seriesPerPage}`
        );
        if (!response.ok) throw new Error("Failed to fetch series");
        const data = await response.json();
        setSeriesList(data.series);
        setTotalPages(data.metadata.totalPages);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Series</h1>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {seriesList.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>

        {seriesList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No series found</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </section>
    </div>
  );
}
