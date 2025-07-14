/** route: src/app/faqs/page.jsx */
/**
 *  src/app/faqs/page.jsx
 **/
import FAQComponent from "@/components/faqs/FAQComponent";

export const metadata = {
  title: "Frequently Asked Questions - PNW Cash For Cars",
  description:
    "Find answers to common questions about selling your junk car, getting quotes, payment methods, and more.",
};

export default function FAQsPage() {
  return <FAQComponent />;
}
