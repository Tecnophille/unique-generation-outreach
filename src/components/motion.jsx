import { motion, useReducedMotion } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];

export function useMotionPrefs() {
  const reduce = useReducedMotion();
  return {
    reduce,
    fadeUp: reduce
      ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
      : { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } },
    fade: reduce
      ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
      : { hidden: { opacity: 0 }, show: { opacity: 1 } },
    transition: { duration: reduce ? 0 : 0.7, ease },
    stagger: reduce ? 0 : 0.08,
  };
}

/** On-load entrance (heroes). */
export function Reveal({ children, className, delay = 0, as: Comp = motion.div, ...rest }) {
  const { reduce, fadeUp, transition } = useMotionPrefs();
  return (
    <Comp
      className={className}
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={fadeUp}
      transition={{ ...transition, delay: reduce ? 0 : delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Scroll-triggered entrance for sections / cards. */
export function InView({
  children,
  className,
  delay = 0,
  amount = 0.25,
  as: Comp = motion.div,
  ...rest
}) {
  const { reduce, fadeUp, transition } = useMotionPrefs();
  return (
    <Comp
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      transition={{ ...transition, delay: reduce ? 0 : delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function Stagger({ children, className, as: Comp = motion.div, amount = 0.2 }) {
  const { reduce, stagger } = useMotionPrefs();
  return (
    <Comp
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: reduce ? 0 : 0.04 },
        },
      }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as: Comp = motion.div, ...rest }) {
  const { fadeUp, transition } = useMotionPrefs();
  return (
    <Comp className={className} variants={fadeUp} transition={transition} {...rest}>
      {children}
    </Comp>
  );
}
