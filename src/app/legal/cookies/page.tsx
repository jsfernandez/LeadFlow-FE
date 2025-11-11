export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
          <p className="text-muted-foreground">
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better experience by remembering your preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
          <p className="text-muted-foreground">
            LeadManager uses cookies to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-2">
            <li>Keep you signed in</li>
            <li>Understand how you use our service</li>
            <li>Remember your preferences and settings</li>
            <li>Improve our service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
          <p className="text-muted-foreground mb-4">
            <strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly.
          </p>
          <p className="text-muted-foreground mb-4">
            <strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website.
          </p>
          <p className="text-muted-foreground">
            <strong>Functionality Cookies:</strong> These cookies enable enhanced functionality and personalization.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Managing Cookies</h2>
          <p className="text-muted-foreground">
            Most web browsers allow you to control cookies through their settings preferences. 
            However, limiting cookies may impact your experience of our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about our use of cookies, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
