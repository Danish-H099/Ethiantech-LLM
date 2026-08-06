import { useMemo } from "react";
import { m as Motion, useReducedMotion } from "motion/react";
import data from "../data/testimonialsData.json";
import { fadeIn, fadeUp, viewportOnce, createStaggerItem } from "../lib/animationVariants";

const { companies, testimonials } = data;

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();
  const staggerItem = useMemo(
    () => createStaggerItem(!!shouldReduceMotion),
    [shouldReduceMotion]
  );

  return (
    <section className="py-20">

      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-center"
      >

        <p className="text-ink-muted font-medium">
          Trusted by learners from
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-14">

          {companies.map((company) => (
            <img
              key={company.name}
              src={company.logo}
              alt={company.name}
              loading="lazy"
              className="h-8 object-contain "
            //   grayscale hover:grayscale-0 transition
            />
          ))}
        </div>

        <h2 className="mt-24 text-4xl font-bold text-ink">
          Testimonials
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-ink-muted">
          Hear from our learners as they share their journeys of
          transformation, success, and how our platform has made a
          difference in their lives.
        </p>
      </Motion.div>

      <Motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto mt-16 grid max-w-7xl gap-8 px-6 md:grid-cols-3"
      >

        {testimonials.map((item, i) => (
          <Motion.div
            key={item.name}
            variants={staggerItem}
            custom={i}
          >
            <div className="card card-hover h-full hover:-translate-y-1">
            <div className="flex items-center gap-4 border-b border-border p-5">

              <img
                src={item.image}
                loading="lazy"
                className="h-12 w-12 rounded-full object-cover"
                alt=""
              />

              <div>
                <h4 className="font-semibold">
                  {item.name}
                </h4>

                <p className="text-sm text-ink-muted">
                  {item.role}
                </p>
              </div>

            </div>

            <div className="p-5">

              <div className="mb-3 flex">
                ⭐⭐⭐
                {/* {Array.from({ length: 5 }).map((_, i) => (⭐
                //   <StarIcon
                //     key={i}
                //     className="h-5 w-5 text-orange-500"
                //   />
                ))} */}

              </div>

              <p className="text-sm leading-7 text-ink-muted">
                I've been using imagify for nearly two years,
                primarily for Instagram, and it has been
                incredibly user-friendly, making my work much
                easier.
              </p>

              <button className="mt-6 text-sm font-medium text-brand hover:underline">
                Read more
              </button>

            </div>
            </div>
          </Motion.div>
        ))}
      </Motion.div>
    </section>
  );
}