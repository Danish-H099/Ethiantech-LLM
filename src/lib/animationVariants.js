const easeArrive = [0.16, 1, 0.3, 1];
const easeDepart = [0.7, 0, 0.84, 0];
const easeSwitch = [0.45, 0, 0.55, 1];

const durations = {
  press: 0.08,
  hover: 0.15,
  slow: 0.2,
  modal: 0.3,
  reveal: 0.4,
  fill: 0.5,
  hero: 0.55,
};

export const viewportOnce = { once: true, amount: 0.15 };

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.reveal, ease: easeArrive },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easeArrive },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.reveal,
      ease: easeArrive,
      delay: Math.min(index * 0.05, 0.2),
    },
  }),
};

export const cardHover = {
  rest: { y: 0 },
  hover: {
    y: -3,
    transition: { duration: durations.hover, ease: easeArrive },
  },
  tap: { scale: 0.98, transition: { duration: durations.press } },
};

export const buttonPress = {
  hover: { scale: 1.02, transition: { duration: durations.hover, ease: easeArrive } },
  tap: { scale: 0.97, transition: { duration: durations.press } },
};

export const modal = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durations.modal, ease: easeArrive },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.22, ease: easeDepart },
  },
};

export const backdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slow, ease: easeArrive },
  },
  exit: { opacity: 0, transition: { duration: 0.15, ease: easeDepart } },
};

export const mobileMenu = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: durations.slow, ease: easeArrive },
  },
  exit: {
    x: "-100%",
    transition: { duration: durations.slow, ease: easeDepart },
  },
};

export const slideUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easeArrive },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: durations.slow, ease: easeDepart },
  },
};

export const createStaggerItem = (reduced = false) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0.1 : durations.reveal,
      ease: easeArrive,
      delay: reduced ? 0 : Math.min(index * 0.05, 0.2),
    },
  }),
});

export const createCardHover = (reduced = false) => ({
  rest: { y: 0 },
  hover: {
    y: reduced ? 0 : -3,
    transition: { duration: reduced ? 0 : durations.hover, ease: easeArrive },
  },
  tap: { scale: reduced ? 1 : 0.98, transition: { duration: durations.press } },
});

export { easeArrive, easeDepart, easeSwitch, durations };
