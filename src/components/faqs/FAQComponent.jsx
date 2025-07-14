/** route: src/components/faqs/FAQComponent.jsx */
"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const faqData = {
  "Getting an Offer": [
    {
      question: "How do I get an instant offer?",
      answer:
        "Visit our website and enter your vehicle details (make, model, year, condition) and zip code in our online form, or call us at 1-855-437-9728. You'll receive an instant offer based on current market values, typically in under 2 minutes.",
    },
    {
      question: "Is it better to get an instant offer online or by phone?",
      answer:
        "Both methods provide identical offers. Online is quicker and available 24/7, while phone allows you to ask questions and get personalized assistance. Choose online for convenience or phone (1-855-437-9728) if you prefer talking to a representative.",
    },
    {
      question: "Will I be paid what I was quoted?",
      answer:
        "Yes, if your vehicle matches the condition you described. Our offers are guaranteed for 7 days and won't change unless the vehicle's actual condition differs significantly from what was reported. We pride ourselves on offer transparency and honesty.",
    },
    {
      question: "Why am I unable to get an offer with Junk Car Medics?",
      answer:
        "This may happen if: (1) you're in an area without service coverage, (2) your vehicle type isn't accepted, (3) there's incomplete information, or (4) temporary system issues. Call us directly at 1-855-437-9728 for assistance with your specific situation.",
    },
    {
      question: "Why did my offer change when I entered my VIN?",
      answer:
        "The VIN provides precise vehicle specifications like exact trim level, engine size, and factory options, which may differ from the general model information initially entered. This additional data allows us to calculate a more accurate offer based on your specific vehicle.",
    },
    {
      question: "Why do you need my email address and phone number?",
      answer:
        "We require contact information to send your offer details, coordinate vehicle pickup, verify your identity, and communicate important updates. Your phone number enables direct communication with our local buyers during the pickup process.",
    },
    {
      question: "How secure is my personal information?",
      answer:
        "Your information is protected with industry-standard encryption and security protocols. We never sell personal data to third parties and only share necessary information with our network buyers to complete your transaction. View our privacy policy for complete details.",
    },
    {
      question: "Can I negotiate the price of my junk car?",
      answer:
        "Our state-of-the-art value estimator already calculates the highest possible offer based on current market conditions. However, if you believe your vehicle deserves a higher price, call us at 1-855-437-9728 to discuss your specific situation and offer details.",
    },
    {
      question: "Can I get more money if I have newer tires?",
      answer:
        "Newer tires typically don't impact our offer since recycled tires have minimal value. You're welcome to sell your tires independently and we'll still purchase your vehicle without them. Just inform us about missing tires when requesting your quote.",
    },
    {
      question: "How long is my offer valid for?",
      answer:
        "Your offer remains valid for 7 days from issuance. After this period, we'll need to recalculate based on current scrap metal prices and market conditions. Accept within the 7-day window to guarantee your quoted price.",
    },
    {
      question: "What if I have new parts on my car?",
      answer:
        "While new parts on older vehicles typically don't significantly increase value (as they're destined for recycling), valuable components like catalytic converters or recently replaced transmissions may improve your offer. Mention any major recent repairs when requesting your quote.",
    },
    {
      question: "What happens if the condition isn't the same when you arrive?",
      answer:
        "Our carrier will inspect your vehicle to verify the reported condition. If significant discrepancies are found, the offer may be adjusted or, in rare cases, the purchase declined. Provide accurate information initially to ensure a smooth, hassle-free transaction.",
    },
    {
      question: "What is considered a drivable car?",
      answer:
        "A drivable vehicle starts on its own and moves forward and backward under its own power without requiring pushing or towing. The engine must start when the key is turned and maintain idle without assistance.",
    },
  ],
  "Collection Day": [
    {
      question: "What happens the day of collection?",
      answer:
        "The buyer will arrive at the scheduled time, verify your identity, inspect the vehicle to confirm its condition matches your description, handle all necessary paperwork, pay you in full, and then tow the vehicle away. The entire process typically takes 15-30 minutes.",
    },
    {
      question: "Who will collect my vehicle?",
      answer:
        "A licensed, insured professional from our network of verified local junk car buyers will collect your vehicle. This may be a salvage yard representative, auto recycler, or towing partner, all of whom have been vetted and approved by Junk Car Medics.",
    },
    {
      question: "Will I be paid on the spot?",
      answer:
        "Yes, you'll receive payment at the time of pickup, before your vehicle leaves your property. Payment is typically made via cash or check, depending on your location and preference. We never delay payment or require waiting periods.",
    },
    {
      question: "Can I select a collection day and time?",
      answer:
        "Yes, we offer flexible scheduling to accommodate your availability. After accepting your offer, you'll arrange a pickup time directly with our local buyer. Most areas offer same-day or next-day service, including weekend options in many locations.",
    },
    {
      question: "Will the dealer try to change the price on collection day?",
      answer:
        "No, your price is guaranteed as long as your vehicle's actual condition matches your description. We have a strict no-haggle policy and our buyers cannot arbitrarily lower offers. In the rare case of significant discrepancies, any adjustments will be fully explained.",
    },
    {
      question: "Do I need to be with my vehicle?",
      answer:
        "Either you or an authorized representative must be present during pickup to sign paperwork, receive payment, and transfer the title. If you can't be present, ensure your representative has all necessary documentation and written authorization from you.",
    },
    {
      question: "What if I need to reschedule?",
      answer:
        "Contact your assigned buyer directly using the phone number provided in your confirmation email, or call our customer service at 1-855-437-9728. We understand schedules change and can easily accommodate rescheduling as long as your offer remains valid (7 days).",
    },
    {
      question: "How does the removal process work?",
      answer:
        "After verifying the vehicle's condition and completing paperwork, our buyer will pay you and prepare the vehicle for towing. They'll secure it to their tow truck or flatbed using professional equipment and transport it to their facility. No preparation is required from you.",
    },
    {
      question: "Is towing and vehicle removal free?",
      answer:
        "Yes, towing is always free and included in your offer. The price quoted is what you'll receive, with no deductions for towing or removal, regardless of your vehicle's condition or location. We cover all transportation costs, even for non-running vehicles.",
    },
  ],
  Payment: [
    {
      question: "How and when will I get paid?",
      answer:
        "Payment is made at the time of vehicle pickup, before your car leaves your property. You'll typically receive cash or a certified check depending on your location and the buyer's standard payment method. No waiting periods or delayed payments ever.",
    },
    {
      question: "Who will pay me for my vehicle?",
      answer:
        "The local buyer who collects your vehicle will pay you directly. This is typically a representative from a licensed auto recycler, salvage yard, or dedicated junk car buying service in our network who has been vetted and approved by Junk Car Medics.",
    },
    {
      question: "Is my payment guaranteed?",
      answer:
        "Yes, your payment is 100% guaranteed when your vehicle matches the condition described in your quote. If you experience any payment issues (extremely rare), contact us immediately at 1-855-437-9728 for prompt resolution from our customer service team.",
    },
    {
      question: "Do you pay cash?",
      answer:
        "Yes, Junk Car Medics facilitates cash payments for vehicles in many locations. Depending on your area and the specific buyer, payment may be made via cash, certified check, or business check. Your payment method will be confirmed when scheduling your pickup.",
    },
  ],
  "Vehicle Requirements": [
    {
      question: "Can I sell my car without the keys?",
      answer:
        "Yes, in most cases we can purchase vehicles without keys. Since junk cars are typically recycled rather than driven, keys aren't always necessary. However, you must still provide proper ownership documentation to complete the sale legally.",
    },
    {
      question: "Can I sell my car without a registration?",
      answer:
        "Yes, if you have the title. The title is the primary legal document establishing ownership. While registration is helpful for verification, it's not required in most states if you can provide a valid title and photo identification.",
    },
    {
      question: "Can I sell my car without the title?",
      answer:
        "This varies by state. In many states, we can purchase title-less vehicles with alternative documentation like registration and ID. Call us at 1-855-437-9728 to discuss options for your specific location, or visit our detailed guide on selling cars without titles.",
    },
    {
      question: "What documents are needed to junk a car?",
      answer:
        "At minimum, you'll need a valid title and photo ID. If the title isn't available, you may need current registration, insurance card, bill of sale, or release of liability forms, depending on your state's requirements. We'll guide you through the specific documentation needed.",
    },
    {
      question: "Can I junk my car if I still owe money on it?",
      answer:
        "You must pay off any outstanding loans before selling. The lender holds the title until the loan is satisfied, and we require clear ownership to purchase your vehicle. Contact your lender to discuss payoff options before proceeding with the sale.",
    },
    {
      question: "Can I junk my car if it's abandoned?",
      answer:
        "No, we can only purchase vehicles from legal owners. For abandoned vehicles, contact local authorities who can provide guidance on the legal process for claiming or removing abandoned vehicles in your jurisdiction.",
    },
    {
      question: "Can I junk my car if the title is not in my name?",
      answer:
        "No, you must be the titled owner to legally sell a vehicle. If the title shows a different name, you'll need to properly transfer it into your name through your local DMV before selling, even if it was signed over to you informally.",
    },
    {
      question: "How do I transfer my car title?",
      answer:
        "Sign the title's seller's section exactly as your name appears on the front. Specific requirements vary by state - some require notarization or additional forms. Visit your state's DMV website or our title transfer guide for detailed, state-specific instructions.",
    },
    {
      question: "Is the car title needed when you pick up my junk car?",
      answer:
        "Yes, the title must be present at pickup, along with your photo ID for identity verification. Our driver cannot complete the purchase without proper documentation. If you don't have the title, contact us in advance to discuss alternative options available in your state.",
    },
    {
      question: "What do I do with my license plates?",
      answer:
        "Remove your license plates before pickup. In most states, you must return them to the DMV after selling your vehicle or transfer them to another vehicle you own. Our buyers can provide state-specific guidance during the pickup process.",
    },
  ],
  Miscellaneous: [
    {
      question: "How does Junk Car Medics work?",
      answer:
        "We operate a nationwide network of verified junk car buyers and salvage yards. Our system analyzes your vehicle details and location to match you with the top buyer in your area, generating the best possible offer. We handle the connection, scheduling, and ensure a smooth transaction.",
    },
    {
      question: "Why choose Junk Car Medics?",
      answer:
        "We offer industry-leading convenience (instant quotes, 1-2 day pickup), highest payouts through our competitive buyer network, guaranteed offers, free towing nationwide, immediate payment, and exceptional customer service. Our streamlined process eliminates hassles typical of selling junk cars elsewhere.",
    },
    {
      question: "How do I contact Junk Car Medics?",
      answer:
        "Call our customer service team at 1-855-437-9728, email us at support@junkcarmedics.com, or use the contact form on our website. Our representatives are available Monday-Saturday, 8am-9pm EST to assist with quotes, scheduling, or any questions about selling your junk car.",
    },
    {
      question: "How does Junk Car Medics make money?",
      answer:
        "We receive a marketing fee from the buyers in our network for connecting them with sellers. This allows us to offer our service at no cost to you while maintaining high offer prices. Our business model benefits both parties by efficiently connecting sellers with qualified local buyers.",
    },
    {
      question: "Can I refer a friend?",
      answer:
        "Yes! We appreciate referrals and offer a $25 bonus for each friend who sells their vehicle through us. Visit our referral page to register and receive your unique referral link, or simply have your friend mention your name when getting their quote.",
    },
    {
      question: "How does Junk Car Medics vet the dealers in its network?",
      answer:
        "We verify business legitimacy, licensing, insurance coverage, environmental compliance, and payment reliability. We monitor customer feedback, conduct regular performance reviews, and maintain strict service standards. Only buyers meeting our requirements remain in our network.",
    },
    {
      question:
        "How does Junk Car Medics choose which car buyers to work with?",
      answer:
        "We select reputable auto recyclers, salvage yards, and junk car specialists based on their offer prices, service quality, towing capabilities, and customer satisfaction ratings. Unlike used car dealerships, our partners specialize in end-of-life vehicles and can offer appropriate value for non-running cars.",
    },
  ],
};

const FAQComponent = () => {
  const [activeTab, setActiveTab] = useState("Getting an Offer");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const categories = Object.keys(faqData);

  const toggleQuestion = (category, index) => {
    setExpandedQuestions((prev) => {
      const key = `${category}-${index}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqData
      : Object.keys(faqData).reduce((filtered, category) => {
          const matchingQuestions = faqData[category].filter(
            (item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.answer.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingQuestions.length > 0) {
            filtered[category] = matchingQuestions;
          }

          return filtered;
        }, {});

  const hasResults = Object.values(filteredFAQs).some(
    (questions) => questions.length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about selling your junk
            car, from getting an offer to getting paid.
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for questions..."
              className="pl-10 h-12 bg-white shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-hide border-b">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={cn(
                  "px-6 py-4 text-sm md:text-base font-medium whitespace-nowrap transition-colors duration-200",
                  activeTab === category
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="p-6">
            {!hasResults && searchQuery.trim() !== "" ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  No results found for "{searchQuery}"
                </p>
                <p className="text-gray-400 mt-2">
                  Try a different search term or browse by category
                </p>
              </div>
            ) : (
              Object.keys(filteredFAQs).map((category) => (
                <div
                  key={category}
                  className={cn(
                    "space-y-4",
                    activeTab === category || searchQuery.trim() !== ""
                      ? "block"
                      : "hidden"
                  )}
                >
                  {searchQuery.trim() !== "" && (
                    <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">
                      {category}
                    </h3>
                  )}

                  {filteredFAQs[category].map((item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(category, index)}
                        className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <h3 className="font-medium text-gray-900">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-gray-500 transition-transform duration-200",
                            expandedQuestions[`${category}-${index}`]
                              ? "transform rotate-180"
                              : ""
                          )}
                        />
                      </button>

                      {expandedQuestions[`${category}-${index}`] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-white border-t border-gray-200"
                        >
                          <p className="text-gray-600">{item.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="tel:1-855-437-9728">Call 1-855-437-9728</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQComponent;
