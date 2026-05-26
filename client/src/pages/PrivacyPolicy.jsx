import "./StaticPages.css";

export default function PrivacyPolicy() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">🔒 Privacy Policy</div>
        <h1>Your Privacy is Our <span>Priority</span></h1>
        <p>We believe you have the right to know exactly how your data is used. This policy is written in plain English, not legalese.</p>
      </div>

      <div className="sp-content">
        <div className="sp-legal-update">📅 Last updated: May 1, 2025 · Effective: May 1, 2025</div>

        <div className="sp-toc">
          <h4>📋 Table of Contents</h4>
          <div className="sp-toc-links">
            {["Information We Collect","How We Use Your Data","Data Sharing","Data Storage & Security","Your Rights","Cookies","Children's Privacy","Contact Us"].map((item, i) => (
              <a key={i} href={`#section-${i+1}`}>{i+1}. {item}</a>
            ))}
          </div>
        </div>

        <div className="sp-section" id="section-1">
          <h2>1. Information We Collect</h2>
          <h3>Information You Provide</h3>
          <p>When you create a Matchera account, we collect:</p>
          <ul>
            <li>Name, email address, and/or phone number</li>
            <li>Age, gender, and location (city level only)</li>
            <li>Profile photos and bio</li>
            <li>Intent preferences, interests, and mood settings</li>
            <li>Emergency contact information (only if you enable safety features)</li>
          </ul>
          <h3>Information We Collect Automatically</h3>
          <p>When you use the app, we automatically collect device information, IP address, usage patterns, and crash reports. We use this solely to improve the product.</p>
          <h3>Information From Third Parties</h3>
          <p>If you verify via phone OTP, we receive confirmation of your phone number from our OTP provider. We do not receive any other data from third parties.</p>
        </div>

        <div className="sp-section" id="section-2">
          <h2>2. How We Use Your Data</h2>
          <p>We use your information only to:</p>
          <ul>
            <li>Match you with compatible companions based on your stated intent</li>
            <li>Enable real-time chat and session coordination</li>
            <li>Send safety alerts and emergency notifications</li>
            <li>Improve our matching algorithm and product features</li>
            <li>Prevent fraud, abuse, and safety violations</li>
            <li>Send product updates and marketing (only with your consent)</li>
          </ul>
          <p>We <strong>never</strong> sell your personal data. We <strong>never</strong> use your data to train external AI models. We <strong>never</strong> share your data with advertisers.</p>
        </div>

        <div className="sp-section" id="section-3">
          <h2>3. Data Sharing</h2>
          <p>We share your data only in these limited circumstances:</p>
          <ul>
            <li><strong>Other users:</strong> Your public profile (name, photo, bio, intents) is visible to other verified Matchera users</li>
            <li><strong>Service providers:</strong> Cloud hosting (AWS), OTP services (MSG91), and payment processing (Razorpay) — bound by strict data processing agreements</li>
            <li><strong>Legal requirements:</strong> If required by Indian law or a valid court order</li>
            <li><strong>Safety emergencies:</strong> Your emergency contact receives your location if you trigger SOS</li>
          </ul>
        </div>

        <div className="sp-section" id="section-4">
          <h2>4. Data Storage & Security</h2>
          <p>All data is stored on servers located in India (Mumbai region, AWS). We implement:</p>
          <ul>
            <li>AES-256 encryption at rest for all personal data</li>
            <li>TLS 1.3 encryption in transit</li>
            <li>Bcrypt password hashing (cost factor 12)</li>
            <li>Regular security audits and penetration testing</li>
            <li>Automatic data deletion after 90 days of inactivity</li>
          </ul>
          <p>Despite these measures, no internet transmission is 100% secure. We encourage you to use a strong, unique password.</p>
        </div>

        <div className="sp-section" id="section-5">
          <h2>5. Your Rights</h2>
          <p>Under India's Digital Personal Data Protection Act (DPDPA) 2023, you have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of all data we hold about you</li>
            <li><strong>Correction:</strong> Update or correct any inaccurate data</li>
            <li><strong>Deletion:</strong> Request permanent deletion of your account and data</li>
            <li><strong>Portability:</strong> Export your data in machine-readable format</li>
            <li><strong>Objection:</strong> Opt out of non-essential data processing</li>
          </ul>
          <p>To exercise any right, email <strong>privacy@matchera.in</strong>. We respond within 30 days.</p>
        </div>

        <div className="sp-section" id="section-6">
          <h2>6. Cookies</h2>
          <p>We use minimal cookies — only for authentication (keeping you logged in) and basic analytics (page views, no cross-site tracking). We do not use advertising cookies or third-party tracking pixels.</p>
        </div>

        <div className="sp-section" id="section-7">
          <h2>7. Children's Privacy</h2>
          <p>Matchera is strictly for users aged 18 and above. We do not knowingly collect data from anyone under 18. If you believe a minor has created an account, please contact us immediately at <strong>safety@matchera.in</strong>.</p>
        </div>

        <div className="sp-section" id="section-8">
          <h2>8. Contact Us</h2>
          <p>For privacy concerns, data requests, or questions:</p>
          <ul>
            <li><strong>Email:</strong> privacy@matchera.in</li>
            <li><strong>Data Protection Officer:</strong> dpo@matchera.in</li>
            <li><strong>Address:</strong> Matchera Technologies Pvt. Ltd., Connaught Place, New Delhi — 110001</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
