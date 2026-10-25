"use client"

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
} from "react"
import {
  motion,
  useReducedMotion,
  type DOMMotionComponents,
  type HTMLMotionProps,
  type MotionProps,
} from "motion/react"

// Magic UI HyperText (MIT, dillionverma), adapted for wrapped headings: letters keep their case and
// the surrounding font, each scrambled letter sits in a slot as wide as its real letter and words
// don't break, so the lines never move while it resolves. No default styles, and nothing runs under
// reduced motion.

type CharacterSet = string[] | readonly string[]

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>
type HyperTextMotionComponent = ComponentType<
  Omit<HTMLMotionProps<"div">, "ref"> & RefAttributes<HTMLElement>
>

interface HyperTextProps extends Omit<MotionProps, "children"> {
  /** The text content to be animated */
  children: string
  /** Optional className for styling */
  className?: string
  /** Duration of the animation in milliseconds */
  duration?: number
  /** Delay before animation starts in milliseconds */
  delay?: number
  /** Component to render as - defaults to div */
  as?: MotionElementType
  /** Whether to start animation when element comes into view */
  startOnView?: boolean
  /** Whether to trigger animation on hover */
  animateOnHover?: boolean
  /** Custom character set for scramble effect. Defaults to uppercase alphabet */
  characterSet?: CharacterSet
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
) as readonly string[]

const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  ...props
}: HyperTextProps) {
  const MotionComponent = motionElements[Component] as HyperTextMotionComponent
  const reduceMotion = useReducedMotion()

  const [displayText, setDisplayText] = useState<string[]>(() =>
    children.split("")
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const iterationCount = useRef(0)
  const elementRef = useRef<HTMLElement | null>(null)

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating && !reduceMotion) {
      iterationCount.current = 0
      setIsAnimating(true)
    }
  }

  // Handle animation start based on view or delay
  useEffect(() => {
    if (reduceMotion) return

    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true)
      }, delay)
      return () => clearTimeout(startTimeout)
    }

    let startTimeout: ReturnType<typeof setTimeout> | undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTimeout = setTimeout(() => {
            setIsAnimating(true)
          }, delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      observer.disconnect()
      clearTimeout(startTimeout)
    }
  }, [delay, startOnView, reduceMotion])

  // Handle scramble animation
  useEffect(() => {
    let animationFrameId: number | null = null

    if (isAnimating) {
      const maxIterations = children.length
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        iterationCount.current = progress * maxIterations

        setDisplayText((currentText) =>
          currentText.map((letter, index) =>
            children[index] === " "
              ? " "
              : index <= iterationCount.current
                ? children[index]
                : characterSet[getRandomInt(characterSet.length)]
          )
        )

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [children, duration, isAnimating, characterSet])

  // Words as unbreakable runs of letter slots, spaces between them as ordinary text.
  const words = [...children.matchAll(/\S+/g)].map((match) => ({
    word: match[0],
    start: match.index,
  }))

  return (
    <MotionComponent
      ref={elementRef}
      className={className}
      onMouseEnter={handleAnimationTrigger}
      {...props}
    >
      {words.map(({ word, start }, w) => (
        <span key={start}>
          {w > 0 && " "}
          <span className="whitespace-nowrap">
            {word.split("").map((letter, i) => (
              // The real letter, drawn invisibly from CSS so it isn't page text, sets the slot's width; the
              // shown letter is centred over it and takes no space.
              <span
                key={i}
                data-letter={letter}
                className="relative inline-block before:invisible before:content-[attr(data-letter)]"
              >
                <span className="absolute inset-0 flex justify-center">
                  {displayText[start + i]}
                </span>
              </span>
            ))}
          </span>
        </span>
      ))}
    </MotionComponent>
  )
}
