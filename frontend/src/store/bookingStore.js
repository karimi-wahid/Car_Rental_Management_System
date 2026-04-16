// stores/bookingStore.js (Complete version with bookings)
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

const useBookingStore = create(
  persist(
    (set, get) => ({
      // Cars State
      cars: [],
      filteredCars: [],
      brands: [],
      selectedCar: null,

      // Bookings State
      bookings: [],
      selectedBooking: null,
      userBookings: [],

      // UI State
      loading: false,
      error: null,

      // Pagination
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      },

      // Filters
      filters: {
        brand: "",
        minPrice: "",
        maxPrice: "",
        transmission: "",
        fuelType: "",
        seats: "",
        search: "",
        startDate: null,
        endDate: null,
        status: "",
      },

      // Sorting
      sort: "-createdAt",

      // Availability check
      availability: {
        isChecking: false,
        available: null,
        availableTimeSlots: [],
        conflictingBookings: [],
      },

      // ==================== CAR METHODS ====================

      // Fetch all cars with filters
      fetchCars: async (page = 1, limit = 12) => {
        set({ loading: true, error: null });

        try {
          const { filters, sort } = get();
          const params = new URLSearchParams();

          params.append("page", page);
          params.append("limit", limit);
          if (sort) params.append("sort", sort);

          if (filters.brand) params.append("brand", filters.brand);
          if (filters.minPrice) params.append("minPrice", filters.minPrice);
          if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
          if (filters.transmission)
            params.append("transmission", filters.transmission);
          if (filters.fuelType) params.append("fuelType", filters.fuelType);
          if (filters.seats) params.append("seats", filters.seats);
          if (filters.search) params.append("search", filters.search);
          if (filters.startDate) params.append("startDate", filters.startDate);
          if (filters.endDate) params.append("endDate", filters.endDate);

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
                response.data.pagination?.totalItems || response.data.results,
              itemsPerPage: limit,
            },
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
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get(`/cars/${id}`);

          set({
            selectedCar: response.data.data.car,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch car",
            loading: false,
          });
          throw error;
        }
      },

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

      // Check car availability
      checkCarAvailability: async (carId, startDate, endDate) => {
        set({
          availability: {
            ...get().availability,
            isChecking: true,
          },
        });

        try {
          const response = await axiosInstance.get(
            `/bookings/check-availability?carId=${carId}&startDate=${startDate}&endDate=${endDate}`,
          );

          set({
            availability: {
              isChecking: false,
              available: response.data.data.available,
              availableTimeSlots: response.data.data.availableTimeSlots || [],
              conflictingBookings: response.data.data.conflictingBookings || [],
              pricing: response.data.data.pricing,
            },
          });

          return response.data;
        } catch (error) {
          set({
            availability: {
              isChecking: false,
              available: false,
              error: error.response?.data?.message,
            },
          });
          throw error;
        }
      },

      // Get available time slots
      getAvailableTimeSlots: async (carId, date) => {
        set({ loading: true });

        try {
          const response = await axiosInstance.get(
            `/bookings/time-slots?carId=${carId}&date=${date}`,
          );

          set({
            availability: {
              ...get().availability,
              availableTimeSlots: response.data.data.availableSlots,
            },
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // ==================== BOOKING METHODS ====================

      // Create booking
      createBooking: async (bookingData) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.post("/bookings", bookingData);

          // Add to user bookings
          set((state) => ({
            userBookings: [response.data.data.booking, ...state.userBookings],
            selectedBooking: response.data.data.booking,
            loading: false,
          }));

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to create booking",
            loading: false,
          });
          throw error;
        }
      },

      // Fetch user bookings
      fetchUserBookings: async (status = "", page = 1, limit = 10) => {
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();
          params.append("page", page);
          params.append("limit", limit);
          if (status) params.append("status", status);

          const response = await axiosInstance.get(
            `/bookings/my-bookings?${params.toString()}`,
          );

          set({
            userBookings: response.data.data.bookings,
            pagination: response.data.pagination,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch bookings",
            loading: false,
          });
          throw error;
        }
      },

      // Fetch booking by ID
      fetchBookingById: async (id) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.get(`/bookings/${id}`);

          set({
            selectedBooking: response.data.data.booking,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch booking",
            loading: false,
          });
          throw error;
        }
      },

      // Update booking
      updateBooking: async (id, updateData) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(
            `/bookings/${id}`,
            updateData,
          );

          // Update in user bookings
          const updatedBookings = get().userBookings.map((booking) =>
            booking._id === id ? response.data.data.booking : booking,
          );

          set({
            userBookings: updatedBookings,
            selectedBooking: response.data.data.booking,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update booking",
            loading: false,
          });
          throw error;
        }
      },

      // Cancel booking
      cancelBooking: async (id, cancellationReason) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(`/bookings/${id}/cancel`, {
            cancellationReason,
          });

          // Update in user bookings
          const updatedBookings = get().userBookings.map((booking) =>
            booking._id === id ? { ...booking, status: "cancelled" } : booking,
          );

          set({
            userBookings: updatedBookings,
            selectedBooking: response.data.data.booking,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to cancel booking",
            loading: false,
          });
          throw error;
        }
      },

      // ==================== ADMIN METHODS ====================

      // Fetch all bookings (Admin)
      fetchAllBookings: async (page = 1, limit = 20, filters = {}) => {
        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams();
          params.append("page", page);
          params.append("limit", limit);

          if (filters.status) params.append("status", filters.status);
          if (filters.startDate) params.append("startDate", filters.startDate);
          if (filters.endDate) params.append("endDate", filters.endDate);

          const response = await axiosInstance.get(
            `/bookings?${params.toString()}`,
          );

          set({
            bookings: response.data.data.bookings,
            pagination: response.data.pagination,
            loading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to fetch bookings",
            loading: false,
          });
          throw error;
        }
      },

      // Update booking status (Admin)
      updateBookingStatus: async (id, status, adminNotes = "") => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(`/bookings/${id}/status`, {
            status,
            adminNotes,
          });

          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to update booking status",
            loading: false,
          });
          throw error;
        }
      },

      // Create car (Admin)
      createCar: async (carData) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.post("/cars", carData);

          // Refresh cars list
          await get().fetchCars();

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

      // Update car (Admin)
      updateCar: async (id, updateData) => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(`/cars/${id}`, updateData);

          // Update selected car if it's the same
          if (get().selectedCar?._id === id) {
            set({ selectedCar: response.data.data.car });
          }

          // Refresh cars list
          await get().fetchCars();

          set({ loading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update car",
            loading: false,
          });
          throw error;
        }
      },

      // Toggle car availability (Admin)
      toggleCarAvailability: async (id, availability, reason = "") => {
        set({ loading: true, error: null });

        try {
          const response = await axiosInstance.patch(
            `/cars/${id}/toggle-availability`,
            {
              availability,
              reason,
            },
          );

          // Update car in list
          const updatedCars = get().cars.map((car) =>
            car._id === id
              ? { ...car, availability: response.data.data.car.availability }
              : car,
          );

          set({
            cars: updatedCars,
            filteredCars: updatedCars,
            loading: false,
          });

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

      // Delete car (Admin)
      deleteCar: async (id, permanent = false) => {
        set({ loading: true, error: null });

        try {
          const url = permanent ? `/cars/${id}?permanent=true` : `/cars/${id}`;
          await axiosInstance.delete(url);

          // Remove car from list
          const updatedCars = get().cars.filter((car) => car._id !== id);

          set({
            cars: updatedCars,
            filteredCars: updatedCars,
            loading: false,
          });

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to delete car",
            loading: false,
          });
          throw error;
        }
      },

      // ==================== UTILITY METHODS ====================

      // Set filter
      setFilter: (key, value) => {
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        }));
      },

      // Clear all filters
      clearFilters: () => {
        set({
          filters: {
            brand: "",
            minPrice: "",
            maxPrice: "",
            transmission: "",
            fuelType: "",
            seats: "",
            search: "",
            startDate: null,
            endDate: null,
            status: "",
          },
        });
      },

      // Set sort
      setSort: (sortValue) => {
        set({ sort: sortValue });
      },

      // Apply filters and refetch
      applyFilters: async () => {
        await get().fetchCars(1);
      },

      // Clear availability check
      clearAvailabilityCheck: () => {
        set({
          availability: {
            isChecking: false,
            available: null,
            availableTimeSlots: [],
            conflictingBookings: [],
          },
        });
      },

      // Reset store
      resetStore: () => {
        set({
          cars: [],
          filteredCars: [],
          brands: [],
          selectedCar: null,
          bookings: [],
          selectedBooking: null,
          userBookings: [],
          loading: false,
          error: null,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10,
          },
          filters: {
            brand: "",
            minPrice: "",
            maxPrice: "",
            transmission: "",
            fuelType: "",
            seats: "",
            search: "",
            startDate: null,
            endDate: null,
            status: "",
          },
          sort: "-createdAt",
          availability: {
            isChecking: false,
            available: null,
            availableTimeSlots: [],
            conflictingBookings: [],
          },
        });
      },
    }),
    {
      name: "booking-storage", // unique name for localStorage
      partialize: (state) => ({
        filters: state.filters,
        sort: state.sort,
      }), // only persist filters and sort
    },
  ),
);

export default useBookingStore;
