export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-gray-800 dark:text-gray-100 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-primary">Privacy Policy</h1>

      <section className="space-y-4 text-sm leading-relaxed">
        <p>
          This Privacy Policy explains how <strong>Uplog</strong> ("we", "our",
          or "us") collects, uses, and protects your personal information when
          you use our web application.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          1. Information We Collect
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Google Account Data:</strong> When you sign in using Google,
            we collect your basic profile information such as your name, email
            address, and profile picture.
          </li>
          <li>
            <strong>Usage Data:</strong> We may collect anonymized analytics
            like feature usage and error logs to improve the product experience.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To authenticate and log you into the app via Google OAuth</li>
          <li>To personalize your experience based on your profile</li>
          <li>
            To maintain and improve the security and performance of the app
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">3. Data Sharing</h2>
        <p>
          We do <strong>not</strong> sell or share your personal data with any
          third-party service, except when required by law.
        </p>

        <h2 className="text-xl font-semibold mt-8">4. Data Security</h2>
        <p>
          We take reasonable and appropriate security measures to protect your
          data from loss, misuse, unauthorized access, or disclosure. All
          authentication is handled securely via OAuth.
        </p>

        <h2 className="text-xl font-semibold mt-8">5. Data Retention</h2>
        <p>
          Your data is retained only for as long as necessary to provide our
          service. If you delete your account, your data is deleted from our
          systems within 30 days.
        </p>

        <h2 className="text-xl font-semibold mt-8">6. Your Rights</h2>
        <p>
          You may request deletion of your data or contact us for any concerns
          regarding privacy.
        </p>

        <h2 className="text-xl font-semibold mt-8">
          7. Changes to This Policy
        </h2>
        <p>
          This Privacy Policy may be updated from time to time. We will notify
          users of material changes via email or an in-app notification.
        </p>

        <h2 className="text-xl font-semibold mt-8">8. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{" "}
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
