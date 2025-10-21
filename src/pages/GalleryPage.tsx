import React, { useState, useEffect } from "react";
// ⚠️ NEW: Import the Play icon
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface GalleryItem {
  _id: string;
  title?: string;
  category?: string;
  image: string;
  mediaType?: "image" | "video";
  description?: string;
  date: string;
  __v: number;
}

const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // const API_BASE_URL = "https://itekconstruction.onrender.com/api/gallery";
  const API_BASE_URL = "https://onapalbackend.onrender.com/api/gallery"

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GalleryItem[] = await response.json();

        const sortedData = [...data].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setGalleryItems(sortedData);
      } catch (err: unknown) {
        console.error("Failed to fetch gallery items:", err);
        if (err instanceof Error) {
          setError("Failed to load gallery. Please try again later.");
        } else {
          setError("Failed to load gallery due to an unknown error.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // --- Dynamic Categories ---
  const uniqueCategories = [
    "All",
    ...new Set(
      galleryItems.map((item) => item.category).filter(Boolean) as string[]
    ),
  ];

  // --- Filtering Logic ---
  const filteredProjects =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  // --- Image Navigation Logic ---
  const nextImage = () => {
    if (selectedImageId !== null) {
      const currentIndex = filteredProjects.findIndex(
        (p) => p._id === selectedImageId
      );
      const nextIndex = (currentIndex + 1) % filteredProjects.length;
      setSelectedImageId(filteredProjects[nextIndex]._id);
    }
  };

  const prevImage = () => {
    if (selectedImageId !== null) {
      const currentIndex = filteredProjects.findIndex(
        (p) => p._id === selectedImageId
      );
      const prevIndex =
        (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
      setSelectedImageId(filteredProjects[prevIndex]._id);
    }
  };

  const selectedProject = galleryItems.find((p) => p._id === selectedImageId);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-gray-700">
        Loading gallery...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-teal-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Project Gallery</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of completed road construction projects
              showcasing our expertise in highways, urban roads, and bridge
              construction.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length === 0 && activeCategory !== "All" ? (
            <p className="text-center text-gray-600 text-xl">
              No projects found for the category "{activeCategory}".
            </p>
          ) : filteredProjects.length === 0 && activeCategory === "All" ? (
            <p className="text-center text-gray-600 text-xl">
              No gallery items available. Please add some from the admin
              dashboard.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => {
                const hasTextContent =
                  project.title || project.category || project.description;

                return (
                  <div
                    key={project._id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col"
                    style={{ height: hasTextContent ? "auto" : "300px" }}
                    onClick={() => setSelectedImageId(project._id)}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        hasTextContent ? "h-64" : "flex-grow"
                      }`}
                    >
                      {/* ⚠️ MODIFIED: Conditional Rendering with Play Button Overlay */}
                      {project.mediaType === "video" ? (
                        <>
                          <video
                            src={project.image}
                            className={`w-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                              hasTextContent ? "h-full" : "absolute inset-0 h-full"
                            }`}
                            style={{ objectFit: "cover" }}
                            muted
                            autoPlay
                            loop
                            playsInline
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-colors duration-300">
                            <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={project.image}
                          alt={project.title || "Gallery Image"}
                          className={`w-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                            hasTextContent ? "h-full" : "absolute inset-0 h-full"
                          }`}
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src =
                              "https://placehold.co/400x300/e0e0e0/555555?text=Image+Not+Found";
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>

                    {hasTextContent && (
                      <div className="p-6 flex-shrink-0">
                        {project.category && (
                          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-600 text-xs font-medium rounded-full mb-2">
                            {project.category}
                          </span>
                        )}
                        {project.title && (
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {project.title}
                          </h3>
                        )}
                        {project.description && (
                          <p className="text-gray-600 line-clamp-3">
                            {project.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedImageId && selectedProject && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImageId(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="bg-white rounded-xl overflow-hidden">
              {/* ⚠️ MODIFIED: Conditional Rendering in the Modal */}
              {selectedProject.mediaType === "video" ? (
                <video
                  src={selectedProject.image}
                  controls
                  className="w-full h-96 object-cover"
                />
              ) : (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title || "Gallery Image"}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src =
                      "https://placehold.co/800x600/e0e0e0/555555?text=Image+Not+Found";
                  }}
                />
              )}
              <div className="p-6">
                {selectedProject.category && (
                  <span className="inline-block px-3 py-1 bg-orange-100 text-teal-600 text-xs font-medium rounded-full mb-2">
                    {selectedProject.category}
                  </span>
                )}
                {selectedProject.title && (
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {selectedProject.title}
                  </h3>
                )}
                {selectedProject.description && (
                  <p className="text-gray-600">{selectedProject.description}</p>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="h-12 w-12" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="h-12 w-12" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;