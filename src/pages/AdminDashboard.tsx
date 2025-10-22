// src/pages/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = "onapal";
const CLOUDINARY_CLOUD_NAME = "dywd8r6rd";

type GalleryItem = {
  _id: string;
  title?: string;
  category?: string;
  description?: string;
  image?: string;
  mediaType?: string;
  date: string;
};

const AdminDashboard = () => {
  const auth = useAuth();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGalleryItem, setCurrentGalleryItem] =
    useState<GalleryItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMedia, setFormMedia] = useState<File | null>(null);
  const [formMediaPreview, setFormMediaPreview] = useState("");
  const [formMediaType, setFormMediaType] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const API_BASE_URL = "https://onapalbackend.onrender.com/api/gallery";

  useEffect(() => {
    if (auth && auth.token) {
      fetchGalleryItems();
    }
  }, [auth?.token]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!auth) {
    return (
      <div className="text-center p-12 text-xl text-teal-600">
        Error: Authentication context not available. This page should be
        protected.
      </div>
    );
  }
  const { token, user, logout } = auth;

  const fetchGalleryItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const data: GalleryItem[] = await response.json();
        const sortedData = [...data].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setGalleryItems(sortedData);
        setCurrentPage(1);
      } else {
        setError("Failed to fetch gallery items.");
      }
    } catch (err) {
      setError("Network error while fetching gallery items.");
      console.error("Fetch gallery items error:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const isVideo = file.type.startsWith("video/");
      const resourceType = isVideo ? "video" : "image";
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

      const response = await axios.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setUploadProgress(0);
      return { url: response.data.secure_url, mediaType: resourceType };
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error("Cloudinary upload error:", err);
      throw new Error("Failed to upload media to Cloudinary.");
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormMedia(file);
    if (file) {
      setFormMediaPreview(URL.createObjectURL(file));
      setFormMediaType(file.type.startsWith("video/") ? "video" : "image");
    } else {
      setFormMediaPreview("");
      setFormMediaType("");
    }
  };

  const openModal = (item: GalleryItem | null = null) => {
    setCurrentGalleryItem(item);
    setFormTitle(item ? item.title || "" : "");
    setFormCategory(item ? item.category || "" : "");
    setFormDescription(item ? item.description || "" : "");
    setFormMedia(null);
    setFormMediaType(item ? item.mediaType || "" : "");
    setFormMediaPreview(item && item.image ? item.image : "");
    setFormMessage("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentGalleryItem(null);
    setFormTitle("");
    setFormCategory("");
    setFormDescription("");
    setFormMedia(null);
    setFormMediaPreview("");
    setFormMediaType("");
    setFormMessage("");
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormMessage("");

    let mediaUrl = currentGalleryItem?.image;
    let mediaType = currentGalleryItem?.mediaType;

    if (formMedia) {
      try {
        const uploadResult = await uploadToCloudinary(formMedia);
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.mediaType;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message || "Failed to upload media."
            : typeof err === "object" && err !== null && "message" in err
            ? (err as { message?: string }).message ?? "Failed to upload media."
            : "Failed to upload media.";
        setFormMessage(message);
        return;
      }
    } else if (!currentGalleryItem) {
      setFormMessage("Please upload an image or video for new gallery items.");
      return;
    }

    const galleryData = {
      title: formTitle,
      category: formCategory,
      description: formDescription,
      image: mediaUrl,
      mediaType: mediaType,
    };

    const method = currentGalleryItem ? "PUT" : "POST";
    const url = currentGalleryItem
      ? `${API_BASE_URL}/${currentGalleryItem._id}`
      : API_BASE_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token ?? "",
        },
        body: JSON.stringify(galleryData),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Frontend: Failed to parse JSON response:", jsonError);
        setFormMessage("Server returned non-JSON response.");
        return;
      }

      if (response.ok) {
        setNotification({
          message:
            data.msg ||
            (currentGalleryItem
              ? "Item updated successfully!"
              : "Item added successfully!"),
          type: "success",
        });
        fetchGalleryItems();
        closeModal();
      } else {
        setFormMessage(data.msg || "Operation failed.");
      }
    } catch (err) {
      setFormMessage("Network error during operation.");
      console.error("Frontend: Fetch error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await new Promise((resolve) => {
      const confirmModal = document.createElement("div");
      confirmModal.className =
        "fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4";
      confirmModal.innerHTML = `
                <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm text-center">
                    <p class="text-xl font-semibold text-gray-800 mb-6">Are you sure you want to delete this item?</p>
                    <div class="flex justify-center space-x-4">
                        <button id="cancelDelete" class="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition duration-150 ease-in-out">Cancel</button>
                        <button id="confirmDelete" class="px-6 py-2 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-teal-600 hover:bg-teal-700 transition duration-150 ease-in-out">Delete</button>
                    </div>
                </div>
            `;
      document.body.appendChild(confirmModal);

      const cancelBtn = document.getElementById("cancelDelete");
      const confirmBtn = document.getElementById("confirmDelete");
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          document.body.removeChild(confirmModal);
          resolve(false);
        };
      }
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          document.body.removeChild(confirmModal);
          resolve(true);
        };
      }
    });

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "x-auth-token": token ?? "",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({
          message: data.msg || "Item deleted successfully.",
          type: "success",
        });
        fetchGalleryItems();
      } else {
        setNotification({
          message: data.msg || "Deletion failed.",
          type: "error",
        });
      }
    } catch (err) {
      setNotification({
        message: "Network error during deletion.",
        type: "error",
      });
      console.error("Delete gallery item error:", err);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = galleryItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(galleryItems.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-12 text-xl text-gray-700">
          Loading gallery items...
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-12 text-xl text-teal-600">
          Error: {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg shadow-xl text-white font-medium transition-all duration-300 ease-out transform ${
            notification.type === "success"
              ? "bg-green-500"
              : "bg-teal-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-xl font-extrabold text-gray-900 mb-4 md:mb-0">
            Admin Dashboard
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {user && (
              <span className="text-md text-gray-700 font-medium">
                Welcome, {user.email}!
              </span>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 text-xs bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        <button
          onClick={() => openModal()}
          className="mb-6 mt-4 px-6 py-2 text-sm bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-200"
        >
          Add New Gallery Item
        </button>

        {currentItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600 text-xl">
              No gallery items found. Click "Add New Gallery Item" to get started!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                >
                  {item.mediaType === "video" ? (
                    <video
                      src={item.image}
                      controls
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title || "Gallery Image"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src =
                          "https://placehold.co/400x300/e0e0e0/555555?text=Image+Not+Found";
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {item.title || "No Title"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-teal-600">
                        {item.category || "N/A"}
                      </span>
                    </p>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {item.description || "No description provided."}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="px-4 py-1 bg-yellow-500 text-white text-sm font-semibold rounded hover:bg-yellow-600 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-4 py-1 bg-teal-500 text-white text-sm font-semibold rounded hover:bg-teal-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentGalleryItem ? "Edit Gallery Item" : "Add New Gallery Item"}
                </h2>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="formTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      id="formTitle"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g., Office View"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formCategory"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category (Optional)
                    </label>
                    <input
                      type="text"
                      id="formCategory"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="e.g., Highways"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="formDescription"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="formDescription"
                      rows={3}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-teal-500 focus:ring-teal-500"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="A clear shot of an office building's facade..."
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="formMedia"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Media (Image or Video)
                      {!currentGalleryItem && (
                        <span className="text-teal-500"> *</span>
                      )}
                    </label>
                    <input
                      type="file"
                      id="formMedia"
                      accept="image/*,video/*"
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-teal-700 hover:file:bg-orange-100"
                      onChange={handleMediaChange}
                      required={!currentGalleryItem}
                    />
                    {formMediaPreview && (
                      <div className="mt-3">
                        {formMediaType === "video" ? (
                          <video
                            src={formMediaPreview}
                            controls
                            className="w-full h-40 rounded border border-gray-200 object-contain"
                          />
                        ) : (
                          <img
                            src={formMediaPreview}
                            alt="Media Preview"
                            className="w-full h-40 rounded border border-gray-200 object-contain"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {isUploading && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Uploading... {uploadProgress}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-teal-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {formMessage && (
                    <p
                      className={`text-sm ${
                        formMessage.includes("success")
                          ? "text-green-600"
                          : "text-teal-600"
                      }`}
                    >
                      {formMessage}
                    </p>
                  )}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading
                        ? `Uploading... ${uploadProgress}%`
                        : currentGalleryItem
                        ? "Update Item"
                        : "Add Item"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;