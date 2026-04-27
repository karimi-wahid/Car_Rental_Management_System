import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CarFilters } from "@/components/cars/CarFilters";
import { CarSorting } from "@/components/cars/CarSorting";
import { CarCard } from "@/components/cars/CarCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonCard } from "@/components/common/LoadingState";
import useCarStore from "@/store/carStore";

const CarsPage = () => {
  const {
    cars,
    loading,
    pagination,
    filters,
    fetchCars,
    setFilters,
    brands,
    fetchBrands,
  } = useCarStore();

  useEffect(() => {
    fetchCars(pagination.currentPage, pagination.itemsPerPage);
  }, [filters, pagination.currentPage, fetchCars, pagination.itemsPerPage]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    handleFilterChange({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (limit) => {
    handleFilterChange({ ...filters, limit, page: 1 });
  };

  const handleSortChange = (sortBy, sortOrder) => {
    handleFilterChange({ ...filters, sortBy, sortOrder });
  };

  const resetFilters = () => {
    handleFilterChange({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      search: "",
      brand: "all",
      minPrice: 0,
      maxPrice: 1000,
      transmission: "all",
      fuelType: "all",
      seats: "all",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom py-8 px-2"
      dir="rtl"
    >
      <PageHeader
        title="موترهای ما"
        description="از مجموعه موترهای لوکس و باکیفیت ما انتخاب کنید"
        withBreadcrumb
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <CarFilters
          onFilterChange={handleFilterChange}
          brands={brands}
          initialFilters={filters}
        />

        {/* Main Content */}
        <div className="flex-1 p-2">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
            <CarSorting
              value={filters.sortBy || "createdAt"}
              order={filters.sortOrder || "desc"}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Cars Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : cars.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {cars.map((car, index) => (
                  <CarCard key={car._id} car={car} index={index} />
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon="search"
                title="هیچ موتری یافت نشد"
                description="هیچ موتری با معیارهای جستجوی شما یافت نشد. لطفاً فیلترها را تغییر دهید."
                action={{
                  label: "بازنشانی فیلترها",
                  onClick: resetFilters,
                }}
              />
            )}
          </AnimatePresence>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSize={pagination.limit}
                totalItems={pagination.total}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CarsPage;
