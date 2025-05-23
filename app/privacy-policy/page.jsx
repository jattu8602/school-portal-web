import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-muted-foreground">Effective Date: [Insert Date]</p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Presentsir.in ("we," "our," or "us"). We are committed to protecting your privacy and ensuring that
          your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we
          collect, use, disclose, and safeguard your information when you visit our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
        <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>Register on our website</li>
          <li>Place an order</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact us for support</li>
        </ul>
        <p className="mb-4">The personal information we collect may include:</p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>Name</li>
          <li>Email address</li>
          <li>Mailing address</li>
          <li>Phone number</li>
          <li>Payment information</li>
        </ul>
        <p className="mb-4">
          We also collect non-personal information automatically as you navigate through our site, such as:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>IP address</li>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>Access times</li>
          <li>Pages viewed</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>Process transactions and deliver products/services</li>
          <li>Improve our website and customer service</li>
          <li>Send periodic emails regarding your order or other products and services</li>
          <li>Respond to customer service requests</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Sharing Your Information</h2>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personal information to outside parties, except as described
          below:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>
            <strong>Service Providers:</strong> We may share information with third-party vendors who perform services
            on our behalf, such as payment processing and order fulfillment.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
            response to valid requests by public authorities.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal information from
          unauthorized access, alteration, disclosure, or destruction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>Access to the personal data we hold about you</li>
          <li>Request correction or deletion of your personal data</li>
          <li>Object to or restrict the processing of your data</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mb-4">To exercise these rights, please contact us at [Insert Contact Email].</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Third-Party Links</h2>
        <p className="mb-4">
          Our website may contain links to third-party websites. We are not responsible for the privacy practices of
          these other sites.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
          effective date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
        <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
        <p className="mb-4">
          Email: [Insert Email Address]
          <br />
          Phone: [Insert Phone Number]
          <br />
          Address: [Insert Physical Address]
        </p>
      </section>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
