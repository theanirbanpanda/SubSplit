import React from 'react';
import LegalPageLayout from '../../../components/layout/LegalPageLayout';

const TERMS_DATE = import.meta.env.VITE_TERMS_DATE || 'October 24, 2026';
const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || '[SubSplit Legal Entity]';
const CONTACT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'legal@subsplit.in';

const TERMS_SECTIONS = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <>
        <p>By accessing or using the SubSplit platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms and conditions, you may not access or use the Platform.</p>
        <p>SubSplit provides an online marketplace that connects users who have spare capacity on eligible subscription services ("Hosts") with users who wish to purchase access to that capacity ("Buyers").</p>
      </>
    )
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: (
      <p>You must be of legal age in your jurisdiction to form a binding contract to use the Platform. By using SubSplit, you represent and warrant that you meet this requirement. Access to certain features may require you to pass identity verification (KYC) checks.</p>
    )
  },
  {
    id: 'platform',
    title: '3. SubSplit Platform',
    content: (
      <p>SubSplit acts solely as a marketplace and escrow provider. We do not own, create, sell, resell, provide, control, manage, offer, or deliver any of the underlying third-party subscriptions listed on our platform. Hosts are solely responsible for their listings and the delivery of access.</p>
    )
  },
  {
    id: 'buyer-accounts',
    title: '4. Buyer Accounts',
    content: (
      <>
        <p>Buyers must provide accurate account information and payment details. Buyers must not misuse subscription access or violate the terms of the underlying third-party service. Sharing access received through SubSplit with unauthorized third parties is strictly prohibited.</p>
      </>
    )
  },
  {
    id: 'host-accounts',
    title: '5. Host Accounts',
    content: (
      <>
        <p>Hosts must provide accurate account information. To list a subscription, a Host must be the legal owner or authorized administrator of the subscription.</p>
        <ul>
          <li>Hosts must only list subscriptions they are authorized to share.</li>
          <li>Hosts must not provide false capacity, pricing, renewal or subscription information.</li>
        </ul>
      </>
    )
  },
  {
    id: 'subscription-listings',
    title: '6. Subscription Listings',
    content: (
      <p>Listings must accurately describe the subscription being offered, including the duration, available seats, and the required fulfillment method. SubSplit reserves the right to remove, suspend, or modify any listing that violates these Terms or our Safety Guidelines.</p>
    )
  },
  {
    id: 'catalog',
    title: '7. Catalog and Verification',
    content: (
      <p>Hosts may only list subscriptions that are available in the predefined SubSplit catalog. This ensures that capacity, share modes, and fulfillment methods are standardized. We may require proof of purchase or identity verification before a listing is published.</p>
    )
  },
  {
    id: 'pricing',
    title: '8. Pricing',
    content: (
      <p>SubSplit enforces pricing benchmarks based on the catalog to ensure fair value. Hosts must set prices within the supported range. We reserve the right to reject or block listings that attempt to circumvent these pricing controls.</p>
    )
  },
  {
    id: 'orders',
    title: '9. Orders and Transactions',
    content: (
      <p>When a Buyer requests a seat, they authorize SubSplit to charge their payment method for the listing price and any applicable fees. The transaction is not complete until the Host accepts the request and fulfills the access.</p>
    )
  },
  {
    id: 'escrow',
    title: '10. Escrow and Settlement',
    content: (
      <p>Payments made by Buyers are held securely in escrow. Funds are released to the Host’s wallet only after the Host has fulfilled the access and the applicable confirmation period has passed without dispute. Users must not circumvent SubSplit payments or transaction controls.</p>
    )
  },
  {
    id: 'fulfillment',
    title: '11. Fulfillment',
    content: (
      <>
        <p>Hosts must provide access within the specified timeframe using the official fulfillment method supported by the subscription (e.g., email invitation link). </p>
        <p><strong>Raw Passwords:</strong> Hosts must not share raw passwords/credentials through SubSplit unless a specific product workflow in our catalog explicitly supports and requires it.</p>
      </>
    )
  },
  {
    id: 'cancellations',
    title: '12. Cancellations and Refunds',
    content: (
      <p>Buyers may cancel a request before it is accepted by the Host for a full refund. If a Host fails to fulfill access within the allotted time, the Buyer will receive an automatic refund. Once fulfilled, refunds are only issued if the access is found to be defective or revoked prematurely, subject to our dispute resolution process.</p>
    )
  },
  {
    id: 'disputes',
    title: '13. Disputes',
    content: (
      <p>If there is an issue with access, Buyers must open a dispute within the platform. Our admin team will review evidence from both parties and make a binding determination regarding the release of funds or the issuance of a refund.</p>
    )
  },
  {
    id: 'prohibited',
    title: '14. Prohibited Activities',
    content: (
      <>
        <p>You agree not to engage in any of the following activities:</p>
        <ul>
          <li>Using the platform for any illegal purpose or in violation of any local laws.</li>
          <li>Manipulating reviews, verification status, or marketplace rankings.</li>
          <li>Harassing, threatening, or defrauding other users.</li>
          <li>Creating multiple accounts to bypass suspensions or limits.</li>
        </ul>
      </>
    )
  },
  {
    id: 'suspension',
    title: '15. Account Suspension and Termination',
    content: (
      <p>SubSplit may suspend or terminate your account and listings at our discretion, without notice, for fraud, abuse, inaccurate information, failed verification, or any violation of these Terms.</p>
    )
  },
  {
    id: 'third-party',
    title: '16. Third-Party Services',
    content: (
      <>
        <p>SubSplit does not own or operate the third-party subscription services listed on the marketplace. Third-party providers remain entirely responsible for their own services, plans, and policies.</p>
        <p>Access to a third-party subscription can change if that provider changes, suspends, or terminates the underlying plan/service. SubSplit is not liable for changes made by third-party providers.</p>
      </>
    )
  },
  {
    id: 'intellectual-property',
    title: '17. Intellectual Property',
    content: (
      <p>The SubSplit platform, including its design, text, graphics, and source code, is owned by {COMPANY_NAME} and is protected by copyright and intellectual property laws. You may not copy, modify, or distribute our content without written permission.</p>
    )
  },
  {
    id: 'liability',
    title: '18. Limitation of Liability',
    content: (
      <p>To the maximum extent permitted by law, SubSplit shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Platform, the failure of a Host to provide access, or the termination of a third-party service.</p>
    )
  },
  {
    id: 'indemnification',
    title: '19. Indemnification',
    content: (
      <p>You agree to indemnify and hold harmless {COMPANY_NAME}, its officers, directors, and employees, from any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Platform or your violation of these Terms.</p>
    )
  },
  {
    id: 'changes',
    title: '20. Changes to These Terms',
    content: (
      <p>We may modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on the Platform and updating the "Last updated" date. Your continued use of the Platform constitutes acceptance of the new Terms.</p>
    )
  },
  {
    id: 'contact',
    title: '21. Contact',
    content: (
      <p>If you have any questions about these Terms, please contact our legal team at {CONTACT_EMAIL}.</p>
    )
  }
];

function Terms() {
  return (
    <LegalPageLayout 
      title="Terms of Service" 
      subtitle="Terms governing your use of the SubSplit platform."
      lastUpdated={TERMS_DATE}
      sections={TERMS_SECTIONS}
    />
  );
}

export default Terms;
