import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <img src="/matchera-logo.jpeg" alt="Matchera" className="site-footer-logo" />
            <p>India's #1 intent-based companion platform. Find partners for every moment of life — safely and meaningfully.</p>
          </div>
          <div className="site-footer-col">
            <h5>Platform</h5>
            <Link to="/explore">Explore</Link>
            <Link to="/sessions">Sessions</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/safety">Safety</Link>
          </div>
          <div className="site-footer-col">
            <h5>Company</h5>
            <Link to="/about">About Us</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
          </div>
          <div className="site-footer-col">
            <h5>Legal</h5>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/safety-guidelines">Safety Guidelines</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="site-footer-bottom">
          <p className="site-footer-copy">© 2025 Matchera. Built with ❤️ for meaningful connections.</p>
          <div className="site-footer-socials">
            <a href="https://twitter.com/matchera_in" target="_blank" rel="noreferrer">𝕏</a>
            <a href="https://linkedin.com/company/matchera" target="_blank" rel="noreferrer">in</a>
            <a href="https://instagram.com/matchera.in" target="_blank" rel="noreferrer">ig</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
