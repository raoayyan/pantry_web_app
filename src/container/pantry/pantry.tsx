"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { storage } from "@/lib/firebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  imageUrl: string;
}

const PantryItemList: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; quantity: number }>({
    name: "",
    quantity: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const camera = useRef<any>(null);

  const handleTakePicture = () => {
    const image = camera.current.takePhoto();
    setImageUrl(image);
    setIsCameraOpen(false); // Close camera after taking picture
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string); // Set the image URL state with the uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/pantry");
        const data: PantryItem[] = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch pantry items", error);
      }
    };

    fetchItems();
  }, []);

  const handleEdit = (id: string) => {
    console.log(`Edit item with id: ${id}`);
    // Add your edit functionality here
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/pantry?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems(items.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete pantry item");
      }
    } catch (error) {
      console.error("Error deleting pantry item", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newItem.name.trim() === "" || newItem.quantity <= 0 || !imageUrl) {
      setError("Please enter a valid name, quantity, and take a picture.");
      return;
    }

    try {
      // Upload image to Firebase
      const storageRef = ref(
        storage,
        `images/${newItem.name}-${Date.now()}.jpg`
      );
      await uploadString(storageRef, imageUrl, "data_url");
      const downloadURL = await getDownloadURL(storageRef);

      // Include the image URL in the pantry item data
      const pantryItemWithImage = {
        ...newItem,
        imageUrl: downloadURL,
      };

      const response = await fetch("/api/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pantryItemWithImage),
      });

      if (response.ok) {
        const addedItem = await response.json();
        setItems([...items, addedItem]);
        setNewItem({ name: "", quantity: 0 });
        setImageUrl(null);
        setError(null);
      } else {
        console.error("Failed to add pantry item");
      }
    } catch (error) {
      console.error("Error adding pantry item", error);
    }
  };

  const suggestRecipe = async () => {
    setLoading(true); // Start loading
    setRecipe(null); // Clear previous recipe
    const itemDetails = items
      .map((item) => `${item.name}: ${item.quantity}`)
      .join(", ");

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "qwen/qwen-2-7b-instruct:free",
            messages: [
              {
                role: "user",
                content: `Suggest a recipe using these ingredients: ${itemDetails}`,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const recipeContent =
          data.choices[0]?.message?.content || "No recipe found.";
        setRecipe(recipeContent);
      } else {
        console.error("Failed to fetch recipe");
      }
    } catch (error) {
      console.error("Error fetching recipe", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-12 animate-fade-in-down">
          My Smart Pantry
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8 animate-fade-in-up">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Add New Item
          </h2>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            {!isCameraOpen && (
              <button
                onClick={() => setIsCameraOpen(true)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Open Camera
              </button>
            )}

            <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {isCameraOpen && (
            <div className="mb-6">
              <Camera
                ref={camera}
                aspectRatio={16 / 9}
                facingMode="environment"
                // className="rounded-lg overflow-hidden"
              />
              <button
                onClick={handleTakePicture}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Take Picture
              </button>
            </div>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-4 rounded-lg shadow-md max-w-full h-auto"
            />
          )}

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                name="name"
                value={newItem.name}
                onChange={handleChange}
                placeholder="Item Name"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="w-full md:w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add Item
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="relative pb-2/3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="relative h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 mb-4">Quantity: {item.quantity}</p>
                <div className="flex space-x-2">
                  <button
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
                    onClick={() => handleEdit(item.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={suggestRecipe}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating Recipe..." : "Suggest Recipe"}
          </button>

          {loading && (
            <p className="mt-4 text-gray-600 animate-pulse">
              Creating a delicious recipe just for you...
            </p>
          )}

          {recipe && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-xl animate-fade-in">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                Suggested Recipe:
              </h3>
              <p className="text-gray-600 ">{recipe}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantryItemList;
