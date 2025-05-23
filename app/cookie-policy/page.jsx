import Link from "next/link"

export default function CookiePolicy() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-4xl font-bold">Cookie Policy</h1>
      <p className="mb-6 text-muted-foreground">Effective Date: [Insert Date]</p>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">1. What Are Cookies?</h2>
        <p className="mb-4">
          Cookies are small text files stored on your device when you visit a website. They help us understand user
          behavior, remember preferences, and improve your experience on our site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">2. How We Use Cookies</h2>
        <p className="mb-4">We use cookies to:</p>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>Remember your login details</li>
          <li>Understand how you use our website</li>
          <li>Personalize your experience</li>
          <li>Provide targeted advertising</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">3. Types of Cookies We Use</h2>
        <ul className="mb-4 ml-6 list-disc space-y-2">
          <li>
            <strong>Essential Cookies:</strong> Necessary for the website to function properly.
          </li>
          <li>
            <strong>Performance Cookies:</strong> Collect information about how you use our website.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> Remember your preferences and choices.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Deliver advertisements relevant to you.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">4. Third-Party Cookies</h2>
        <p className="mb-4">
          We may allow third-party service providers to place cookies on your device for analytics and advertising
          purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">5. Managing Cookies</h2>
        <p className="mb-4">
          You can control and manage cookies through your browser settings. Please note that disabling cookies may
          affect the functionality of our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">6. Changes to This Cookie Policy</h2>
        <p className="mb-4">
          We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated
          effective date.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">7. Contact Us</h2>
        <p className="mb-4">If you have any questions about our use of cookies, please contact us at:</p>
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
