import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { wishlistedCourses } from "src/data/studentData";
import { fadeIn, viewportOnce, createStaggerItem, createCardHover } from "src/lib/animationVariants";

export default function StudentWishlistPage() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );
  const cardHover = useMemo(
    () => createCardHover(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-title">
          Wishlist
        </h1>
        <p className="mt-1 text-md text-ink-muted">
          Courses you want to enroll in later
        </p>
      </div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        {wishlistedCourses.map((course, i) => (
          <Motion.div key={course.id} variants={staggerItem} custom={i}>
            <Motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className="h-full"
            >
              <div className="card h-full overflow-hidden">
                <div className="relative h-[160px] overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-3 top-3">
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand shadow transition hover:bg-white">
                      <Heart size={18} className="fill-brand" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="mb-1 line-clamp-2 text-base font-semibold text-ink">
                    {course.title}
                  </h3>
                  <p className="mb-3 text-13 text-ink-muted">
                    {course.instructor}
                  </p>

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-amber-500 text-amber-500" />
                      <span className="text-sm font-medium text-ink">
                        {course.rating}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-brand">
                      {course.price}
                    </span>
                  </div>

                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition hover:bg-brand/90">
                    <ShoppingCart size={16} />
                    Enroll Now
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  );
}
