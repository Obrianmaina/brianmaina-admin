"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

const CookieBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="I understand"
      enableDeclineButton
      declineButtonText="Decline Non-Essential Cookies"
      cookieName="brianMainaPortfolioCookieConsent"
      disableStyles={true}
      containerClasses="fixed bottom-0 left-0 w-full z-50 flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl transition-colors duration-300"
      contentClasses="text-sm text-gray-800 dark:text-gray-200 mb-4 sm:mb-0 text-center sm:text-left flex-1 px-4"
      buttonWrapperClasses="flex flex-col sm:flex-row gap-3 px-4"
      buttonClasses="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-5 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
      declineButtonClasses="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium py-2 px-5 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
      expires={150}
    >
      This website uses cookies to enhance the user experience. You can choose to accept or decline non-essential cookies. For more details on the data we store, please read our{" "}
      <Link href="/privacy" className="underline text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors">
        Privacy Policy
      </Link>.
    </CookieConsent>
  );
};

export default CookieBanner;