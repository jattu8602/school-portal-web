import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
      <p className="mb-6 text-muted-foreground">Effective Date: [Insert Date]</p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing or using Presentsir.in, you agree to be bound by these Terms of Service and our Privacy Policy.
          If you do not agree to these terms, please do not use our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. Use of the Website</h2>
        <p className="mb-4">You agree to use our website for lawful purposes only. You must not:</p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the rights of others</li>
          <li>Interfere with or disrupt the website or servers</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Account Registration</h2>
        <p className="mb-4">
          To access certain features, you may need to register for an account. You agree to provide accurate information
          and to keep this information up to date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Intellectual Property</h2>
        <p className="mb-4">
          All content on Presentsir.in, including text, graphics, logos, and images, is the property of Presentsir.in or
          its content suppliers and is protected by intellectual property laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Limitation of Liability</h2>
        <p className="mb-4">
          Presentsir.in shall not be liable for any indirect, incidental, special, or consequential damages arising out
          of or in connection with your use of the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold harmless Presentsir.in and its affiliates from any claims, damages, or
          expenses arising from your use of the website or violation of these terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Termination</h2>
        <p className="mb-4">
          We reserve the right to terminate or suspend your access to the website at our sole discretion, without
          notice, for conduct that we believe violates these Terms of Service or is harmful to other users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">8. Governing Law</h2>
        <p className="mb-4">
          These Terms of Service are governed by the laws of India. Any disputes arising under these terms shall be
          subject to the exclusive jurisdiction of the courts located in [Insert Jurisdiction].
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">9. Changes to Terms</h2>
        <p className="mb-4">
          We may modify these Terms of Service at any time. Changes will be effective upon posting to the website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">10. Contact Us</h2>
        <p className="mb-4">For any questions regarding these Terms of Service, please contact us at:</p>
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
