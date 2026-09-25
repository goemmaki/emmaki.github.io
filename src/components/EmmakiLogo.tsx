import { motion, type MotionValue } from "motion/react"
import logoAsset from "../assets/emmakilogo.svg"

type EmmakiLogoProps = {
  width?: number | MotionValue<number>
  reduceMotion?: boolean | null
}

export function EmmakiLogo({ width = 220, reduceMotion = false }: EmmakiLogoProps) {
  return (
    <motion.svg
      className="brand-logo"
      viewBox="0 0 413.74249 184.25723"
      role="img"
      aria-label="emmaki"
      style={{ width }}
    >
      <defs>
        <clipPath id="emmaki-signature-reveal">
          <motion.rect
            x="0"
            y="0"
            height="184.25723"
            initial={reduceMotion ? { width: 413.74249 } : { width: 0 }}
            animate={{ width: 413.74249 }}
            transition={{
              duration: reduceMotion ? 0 : 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </clipPath>
      </defs>

      <motion.use
        href={`${logoAsset}#frame`}
        className="brand-logo__frame"
        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.32,
          delay: reduceMotion ? 0 : 0.95,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <use
        href={`${logoAsset}#signature`}
        className="brand-logo__signature"
        clipPath="url(#emmaki-signature-reveal)"
      />
    </motion.svg>
  )
}
