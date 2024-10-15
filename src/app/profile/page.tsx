"use client";

import { useEffect, useState } from "react";
import axios from "../../utils/axiosClient";
import { useSession } from "next-auth/react";

interface FavoriteMovie {
  id: string;
  movieId: number;
  rating: number;
}

interface Review {
  id: string;
  movieId: number;
  content: string;
  rating: number;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!session) return;

    const fetchFavorites = async () => {
      const userId = session.user.id;
      const response = await axios.get(`/api/favorites?userId=${userId}`);
      setFavorites(response.data);
    };

    const fetchReviews = async () => {
      const userId = session.user.id;
      const response = await axios.get(`/api/reviews?userId=${userId}`);
      setReviews(response.data);
    };

    fetchFavorites();
    fetchReviews();
  }, [session]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Favorite Movies</h1>
      <div className="grid grid-cols-3 gap-4">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="card">
            <h2>Movie ID: {favorite.movieId}</h2>
            <h3>Rating: {favorite.rating}</h3>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold mt-8">My Reviews</h1>
      <div className="grid grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="card">
            <h2>Movie ID: {review.movieId}</h2>
            <p>Review: {review.content}</p>
            <h3>Rating: {review.rating}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
