import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "src/assets/logo.webp";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="mt-auto bg-footer text-white">

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">

          <div>

            <div className="flex items-center gap-3">

              <img
                src={logo}
                loading="lazy"
                className="h-12"
                alt="EthianTech LLM"
              />

              <h2 className="text-xl font-bold">
                EthianTech LLM
              </h2>

            </div>

            <p className="mt-6 text-gray-300 leading-7">
              EthianTech brings expert-led courses, interactive content,
              and a supportive community together — learn the skills that
              matter, anytime and anywhere.
            </p>

          </div>

          <div>

            <h3 className="mb-5 font-semibold">
              Company
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="transition hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white">About us</Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white">Contact us</Link>
              </li>
              <li>
                <Link to="/privacy" className="transition hover:text-white">Privacy policy</Link>
              </li>
            </ul>

          </div>

          <div>

            <h3 className="font-semibold">
              Subscribe to our newsletter
            </h3>

            <p className="mt-4 text-gray-300">
              The latest news, articles, and resources,
              sent to your inbox weekly.
            </p>

            {subscribed ? (
              <p
                role="status"
                className="mt-6 rounded-lg bg-white/10 px-4 py-3 text-sm text-white"
              >
                Thanks! You're subscribed.
              </p>
            ) : (
              <form className="mt-6 flex" onSubmit={handleSubscribe}>
                <label className="sr-only" htmlFor="footer-email">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-footer-input px-3 py-3 text-sm text-white outline-none transition placeholder:text-gray-400 focus:border-white rounded-r-none"
                />
                <button
                  type="submit"
                  className="btn-brand btn-brand-flat shrink-0 rounded-lg rounded-l-none px-4 py-3 text-sm"
                >
                  Subscribe
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © 2026 EthianTech. All rights reserved.
      </div>

    </footer>
  );
}
