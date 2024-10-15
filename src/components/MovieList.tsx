"use client";

import { useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../app/store";
import axios from "../utils/axiosClient";
import { toast } from "react-toastify";
import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string; // Tambahkan tahun rilis jika diperlukan
  vote_average: number; // Tambahkan rating jika diperlukan
}

interface MovieListProps {
  movies: Movie[];
}

export default function MovieList({ movies }: MovieListProps) {
  const dispatch = useDispatch();
  const [reviewContent, setReviewContent] = useState<{ [key: number]: string }>({});
  const [reviewRating, setReviewRating] = useState<{ [key: number]: number }>({});

  const handleAddFavorite = async (movie: Movie) => {
    // Dispatch action untuk menambahkan film ke favorit
    dispatch(addFavorite(movie));
    // Simpan ke database
    await axios.post("/api/favorites", { userId: "guest", movieId: movie.id });
    toast.success(`${movie.title} added to favorites!`);
  };

  const handleRemoveFavorite = async (id: string) => {
    // Hapus film dari database
    await axios.delete(`/api/favorites?id=${id}`);
    // Dispatch action untuk menghapus film dari favorit
    dispatch(removeFavorite(Number(id)));
    toast.error(`Movie removed from favorites!`);
  };

  const handleReviewSubmit = async (movieId: number) => {
    const content = reviewContent[movieId] || "";
    const rating = reviewRating[movieId] || 0;
    // Kirim ulasan ke API
    await axios.post("/api/reviews", { userId: "guest", movieId, content, rating });
    toast.success("Review submitted!");
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="card p-4 border rounded-lg shadow-lg">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-md"
          />
          <h2 className="font-semibold">{movie.title}</h2>
          <p>Release Date: {movie.release_date}</p>
          <p>Rating: {movie.vote_average}</p>
          <div className="flex space-x-2">
            <button
              onClick={() => handleAddFavorite(movie)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Add to Favorite
            </button>
            <button
              onClick={() => handleRemoveFavorite(movie.id.toString())}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Write a review..."
              className="border p-2 w-full"
              value={reviewContent[movie.id] || ""}
              onChange={(e) =>
                setReviewContent({ ...reviewContent, [movie.id]: e.target.value })
              }
            />
            <div>
              <span className="block">Rate this movie:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating({ ...reviewRating, [movie.id]: star })}
                  className={`text-xl ${
                    reviewRating[movie.id] >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              onClick={() => handleReviewSubmit(movie.id)}
              className="bg-green-500 text-white mt-2 px-2 py-1 rounded"
            >
              Submit Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
