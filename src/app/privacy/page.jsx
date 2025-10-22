/** route: src/app/privacy/page.jsx */
"use client";

import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import {
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
  Cookie as CookieIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f2ef",
        py: 12,
      }}
    >
      <Container maxWidth="md">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "#e0dfdc",
            bgcolor: "#ffffff",
            boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 40, color: "#0a66c2" }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Privacy Policy
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarIcon sx={{ fontSize: 16, color: "#666666" }} />
              <Typography variant="body2" color="text.secondary">
                Last updated: October 16, 2025
              </Typography>
            </Stack>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Introduction */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              At <strong>PNW CASH FOR CARS, LLC</strong> (referred to as &quot;PNW CASH FOR CARS&quot;, &quot;us&quot; &quot;our&quot; or &quot;we&quot;), we recognize the importance of your privacy and are strongly committed to protecting the privacy of the users of our website, <strong>www.pnwcashforcars.com</strong> (the &quot;Website&quot;) and our services (&quot;Services&quot;).
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              This privacy policy (&quot;Policy&quot;) describes the types of information we may collect from you or that you may provide to us when you visit our Website or use our Services. Please read this Policy carefully to understand our policies and practices regarding your information and how we will treat it.
            </Typography>
          </Box>

          {/* Important Consent Notice */}
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#edf3f8",
                border: "2px solid #0a66c2",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "#0a66c2" }}>
                Your Consent
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                By using the Website and/or Services, you agree to the terms and conditions of this Policy and to become legally bound by this Policy. You acknowledge that we use service providers and third-party technologies, including cookies, pixels, web beacons, analytics services, and other technologies that track your activities and collect data about you.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Collection of Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Collection of Information
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 3 }}>
              We and our service providers collect several types of information from and about users:
            </Typography>

            <Stack spacing={2}>
              <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 2.5, borderRadius: 2, border: "1px solid #e0dfdc" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                  Personal Information
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                  Information by which you may be personally identified, such as your name, physical address including ZIP code, email address, telephone number, payment information, photographs, or any other information defined by applicable law as personally identifiable information.
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 2.5, borderRadius: 2, border: "1px solid #e0dfdc" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                  Usage Information
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                  Information about you that individually does not identify you, such as your IP address, metadata or physical location, internet connection details, and usage patterns.
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* Section: How We Collect Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#000000" }}>
              How We Collect Information
            </Typography>

            <Stack spacing={2.5}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <PublicIcon sx={{ fontSize: 24, color: "#0a66c2", mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: "#000000" }}>
                    Directly from you
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                    When you fill in forms, email our representatives, speak with customer service, submit vehicle information or photographs, or use our Services.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <PhoneIcon sx={{ fontSize: 24, color: "#0a66c2", mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: "#000000" }}>
                    Phone communications
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                    When you speak with customer service representatives, including when you provide information for verification purposes, and from call recordings.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <CookieIcon sx={{ fontSize: 24, color: "#0a66c2", mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: "#000000" }}>
                    Automatically
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                    As you navigate through the Website through cookies, pixels, web beacons, analytics services, and tracking technologies.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <LocationIcon sx={{ fontSize: 24, color: "#0a66c2", mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: "#000000" }}>
                    Location data
                  </Typography>
                  <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                    We may collect location data that you provide us (such as a street address), or geolocation data as you use the Services, subject to your device settings.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* Section: Web Technologies */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Web Technologies & Cookies
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              We may use technology like &quot;web beacons,&quot; &quot;cookies,&quot; and &quot;pixels&quot; to recognize you and your access privileges on the Website, as well as to trace usage.
            </Typography>
            <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc" }}>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000", mb: 1 }}>
                <strong>What are cookies?</strong> A cookie is a small file that is stored on your device. Each time you return to the Website, we and our service providers are able to identify you as a previous or registered user.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                We use cookies to measure Website traffic, customize your experience, and provide you with tailored marketing materials and targeted advertisements.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Information About Our Users */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Information About Our Users
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              We and our service providers collect certain information from and about our visitors and users in the following ways:
            </Typography>
            <Box component="ul" sx={{ pl: 3, "& li": { mb: 1, lineHeight: 1.8, color: "#666666" } }}>
              <li>When you create an account</li>
              <li>When you provide information to get or accept an Offer</li>
              <li>When you register to receive communications from PNW CASH FOR CARS</li>
              <li>When you seek information about or use the Services</li>
              <li>When you provide Personal Information through feedback, surveys, or other methods</li>
              <li>When reporting a problem about the Website and/or Services</li>
              <li>Records and copies of your correspondence (including Personal Information)</li>
              <li>Your responses to representative questions</li>
              <li>Details of transactions you carry out through the Website</li>
              <li>Automatically as you navigate our Website or use our Services</li>
            </Box>
          </Box>

          {/* Section: Phone & Server Log Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#000000" }}>
              Phone Log & Server Information
            </Typography>
            
            <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                Phone Log Information
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                When you call a phone number, you disclose certain information about yourself, such as your phone number, call time and call duration. Like many other services, we record this basic information.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                Server Log Information
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                When you visit a Website, you disclose certain information about yourself, such as your Internet Protocol (IP) address, browser type, the time of your visit, and the referring location. Other information includes clickstream data, which includes a record of the clicked selections you make while visiting the Website.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Do Not Track */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Do Not Track
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              We may track our users&apos; activities over time and across third party websites to provide targeted advertising. However, we do not respond to Do Not Track (&quot;DNT&quot;) signals at this time. In addition, some third-party sites also keep track of your browsing activities when they serve you content, which enables them to tailor what they present to you.
            </Typography>
          </Box>

          {/* Section: Use of Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Use of Information
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              We use information collected about our users in any of the following ways to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, "& li": { mb: 1, lineHeight: 1.8, color: "#000000" } }}>
              <li>Present the Website to you and allow you to use the Services including providing you with information or services you request from us</li>
              <li>Process or complete transactions</li>
              <li>Help administer and protect the security of the Website and/or Services</li>
              <li>Develop, improve or enhance features of our Website and/or Services</li>
              <li>Contact you by email, phone, text message or other means regarding the Services</li>
              <li>Improve customer service and user experience</li>
              <li>Display and/or use aggregate information for advertising and marketing purposes</li>
              <li>Track online behavior for behavioral advertising and other marketing purposes including compiling anonymous statistical information and analysis</li>
              <li>Administer a contest, promotion, survey or other feature of the Website and/or Services</li>
              <li>Notify you about changes to our Website and/or Services</li>
              <li>Provide it to our contractors, service providers, business partners and other third parties, including our analytics providers, advertisers, and technology partners</li>
              <li>In any other way we may describe when you provide the information</li>
              <li>For any other purpose with your consent</li>
            </Box>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", mt: 2, fontStyle: "italic" }}>
              No mobile information will be shared with third parties or affiliates for marketing or promotional purposes unless explicitly opted into by the user.
            </Typography>
          </Box>

          {/* Section: Access to Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Access to the Information
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              We may disclose Personal Information about our users, in any of the following ways, to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, "& li": { mb: 1.5, lineHeight: 1.8, color: "#000000" } }}>
              <li>Contractors, service providers, business partners and other third parties we use to support our business and make the Website and/or Services available, including our analytics providers, advertisers, and technology partners</li>
              <li>A buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of PNW CASH FOR CARS&apos;s assets</li>
              <li>Fulfill the purpose for which you provide it</li>
              <li>Enforce or apply our Terms and Conditions or buying/selling policies, and other agreements</li>
              <li>Comply with applicable laws, respond to government inquiries, or to protect the rights or property of PNW CASH FOR CARS or its users</li>
            </Box>
          </Box>

          {/* Section: Security */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Security
            </Typography>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#f0f9f6",
                border: "1px solid #10b981",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
                <strong>Your security is our primary concern.</strong> We implement a variety of security measures in an effort to maintain the safety of your Personal Information. We use Transport Layer Security (TLS) technology, which enables encryption of sensitive and Personal Information.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", mb: 2 }}>
                You are responsible for all information, data, or other materials entered into, and any and all activities that occur under or in connection with, your account. You are responsible for maintaining account confidentiality and security for your account by controlling proper account access and protecting your account credentials.
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
                While we strive to protect your Personal Information, we cannot guarantee or warrant the security of any information you transmit to us, or to or from our online products or services. You transmit all such information at your own risk. We are not responsible for circumvention of any privacy settings or security measures contained on the Website and/or Services.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Links to Third Party Websites */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Links to Third Party Websites
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              Our Website may contain links to third party websites. These links are provided only for your convenience, and you are free to use them, but you do so at your own risk. We do not control these third parties or their websites. The third parties who operate such websites may use tracking technologies. Please read the privacy policies of these third-party websites carefully before browsing or providing any information on such websites. We are not responsible for your activities or any collection or tracking of your information on such sites.
            </Typography>
          </Box>

          {/* Section: Children's Privacy */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Children&apos;s Privacy (COPPA Compliance)
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              Our Website and/or Services are not intended for children under thirteen (13) years of age. No one under age thirteen (13) may provide any information to or on the Website.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
              We do not knowingly collect Personal Information from children under thirteen (13). If we learn we have collected or received Personal Information from a child under thirteen (13) without verification of parental consent, we will delete that information.
            </Typography>
          </Box>

          {/* Section: Opting Out */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Opting Out From Email Communications
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              After you register or use our Services, we may periodically send you newsletters and other emails featuring special offers, promotions, and other benefits. If you no longer wish to receive these communications, please let us know by clicking on the &quot;unsubscribe&quot; link in our emails.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", mb: 2 }}>
              Our email database is continually updated. However, you may continue to receive email communications from us for no more than ten business days from the time we receive your unsubscribe request. Please note that we can only control our own mailing list and policies. Third party advertisers that maintain their own mailing lists may send communications that advertise our products or services; and you may need to contact those parties directly to stop receiving their email communications.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666" }}>
              Certain administrative communications, including emails and telephone calls, are necessary to deliver our services. If you agree to use our Services, you agree to receive these administrative communications. For further clarification of these administrative communications, please contact us at support@pnwcashforcars.com
            </Typography>
          </Box>

          {/* Section: Privacy Requests */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Privacy Requests
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              To manage your personal information with PNW CASH FOR CARS, you may contact support@pnwcashforcars.com
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Contact Section */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#000000" }}>
              Privacy Questions or Requests?
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#666666", mb: 2 }}>
              If you have questions about this Privacy Policy or wish to manage your personal information, please contact us:
            </Typography>
            <Link href="mailto:support@pnwcashforcars.com" style={{ textDecoration: "none" }}>
              <Chip
                label="support@pnwcashforcars.com"
                sx={{
                  bgcolor: "#0a66c2",
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  px: 2,
                  py: 2.5,
                  height: "auto",
                  "&:hover": {
                    bgcolor: "#004182",
                  },
                }}
              />
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

