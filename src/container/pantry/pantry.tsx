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
    const itemDetails = items.map(item => `${item.name}: ${item.quantity}`).join(", ");
    console.log("API Key:", process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const recipeContent = data.choices[0]?.message?.content || "No recipe found.";
        setRecipe(recipeContent);
      } else {
        console.error("Failed to fetch recipe");
      }
    } catch (error) {
      console.error("Error fetching recipe", error);
    }finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Pantry Items</h2>

        {/* Camera Button */}
        {!isCameraOpen && (
          <button
            onClick={() => setIsCameraOpen(true)}
            className="px-4 py-2 m-2 text-sm rounded-full font-bold text-white bg-blue-500 transition-all duration-300 hover:bg-blue-700 flex items-center"
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
                d="M3 4a2 2 0 012-2h3l1 2h8l1-2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c1.933 0 3.5 1.567 3.5 3.5S13.933 18 12 18s-3.5-1.567-3.5-3.5S10.067 11 12 11z"
              />
            </svg>
            Open Camera
          </button>
        )}

        {/* Camera Component */}
        {isCameraOpen && (
          <>
            <Camera
              ref={camera}
              aspectRatio={16 / 9}
              facingMode="environment"
            />
            <button
              onClick={handleTakePicture}
              className="px-4 py-2 m-2 text-sm rounded-full font-bold text-white bg-green-500 transition-all duration-300 hover:bg-green-700"
            >
              Take Picture
            </button>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="px-4 py-2 m-2 text-sm rounded-full font-bold text-white bg-blue-500 transition-all duration-300 hover:bg-blue-700"
        />

        {imageUrl && <img src={imageUrl} alt="Preview" className="mt-4" />}

        {/* Add Item Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              placeholder="Item Name"
              className="px-4 py-2 border rounded"
            />
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="px-4 py-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-full font-bold text-white bg-green-500 transition-all duration-300 hover:bg-green-700"
          >
            Add Item
          </button>
        </form>
      </div>

      <div className="font-sans p-4 mx-auto xl:max-w-7xl lg:max-w-5xl md:max-w-3xl max-w-md">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-16">
          Pantry Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              className="bg-gray-100 p-2 overflow-hidden cursor-pointer"
              key={item.id}
            >
              <div className="bg-white flex flex-col h-full">
                <div className="w-full h-[250px] overflow-hidden mx-auto aspect-w-16 aspect-h-8">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="p-6 text-center flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h3>
                  <h4 className="text-xl text-gray-800 font-bold mt-3">
                    Quantity: {item.quantity}
                  </h4>
                </div>
                <button
                  className="px-4 py-2 mb-4 text-sm rounded-full font-bold text-white bg-blue-500 transition-all duration-300 hover:bg-blue-700"
                  onClick={() => handleEdit(item.id)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 text-sm rounded-full font-bold text-white bg-red-500 transition-all duration-300 hover:bg-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

       
      </div>
      <button onClick={suggestRecipe} disabled={loading} className="px-4 py-2 text-sm rounded-full font-bold text-white bg-green-500 transition-all duration-300 hover:bg-green-700">
        {loading ? 'Loading...' : 'Suggest Recipe'}
      </button>
      
      {loading && <p>Loading your recipe, please wait...</p>}
      
      {recipe && (
        <div className="mt-4 p-4 bg-gray-200 rounded">
          <h3>Suggested Recipe:</h3>
          <p>{recipe}</p>
        </div>
      )}

      {/* <button
        onClick={suggestRecipe}
        className="px-4 py-2 text-sm rounded-full font-bold text-white bg-green-500 transition-all duration-300 hover:bg-green-700"
      >
        Suggest Recipe
      </button>
      
      {recipe && <div className="mt-4 p-4 bg-gray-200 rounded">{recipe}</div>} */}
    </div>
  );
};

export default PantryItemList;
