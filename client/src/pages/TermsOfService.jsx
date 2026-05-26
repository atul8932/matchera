import "./StaticPages.css";

export default function TermsOfService() {
  return (
    <div className="sp-page">
      <div className="sp-hero">
        <div className="sp-hero-tag">📜 Terms of Service</div>
        <h1>Rules That Keep <span>Matchera Safe</span></h1>
        <p>By using Matchera, you agree to these terms. We've written them clearly so you actually understand what you're agreeing to.</p>
      </div>

      <div className="sp-content">
        <div className="sp-legal-update">📅 Last updated: May 1, 2025 · Governed by: Indian Law</div>

        <div className="sp-toc">
          <h4>📋 Table of Contents</h4>
          <div className="sp-toc-links">
            {["Acceptance","Eligibility","Your Account","Acceptable Use","Prohibited Conduct","Content Ownership","Safety & Liability","Termination","Payments & Refunds","Governing Law & Disputes"].map((t, i) => (
              <a key={i} href={`#tos-${i+1}`}>{i+1}. {t}</a>
            ))}
          </div>
        </div>

        <div className="sp-section" id="tos-1">
          <h2>1. Acceptance of Terms</h2>
          <p>By creating a Matchera account, accessing our website, or using our mobile application, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use Matchera.</p>
          <p>We may update these terms from time to time. We will notify you via email or in-app notification 14 days before material changes take effect.</p>
        </div>

        <div className="sp-section" id="tos-2">
          <h2>2. Eligibility</h2>
          <p>To use Matchera, you must:</p>
          <ul>
            <li>Be at least 18 years of age</li>
            <li>Be a legal resident of India</li>
            <li>Not have been previously banned from Matchera</li>
            <li>Not be listed on any government prohibited persons list</li>
            <li>Have the legal capacity to enter into a binding contract</li>
          </ul>
          <p>By using Matchera, you confirm that you meet all eligibility criteria. We reserve the right to verify your age and identity at any time.</p>
        </div>

        <div className="sp-section" id="tos-3">
          <h2>3. Your Account</h2>
          <p>You are responsible for maintaining the security of your account. You must:</p>
          <ul>
            <li>Use a strong, unique password</li>
            <li>Not share your account with any other person</li>
            <li>Not create multiple accounts (one account per person)</li>
            <li>Immediately notify us if you suspect unauthorized access</li>
            <li>Provide accurate and truthful information in your profile</li>
          </ul>
          <p>Matchera is not liable for any loss or damage arising from your failure to maintain account security.</p>
        </div>

        <div className="sp-section" id="tos-4">
          <h2>4. Acceptable Use</h2>
          <p>Matchera is a platform for genuine human connection. You may use Matchera to:</p>
          <ul>
            <li>Discover companions for activities matching your stated intents</li>
            <li>Chat, coordinate meetups, and build real-world connections</li>
            <li>Create and join companion sessions</li>
            <li>Rate and review your experiences honestly</li>
          </ul>
        </div>

        <div className="sp-section" id="tos-5">
          <h2>5. Prohibited Conduct</h2>
          <p>The following are strictly prohibited and will result in immediate account termination:</p>
          <ul>
            <li>Creating a fake, misleading, or impersonating profile</li>
            <li>Harassment, bullying, threats, or abusive behavior toward any user</li>
            <li>Soliciting money, gifts, or financial benefits from other users</li>
            <li>Sharing explicit sexual content without explicit consent</li>
            <li>Using the platform for commercial solicitation or spam</li>
            <li>Attempting to extract personal information through deception</li>
            <li>Using automated bots, scrapers, or scripts on the platform</li>
            <li>Facilitating illegal activities of any kind</li>
          </ul>
          <p>We take a zero-tolerance stance on any conduct that compromises user safety or platform integrity.</p>
        </div>

        <div className="sp-section" id="tos-6">
          <h2>6. Content Ownership</h2>
          <p>You retain ownership of all content you upload (photos, messages, bio). By posting content, you grant Matchera a non-exclusive, royalty-free license to display that content to other users for the purpose of providing the service.</p>
          <p>Matchera owns all platform content, design, code, and intellectual property. You may not copy, reverse-engineer, or use our code or design without written permission.</p>
        </div>

        <div className="sp-section" id="tos-7">
          <h2>7. Safety & Liability</h2>
          <p>Matchera provides tools to help you stay safe, but we cannot guarantee the safety of any in-person meetup. You are responsible for your own safety when meeting someone in person.</p>
          <ul>
            <li>Always meet in public places for first meetings</li>
            <li>Tell a friend or family member where you're going</li>
            <li>Use Matchera's built-in check-in and SOS features</li>
            <li>Trust your instincts — if something feels wrong, leave</li>
          </ul>
          <p>Matchera is not liable for any injuries, losses, or damages arising from in-person meetings arranged through the platform. Our liability is limited to the amount you paid us in the 3 months prior to the claim.</p>
        </div>

        <div className="sp-section" id="tos-8">
          <h2>8. Termination</h2>
          <p>You may delete your account at any time via Settings → Delete Account. We may suspend or terminate your account if you violate these terms, with or without prior notice, depending on the severity of the violation.</p>
        </div>

        <div className="sp-section" id="tos-9">
          <h2>9. Payments & Refunds</h2>
          <p>Premium subscriptions are billed monthly or annually. All payments are processed via Razorpay. Refunds are issued within 7 days if requested within 48 hours of a charge with a valid reason. Partial refunds may be issued pro-rata for annual plans.</p>
        </div>

        <div className="sp-section" id="tos-10">
          <h2>10. Governing Law & Disputes</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in New Delhi. We encourage resolving disputes through direct communication first — email us at legal@matchera.in.</p>
        </div>
      </div>
    </div>
  );
}
