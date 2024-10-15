import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tipe data untuk film
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  rating?: number; // Tambahkan rating untuk film
}

// Tipe data untuk state favorit
interface FavoriteState {
  favorites: Movie[];
}

// Tipe data untuk rating film
interface RatingState {
  ratings: { [key: number]: number }; // Menyimpan rating untuk setiap film
}

// Inisialisasi state awal
const initialFavoriteState: FavoriteState = { favorites: [] };
const initialRatingState: RatingState = { ratings: {} };

// Slice untuk mengelola favorit film
const favoriteSlice = createSlice({
  name: "favorites",
  initialState: initialFavoriteState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Movie>) => {
      const exists = state.favorites.find((movie) => movie.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter((movie) => movie.id !== action.payload);
    },
  },
});

// Slice untuk mengelola rating film
const ratingSlice = createSlice({
  name: "ratings",
  initialState: initialRatingState,
  reducers: {
    setRating: (state, action: PayloadAction<{ movieId: number; rating: number }>) => {
      state.ratings[action.payload.movieId] = action.payload.rating;
    },
  },
});

// Menggabungkan reducer menjadi store
const store = configureStore({
  reducer: {
    favorites: favoriteSlice.reducer,
    ratings: ratingSlice.reducer,
  },
});

// Ekspor actions dan store
export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export const { setRating } = ratingSlice.actions;

// Tipe untuk RootState dan AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
