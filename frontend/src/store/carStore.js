// stores/carStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const useCarStore = create(
  persist(
    (set, get) => ({
      // State
      cars: [],
      filteredCars: [],
      selectedCar: null,
      brands: [],
      carStats: null,

      // UI State
      loading: false,
      error: null,

      // Pagination
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12,
      },

      // Filters
      filters: {
        brand: "",
        model: "",
        minPrice: "",
        maxPrice: "",
        transmission: "",
        fuelType: "",
        seats: "",
        minYear: "",
        maxYear: "",
        search: "",
        availability: true,
      },

      // Sorting
      sort: "-createdAt",

      // Selected filters for UI
      availableFilters: {
        brands: [],
        models: [],
        transmissions: [],
        fuelTypes: [],
        seats: [],
        years: [],
        priceRange: { min: 0, max: 1000 },
      },

      // ==================== CAR CRUD OPERATIONS ====================

      // Fetch all cars with filters and pagination
      fetchCars: async (page = 1, limit = 12) => {
        set({ loading: true, error: null });

        try {
          const { filters, sort } = get();
          const params = new URLSearchParams();

          // Pagination
          params.append("page", page);
          params.append("limit", limit);

          // Sorting
          if (sort) params.append("sort", sort);

          // Filters
          if (filters.brand) params.append("brand", filters.brand);
          if (filters.model) params.append("carModel", filters.model);
          if (filters.minPrice) params.append("minPrice", filters.minPrice);
          if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
          if (filters.transmission)
            params.append("transmission", filters.transmission);
          if (filters.fuelType) params.append("fuelType", filters.fuelType);
          if (filters.seats) params.append("seats", filters.seats);
          if (filters.minYear) params.append("minYear", filters.minYear);
          if (filters.maxYear) params.append("maxYear", filters.maxYear);
          if (filters.search) params.append("search", filters.search);
          if (
            filters.availability !== undefined &&
            filters.availability !== ""
          ) {
            params.append("availability", filters.availability);
          }

          const response = await axiosInstance.get(
            `/cars?${params.toString()}`,
          );

          set({
            cars: response.data.data.cars,
            filteredCars: response.data.data.cars,
            pagination: {
              currentPage: response.data.pagination?.currentPage || page,
              totalPages: response.data.pagination?.totalPages || 1,
              totalItems:
                response.data.pagination?.totalItems ||
                response.data.results ||
                0,
              itemsPerPage: limit,
            },
            availableFilters:
              response.data.filters?.available || get().availableFilters,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch cars",
            loading: false,
          });
          throw error;
        }
      },

      // Fetch single car by ID
      fetchCarById: async (id) => {
        set({ loading: true, error: null, selectedCar: null });

        try {
          const response = await axiosInstance.get(`/cars/${id}`);

          set({
            selectedCar: response.data.data.car,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to fetch car details",
            loading: false,
          });
          throw error;
        }
      },

      // Create new car (Admin only)
      createCar: async (carData) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.post("/cars", carData);

          // Add to cars list if on first page
          const { pagination } = get();
          if (pagination.currentPage === 1) {
            set((state) => ({
              cars: [response.data.data.car, ...state.cars],
              filteredCars: [response.data.data.car, ...state.filteredCars],
            }));
          }

          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to create car",
            loading: false,
          });
          throw error;
        }
      },

      // Update car (Admin only)
      updateCar: async (id, updateData) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(`/cars/${id}`, updateData);

          // Update in cars list
          set((state) => ({
            cars: state.cars.map((car) =>
              car._id === id ? response.data.data.car : car,
            ),
            filteredCars: state.filteredCars.map((car) =>
              car._id === id ? response.data.data.car : car,
            ),
            selectedCar:
              state.selectedCar?._id === id
                ? response.data.data.car
                : state.selectedCar,
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update car",
            loading: false,
          });
          throw error;
        }
      },

      // Delete car (Admin only)
      deleteCar: async (id, permanent = false) => {
        set({ loading: true, error: null });

        try {
          const url = permanent ? `/cars/${id}?permanent=true` : `/cars/${id}`;
          await axiosInstance.delete(url);

          // Remove from cars list
          set((state) => ({
            cars: state.cars.filter((car) => car._id !== id),
            filteredCars: state.filteredCars.filter((car) => car._id !== id),
            selectedCar:
              state.selectedCar?._id === id ? null : state.selectedCar,
            loading: false,
          }));

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to delete car",
            loading: false,
          });
          throw error;
        }
      },

      // Toggle car availability (Admin only)
      toggleAvailability: async (id, availability, reason = "") => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(
            `/cars/${id}/toggle-availability`,
            {
              availability,
              reason,
            },
          );

          // Update in cars list
          set((state) => ({
            cars: state.cars.map((car) =>
              car._id === id
                ? { ...car, availability: response.data.data.car.availability }
                : car,
            ),
            filteredCars: state.filteredCars.map((car) =>
              car._id === id
                ? { ...car, availability: response.data.data.car.availability }
                : car,
            ),
            selectedCar:
              state.selectedCar?._id === id
                ? {
                    ...state.selectedCar,
                    availability: response.data.data.car.availability,
                  }
                : state.selectedCar,
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to toggle car availability",
            loading: false,
          });
          throw error;
        }
      },

      // ==================== CAR STATISTICS ====================

      // Fetch car statistics (Admin only)
      fetchCarStatistics: async (period = "month", carId = null) => {
        set({ loading: true, error: null });

        try {
          let url = `/cars/statistics?period=${period}`;
          if (carId) url += `&carId=${carId}`;

          const response = await axiosInstance.get(url);

          set({
            carStats: response.data.data,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to fetch car statistics",
            loading: false,
          });
          throw error;
        }
      },

      // ==================== FILTERS AND BRANDS ====================

      // Fetch unique brands
      fetchBrands: async () => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get(
            "/cars/brands?includeCounts=true&includeModels=true",
          );

          set({
            brands:
              response.data.data.brandsWithDetails || response.data.data.brands,
            availableFilters: {
              ...get().availableFilters,
              brands:
                response.data.data.brandsWithDetails?.map((b) => b.name) ||
                response.data.data.brands,
            },
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch brands",
            loading: false,
          });
          throw error;
        }
      },

      // Get available filter options
      fetchFilterOptions: async () => {
        try {
          const response = await axiosInstance.get("/cars?limit=1");

          if (response.data.filters?.available) {
            set({
              availableFilters: response.data.filters.available,
            });
          }

          return response.data;
        } catch (error) {
          console.error("Failed to fetch filter options:", error);
        }
      },

      // ==================== UTILITY METHODS ====================

      // Set filter value
      setFilter: (key, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        }));
      },

      // Set multiple filters at once
      setFilters: (filtersObject) => {
        set((state) => ({
          filters: {
            ...state.filters,
            ...filtersObject,
          },
        }));
      },

      // Clear all filters
      clearFilters: () => {
        set({
          filters: {
            brand: "",
            model: "",
            minPrice: "",
            maxPrice: "",
            transmission: "",
            fuelType: "",
            seats: "",
            minYear: "",
            maxYear: "",
            search: "",
            availability: true,
          },
        });
      },

      // Set sort
      setSort: (sortValue) => {
        set({ sort: sortValue });
      },

      // Apply current filters and refetch
      applyFilters: async () => {
        await get().fetchCars(1);
      },

      // Reset pagination to first page
      resetPagination: () => {
        set({
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 12,
          },
        });
      },

      // Clear selected car
      clearSelectedCar: () => {
        set({ selectedCar: null });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset entire store
      resetStore: () => {
        set({
          cars: [],
          filteredCars: [],
          selectedCar: null,
          brands: [],
          carStats: null,
          loading: false,
          error: null,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 12,
          },
          filters: {
            brand: "",
            model: "",
            minPrice: "",
            maxPrice: "",
            transmission: "",
            fuelType: "",
            seats: "",
            minYear: "",
            maxYear: "",
            search: "",
            availability: true,
          },
          sort: "-createdAt",
          availableFilters: {
            brands: [],
            models: [],
            transmissions: [],
            fuelTypes: [],
            seats: [],
            years: [],
            priceRange: { min: 0, max: 1000 },
          },
        });
      },

      // ==================== HELPER METHODS ====================

      // Get car by ID from current list
      getCarById: (id) => {
        return get().cars.find((car) => car._id === id);
      },

      // Get available cars count
      getAvailableCarsCount: () => {
        return get().cars.filter((car) => car.availability).length;
      },

      // Get price range of current cars
      getPriceRange: () => {
        const prices = get().cars.map((car) => car.pricePerDay);
        if (prices.length === 0) return { min: 0, max: 0 };
        return {
          min: Math.min(...prices),
          max: Math.max(...prices),
        };
      },
    }),
    {
      name: "car-storage",
      partialize: (state) => ({
        filters: state.filters,
        sort: state.sort,
      }),
    },
  ),
);

export default useCarStore;
