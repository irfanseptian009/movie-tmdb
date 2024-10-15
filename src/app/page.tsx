"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFavorite } from "./store";
import axios from "../utils/axiosClient";
import MovieList from "../components/MovieList";
import Loader from "../components/Loader";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string; // Tahun rilis film
  vote_average: number; // Rating film
}

export default function HomePage() {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [visible, setVisible] = useState(6); // Jumlah film yang ditampilkan
  const [searchTerm, setSearchTerm] = useState(""); // Kata kunci pencarian
  const [filter, setFilter] = useState("none"); // Filter untuk penyaringan film
  const [loading, setLoading] = useState(true); // Status loading
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Ambil data film yang sedang tayang
        const nowPlayingResponse = await axios.get("/movie/now_playing");
        setNowPlaying(nowPlayingResponse.data.results.slice(0, 6));

        // Ambil data film populer
        const popularResponse = await axios.get("/movie/popular");
        setPopular(popularResponse.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies(); // Panggil fungsi untuk mengambil data film
  }, []);

  const loadMore = () => setVisible((prev) => prev + 6); // Load lebih banyak film

  // Filter dan urutkan film berdasarkan input pencarian dan filter
  const filteredPopularMovies = popular
    .filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (filter === "rating") {
        return b.vote_average - a.vote_average; // Sort berdasarkan rating
      }
      if (filter === "release_date") {
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime(); // Sort berdasarkan tanggal rilis
      }
      return 0; // Tanpa sorting
    });

  if (loading) {
    return <Loader />; // Tampilkan loader saat data sedang dimuat
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Now Playing</h1>
      <MovieList movies={nowPlaying} />

      <h1 className="text-2xl font-bold mt-8">Popular Movies</h1>
      <input
        type="text"
        placeholder="Search for a movie..."
        className="border p-2 mb-2 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update kata kunci pencarian
      />
      <select
        className="border p-2 mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Update filter
      >
        <option value="none">No Filter</option>
        <option value="rating">Sort by Rating</option>
        <option value="release_date">Sort by Release Date</option>
      </select>
      <MovieList movies={filteredPopularMovies.slice(0, visible)} />
      {visible < filteredPopularMovies.length && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
}
