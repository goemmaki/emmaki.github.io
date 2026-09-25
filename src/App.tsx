import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

const work = [
  {
    client: "Quartile",
    type: "B2B SaaS · Adtech · AI",
    title: "Product and website copy",
  },
  {
    client: "Tenity / F10",
    type: "Fintech",
    title: "Email and newsletter copy",
  },
  {
    client: "HackerRank",
    type: "Developer tools · B2B SaaS",
    title: "Outbound sales email campaign",
  },
  {
    client: "Human Flourishing Program at Harvard",
    type: "Research · PR",
    title: "Scientific research press release",
  },
]

const capabilities = [
  "Website copy",
  "Landing pages",
  "Sales copy",
  "Email campaigns",
  "Thought leadership",
  "SEO content",
  "AI content strategy",
  "Brand voice",
]

export default function App() {
  const reduceMotion = useReducedMotion()

  const enter = {
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  }

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Emma Rawson home">
          ER
        </a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a
            href="https://www.fiverr.com/emmaki"
            target="_blank"
            rel="noreferrer"
          >
            Fiverr <ArrowUpRight size={14} strokeWidth={1.8} />
          </a>
        </nav>
      </header>

      <section id="top" className="hero">
        <motion.p
          {...enter}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow"
        >
          B2B SaaS copywriter · AI content strategist
        </motion.p>

        <motion.h1
          {...enter}
          transition={{
            duration: 0.6,
            delay: reduceMotion ? 0 : 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Clear thinking.
          <br />
          Better copy.
        </motion.h1>

        <motion.div
          {...enter}
          transition={{
            duration: 0.6,
            delay: reduceMotion ? 0 : 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="hero-bottom"
        >
          <p className="hero-copy">
            Commercial copy and content strategy for complex businesses,
            products and ideas.
          </p>
          <div className="hero-meta" aria-label="Experience summary">
            <span>20 years</span>
            <span>5,100+ Fiverr orders</span>
            <span>UK · Greece</span>
          </div>
        </motion.div>
      </section>

      <section id="work" className="section">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <p className="section-note">Case studies are being added.</p>
        </div>

        <div className="work-grid">
          {work.map((item, index) => (
            <motion.article
              key={item.client}
              className="work-card"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: reduceMotion ? 0 : index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="work-card-top">
                <span className="work-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="work-type">{item.type}</span>
              </div>
              <div>
                <h2>{item.client}</h2>
                <p>{item.title}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="about" className="section about">
        <div>
          <p className="eyebrow">What I do</p>
          <h2>
            Copywriting for buyers who need to understand something before
            they can buy it.
          </h2>
        </div>

        <div className="capability-list" aria-label="Services">
          {capabilities.map((capability, index) => (
            <div className="capability" key={capability}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{capability}</p>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>Emma Rawson</p>
        <a
          href="https://www.fiverr.com/emmaki"
          target="_blank"
          rel="noreferrer"
        >
          Fiverr profile <ArrowUpRight size={14} strokeWidth={1.8} />
        </a>
      </footer>
    </main>
  )
}
