export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800 dark:text-gray-100 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-primary">Terms of Service</h1>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          Welcome to <strong>Uplog</strong>. These Terms of Service (“Terms”)
          govern your access to and use of our web application and services. By
          accessing or using Uplog, you agree to be bound by these Terms.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Use of Our Service</h2>
        <p>
          You may use Uplog only in compliance with these Terms and all
          applicable laws. You must be at least 13 years old or the legal age in
          your country to use our service.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          2. Account & Authentication
        </h2>
        <p>
          To access certain features, you must log in using your Google account.
          You are responsible for maintaining the security of your login
          credentials and activity under your account.
        </p>

        <h2 className="text-xl font-semibold mt-8">3. Acceptable Use</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            You may not use the service for any illegal or unauthorized purpose.
          </li>
          <li>
            You may not attempt to access or tamper with non-public areas of the
            app.
          </li>
          <li>
            You may not abuse, harass, or harm another user or impersonate
            someone else.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">4. Intellectual Property</h2>
        <p>
          All content, logos, and code associated with Uplog are the property of
          Uplog or its contributors. You may not reproduce or use them without
          permission.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access at any time
          if you violate these Terms or abuse the platform. You can also delete
          your account at any time.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Disclaimers</h2>
        <p>
          Uplog is provided “as is” and “as available” without warranties of any
          kind. We do not guarantee uptime, bug-free behavior, or specific
          outcomes.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          7. Limitation of Liability
        </h2>
        <p>
          Uplog shall not be liable for any indirect, incidental, or
          consequential damages resulting from your use of or inability to use
          the service.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of Uplog
          after changes constitutes acceptance of the revised Terms. We’ll
          notify you in-app for major updates.
        </p>

        <h2 className="text-xl font-semibold mt-8">9. Contact</h2>
        <p>
          For questions about these Terms, please contact us at{" "}
          <a
            href="mailto:otterrcodes@gmail.com"
            className="text-primary underline underline-offset-2"
          >
            otterrcodes@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
