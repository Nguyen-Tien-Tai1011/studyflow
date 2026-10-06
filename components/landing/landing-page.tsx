import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ChartNoAxesCombined,
  Timer,
  Check,
  Flame,
  Quote,
  Leaf,
} from "lucide-react";
import { Logo } from "@/components/ui/primitives";
import { heroImage, testimonials } from "@/data/marketing";
export function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link href="/welcome" aria-label="StudyFlow home">
          <Logo />
        </Link>
        <nav aria-label="Product navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#study-tips">Study tips</a>
          <Link href="/">My dashboard</Link>
        </nav>
        <Link href="/" className="button primary">
          Start studying
        </Link>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-kicker">
              <Leaf size={15} /> A LITTLE MORE FOCUS. A LOT MORE POSSIBILITY.
            </span>
            <h1>
              Stop guessing
              <br />
              what to study <span>next.</span>
            </h1>
            <p className="hero-subtitle">
              Track your learning. Build consistency.
              <br />
              See real progress.
            </p>
            <p>
              Organize your subjects, make time for what matters, and understand
              exactly where your study time goes. Meet your calmer, clearer
              study routine.
            </p>
            <div className="hero-actions">
              <Link href="/" className="button primary">
                Start studying
              </Link>
              <Link href="/progress" className="button secondary">
                View my progress
              </Link>
            </div>
            <span className="hero-trust">
              <Check size={15} /> Your pace. Your goals. One session at a time.
            </span>
          </div>
          <div className="hero-visual">
            <Image
              src={heroImage}
              alt="Focused student studying at a library table with a laptop"
              width={750}
              height={850}
              priority
            />
            <div className="hero-image-shade" />
            <div className="hero-photo-caption">
              A space for your next small win.
            </div>
            <div className="hero-floating-card">
              <span className="stat-icon orange">
                <Flame size={25} />
              </span>
              <div>
                <strong>Keep showing up.</strong>
                <span>Consistency is a skill you can build.</span>
              </div>
            </div>
            <span className="image-credit">
              Photo: Ashutosh Gupta / Unsplash
            </span>
          </div>
        </section>
        <section id="how-it-works" className="landing-section">
          <div className="landing-section-heading">
            <span className="eyebrow">LESS OVERWHELM. MORE MOMENTUM.</span>
            <h2>A clear plan. A focused mind.</h2>
            <p>
              Everything you need to turn good intentions into a study habit.
            </p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: BookOpen,
                title: "Know your next step",
                copy: "Keep programming, calculus, languages, and every subject in between in one organized workspace.",
              },
              {
                icon: Timer,
                title: "Make space for focus",
                copy: "Choose a task. Start a Pomodoro. Take a real break. Build a rhythm that works with your attention.",
              },
              {
                icon: ChartNoAxesCombined,
                title: "See the bigger picture",
                copy: "Follow your weekly study time, balance your subjects, and celebrate the progress you’re making.",
              },
            ].map((f, i) => (
              <article key={f.title}>
                <span className={`feature-icon feature-${i}`}>
                  <f.icon size={25} />
                </span>
                <span className="feature-number">0{i + 1}</span>
                <h3>{f.title}</h3>
                <p>{f.copy}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="study-tips" className="study-tips-section">
          <div>
            <span className="eyebrow">BUILT AROUND REAL LIFE</span>
            <h2>
              Progress comes from consistency,
              <br />
              <span>not perfection.</span>
            </h2>
            <p>
              You don’t need a perfect routine. Just a small, repeatable way to
              begin.
            </p>
          </div>
          <div className="tips-list">
            <article>
              <span>01</span>
              <div>
                <h3>Start smaller than you think.</h3>
                <p>Twenty-five focused minutes is a great place to start.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Give every subject a little time.</h3>
                <p>A quick weekly review helps you keep a healthy balance.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Leave room to recharge.</h3>
                <p>Breaks are part of learning. Take them without guilt.</p>
              </div>
            </article>
          </div>
        </section>
        <section className="landing-section testimonials">
          <div className="landing-section-heading">
            <span className="eyebrow">
              DIFFERENT JOURNEYS. SHARED MOMENTUM.
            </span>
            <h2>A study routine that feels like yours.</h2>
            <p>Illustrative student stories from the StudyFlow demo.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <article key={t.name}>
                <Quote size={23} />
                <blockquote>{t.quote}</blockquote>
                <div className="testimonial-person">
                  <Image
                    src={t.image}
                    alt="Illustrative student portrait"
                    width={44}
                    height={44}
                  />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="landing-cta">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Make a little progress today.</h2>
          <p>Your next focused session is one click away.</p>
          <Link className="button primary" href="/">
            Open my study workspace
          </Link>
        </section>
        <section className="product-details">
          <details id="privacy">
            <summary>Privacy & your study data</summary>
            <p>
              This frontend demo stores tasks, goals, and completed sessions in
              this browser’s local storage. There is no account, cloud
              synchronization, or study-data collection endpoint. Clearing site
              data removes your changes. Photos load from Unsplash, and fonts
              are served with the app.
            </p>
          </details>
          <details id="terms">
            <summary>About this demo</summary>
            <p>
              StudyFlow is a functional prototype with illustrative user data
              and student stories. It is provided for exploration and personal
              study tracking. No subscription or payment is required.
            </p>
          </details>
          <details id="contact">
            <summary>Contact & feedback</summary>
            <p>
              This demo does not have a connected support inbox. Share feedback
              with the person who provided your StudyFlow link, including the
              page and what you would like improved.
            </p>
          </details>
        </section>
      </main>
      <footer className="landing-footer">
        <div>
          <Logo />
          <p>Build better learning habits.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/">Dashboard</Link>
          <a href="#study-tips">Study tips</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
        </nav>
        <span>© 2026 StudyFlow</span>
      </footer>
    </div>
  );
}
