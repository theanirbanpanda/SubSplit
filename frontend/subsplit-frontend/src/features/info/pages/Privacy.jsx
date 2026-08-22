import React from 'react';
import LegalPageLayout from '../../../components/layout/LegalPageLayout';

const PRIVACY_DATE = import.meta.env.VITE_PRIVACY_DATE || 'October 24, 2026';
const CONTACT_EMAIL = import.meta.env.VITE_PRIVACY_EMAIL || 'privacy@subsplit.in';

const PRIVACY_SECTIONS = [
  {
    id: 'info-collected',
    title: '1. Information We Collect',
    content: (
      <>
        <p>When you use SubSplit, we collect information that you provide to us directly, information collected automatically, and information from third parties.</p>
        
        <p><strong>Account Information:</strong></p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Profile picture and preferences</li>
        </ul>

        <p><strong>Verification Information:</strong></p>
        <ul>
          <li>KYC/identity information (where required by our trust and safety guidelines)</li>
          <li>Verification documents (e.g., ID proof, subscription ownership proof)</li>
          <li>Verification status and results</li>
        </ul>

        <p><strong>Transaction Information:</strong></p>
        <ul>
          <li>Purchase history and listed subscriptions</li>
          <li>Payments and refunds</li>
          <li>Wallet balances and settlement records</li>
        </ul>

        <p><strong>Platform Information:</strong></p>
        <ul>
          <li>Device and browser information</li>
          <li>IP address and log data</li>
          <li>Usage and activity on the platform</li>
          <li>Notifications and communication preferences</li>
        </ul>
      </>
    )
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Information',
    content: (
      <>
        <p>We use the collected information for the following purposes:</p>
        <ul>
          <li>To create and manage your account</li>
          <li>To process transactions, hold funds in escrow, and execute payouts</li>
          <li>To verify the identity of users and the validity of listings</li>
          <li>To prevent fraud, abuse, and violations of our Terms of Service</li>
          <li>To facilitate subscription fulfillment between Hosts and Buyers</li>
          <li>To provide customer support and resolve disputes</li>
          <li>To improve the marketplace features and user experience</li>
          <li>To send transactional and account-related notifications</li>
          <li>To comply with applicable legal and regulatory obligations</li>
        </ul>
      </>
    )
  },
  {
    id: 'verification-data',
    title: '3. Verification Data',
    content: (
      <p>Verification information may be processed by us or our trusted third-party partners to establish identity and maintain marketplace trust. We do not permanently store raw government ID documents on our main application servers; they are processed securely by our verification partners and we retain only the verification result (pass/fail) and reference ID.</p>
    )
  },
  {
    id: 'payment-info',
    title: '4. Payment Information',
    content: (
      <p>Payment information is processed securely through our authorized payment gateways. SubSplit does not store full credit card numbers or sensitive banking credentials directly on our servers.</p>
    )
  },
  {
    id: 'information-sharing',
    title: '5. Information Sharing',
    content: (
      <>
        <p>We may share your information with the following parties:</p>
        <ul>
          <li><strong>Payment/Financial Service Providers:</strong> To process payments and wallet settlements.</li>
          <li><strong>Verification Providers:</strong> To perform KYC and identity checks.</li>
          <li><strong>Infrastructure/Service Providers:</strong> Cloud hosting, database, and email services that power SubSplit.</li>
          <li><strong>Customer Support Providers:</strong> Tools used to manage your support tickets.</li>
          <li><strong>Other Users:</strong> Limited information (like your display name or avatar) is shared with the Buyer or Host during a transaction to facilitate fulfillment.</li>
          <li><strong>Authorities:</strong> Where legally required to comply with a subpoena, court order, or similar legal procedure.</li>
        </ul>
        <p><strong>Note:</strong> We do not sell your personal data to third-party marketers or data brokers.</p>
      </>
    )
  },
  {
    id: 'data-security',
    title: '6. Data Security',
    content: (
      <>
        <p>We take the security of your information seriously and implement reasonable technical and organizational measures to protect it, including:</p>
        <ul>
          <li>Role-based access controls for our internal systems</li>
          <li>Encryption of data in transit (HTTPS/TLS) and at rest</li>
          <li>Secure storage infrastructure provided by reputable cloud providers</li>
          <li>System monitoring to detect unauthorized access</li>
          <li>Limited internal access to sensitive user data</li>
        </ul>
      </>
    )
  },
  {
    id: 'data-retention',
    title: '7. Data Retention',
    content: (
      <p>We retain your personal information only as long as necessary to fulfill the stated purposes, such as maintaining your account, resolving disputes, enforcing our agreements, or complying with our legal and tax obligations.</p>
    )
  },
  {
    id: 'user-rights',
    title: '8. User Rights',
    content: (
      <>
        <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> The right to request a copy of the information we hold about you.</li>
          <li><strong>Correction:</strong> The right to ask us to update or correct inaccurate data.</li>
          <li><strong>Deletion:</strong> The right to request the deletion of your account and associated data (subject to legal retention requirements).</li>
          <li><strong>Withdrawal of Consent:</strong> The right to withdraw consent for optional processing, where applicable.</li>
        </ul>
        <p>To exercise these rights, please use the contact details provided at the end of this policy.</p>
      </>
    )
  },
  {
    id: 'cookies',
    title: '9. Cookies and Analytics',
    content: (
      <p>We use essential cookies to maintain your logged-in session and secure the platform. We may also use basic analytics to understand how users navigate the marketplace to improve our design. You can manage cookie preferences through your browser settings.</p>
    )
  },
  {
    id: 'third-party-services',
    title: '10. Third-Party Services',
    content: (
      <p>SubSplit interacts with third-party subscription providers and payment gateways. When you access these external services (e.g., when accepting a family invite on another platform), their own privacy policies govern their use of your data.</p>
    )
  },
  {
    id: 'children',
    title: '11. Children\'s Privacy',
    content: (
      <p>SubSplit is not intended for use by children under the applicable minimum age for providing legal consent in your jurisdiction. We do not knowingly collect personal information from children.</p>
    )
  },
  {
    id: 'policy-changes',
    title: '12. Policy Changes',
    content: (
      <p>We may update this Privacy Policy from time to time. Material changes will be communicated to you by updating the "Last updated" date at the top of this page or via an email notification.</p>
    )
  },
  {
    id: 'contact',
    title: '13. Contact',
    content: (
      <p>If you have any questions, concerns, or grievances regarding this Privacy Policy or how we handle your data, please contact us at {CONTACT_EMAIL}.</p>
    )
  }
];

function Privacy() {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      subtitle="How SubSplit collects, uses and protects your information."
      lastUpdated={PRIVACY_DATE}
      sections={PRIVACY_SECTIONS}
    />
  );
}

export default Privacy;
