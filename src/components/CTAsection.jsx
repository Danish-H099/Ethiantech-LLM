import { m as Motion } from "motion/react";
import { buttonPress, fadeUp, viewportOnce } from "../lib/animationVariants";

export default function CTASection() {
  return (
    <section className="py-28 text-center">
      <Motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <h2 className="text-5xl font-bold text-ink">
          Learn anything, anytime, anywhere
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-ink-muted">
          Incididunt sint fugiat pariatur cupidatat consectetur sit
          cillum anim id veniam aliqua proident excepteur commodo do
          ea.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <Motion.button
            variants={buttonPress}
            whileHover="hover"
            whileTap="tap"
            className="btn-brand px-8 py-3 shadow"
          >
            Get started
          </Motion.button>

          <button className="font-medium text-ink-muted hover:text-ink">
            Learn more →
          </button>
        </div>
      </Motion.div>
    </section>
  );
}