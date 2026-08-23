import { useState, useEffect } from "react";
import logo from "src/assets/logo.webp";
import { ChevronUp } from "lucide-react";
import {
  FaXTwitter,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa6";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    { name: "X", Icon: FaXTwitter, href: "https://x.com/ethiantech", ariaLabel: "Follow us on X" },
    { name: "LinkedIn", Icon: FaLinkedin, href: "https://linkedin.com/company/ethiantech", ariaLabel: "Follow us on LinkedIn" },
    { name: "GitHub", Icon: FaGithub, href: "https://github.com/ethiantech", ariaLabel: "Follow us on GitHub" },
    { name: "YouTube", Icon: FaYoutube, href: "https://youtube.com/@ethiantech", ariaLabel: "Subscribe on YouTube" },
    { name: "Discord", Icon: FaDiscord, href: "https://discord.gg/ethiantech", ariaLabel: "Join our Discord" },
  ];

  return (
    <footer className="mt-auto bg-footer text-white relative">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} loading="lazy" className="h-12" alt="Ethian Tech" />
              <h2 className="text-body-lg font-bold">Ethian Tech</h2>
            </div>

            <p className="mt-6 text-sm-fluid text-white/60 leading-relaxed ">
              EthianTech brings expert-led courses, interactive content, and a supportive community together — learn the skills that matter, anytime and anywhere.
            </p>

            <div className="mt-8 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-white/50"
                >
                  <social.Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm-fluid font-semibold text-white/90">Subscribe to our newsletter</h3>
            <p className="text-sm-fluid text-white/60">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>

            {subscribed ? (
              <p role="status" className="mt-6 rounded-lg bg-white/10 px-4 py-3 text-sm-fluid text-white">
                Thanks! You're subscribed.
              </p>
            ) : (
              <form className="mt-6 flex" onSubmit={handleSubscribe}>
                <label className="sr-only" htmlFor="footer-email">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 input bg-footer-input border-footer-border text-white placeholder:text-white/40 focus:border-white rounded-r-none"
                />
                <button type="submit" className="btn-brand btn-brand-flat shrink-0 rounded-lg rounded-l-none px-4 py-3 text-sm-fluid">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/20 pt-6 text-center text-sm-fluid text-white/40">
          © 2026 Ethian Tech. All rights reserved.
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="md:hidden fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-white/50 opacity-0 pointer-events-none"
        style={{ opacity: showBackToTop ? 1 : 0, pointerEvents: showBackToTop ? "auto" : "none" }}
      >
        <ChevronUp size={20} aria-hidden="true" />
      </button>
    </footer>
  );
}
