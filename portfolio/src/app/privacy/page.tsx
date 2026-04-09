import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-colors duration-300">
        
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 font-medium transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6 transition-colors">Privacy Policy</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 pb-6 border-b border-gray-100 dark:border-gray-800 transition-colors">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base transition-colors">
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">1. Information Collection</h2>
            <p>When you interact with this website, certain personal information may be collected. This includes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong className="text-gray-800 dark:text-gray-200 transition-colors">Contact details:</strong> Your email address and preferred name or nickname when you request a quote, subscribe to the blog, or join the newsletter.</li>
              <li><strong className="text-gray-800 dark:text-gray-200 transition-colors">Project details:</strong> Information you willingly provide about your design or development needs through the quote request form.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">2. How Your Information is Used</h2>
            <p>The information collected is used strictly for the following purposes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>To respond to your quote requests and discuss potential projects.</li>
              <li>To send you updates when new blog posts are published (if you have subscribed to that specific feed).</li>
              <li>To send occasional newsletters, design tips, or promotional material (only if you have explicitly opted in via the checkbox).</li>
            </ul>
            <p className="mt-3 font-medium text-gray-700 dark:text-gray-400 transition-colors">Your data will never be sold to or shared with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">3. Cookies and Tracking</h2>
            <p>
              This website uses cookies to enhance your browsing experience. Essential cookies are required for the website to function properly. Non-essential cookies may be used for analytics to understand how visitors interact with the site. You have the option to accept or decline non-essential cookies via the cookie consent banner presented when you first visit the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">4. Third-Party Services</h2>
            <p>
              Certain features of this website rely on secure third-party services. For example, email subscriptions and communications are handled via Resend, and payments are securely processed via Paystack. These services act as data processors and have their own stringent privacy policies governing how they handle your data securely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">5. Your Rights and Choices</h2>
            <p>
              You have the right to access, update, or request the deletion of your personal information at any time. You can easily withdraw your consent for email communications by using the secure unsubscribe link provided at the bottom of any automated email or by visiting the unsubscribe page directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 transition-colors">6. Contact</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how your data is handled, please feel free to reach out via the contact form or email directly.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}