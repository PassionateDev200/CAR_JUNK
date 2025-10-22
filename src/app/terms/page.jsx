/** route: src/app/terms/page.jsx */
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
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
              <DescriptionIcon sx={{ fontSize: 40, color: "#0a66c2" }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                }}
              >
                Terms & Conditions
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
              These Terms and Conditions (&quot;Terms&quot;) are entered into between you and <strong>PNW CASH FOR CARS, LLC</strong> (referred to as &quot;PNW CASH FOR CARS&quot;, &quot;us&quot;, &quot;our&quot; or &quot;we&quot;) and represent a legal agreement between you and PNW CASH FOR CARS. By accessing the website <strong>www.pnwcashforcars.com</strong> (&quot;Website&quot;), you are agreeing to abide by the following Terms, which govern all use of this Website and the services available through Website (&quot;Services&quot;).
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              Please take a few minutes to read this agreement before accessing or using the Website. If you do not agree with any of these Terms or do not wish to be bound by these Terms, your only option is to not use or access this Website.
            </Typography>
          </Box>

          {/* Section: Age and Jurisdiction */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Age and Jurisdiction
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              This Website is offered and available to users who are eighteen (18) years of age or older and reside in the United States or any of its territories or possessions only. By using this Website, you represent and warrant that you are of legal age to form a binding contract with PNW CASH FOR CARS and meet all of the foregoing eligibility requirements.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              The Website is not intended for users under the age of thirteen (13), and we do not knowingly collect personally identifiable information from users under the age of thirteen (13).
            </Typography>
          </Box>

          {/* Section: Use of Services */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Use of Services
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              PNW CASH FOR CARS does not always directly buy or sell cars or provide salvage and towing services or negotiate the purchase or sale of vehicles. In certain instances, the Website serves as a digital venue and intermediary where Sellers and Buyers meet and enter into agreements.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              The Services provided are in no way a substitute for your own due diligence, and PNW CASH FOR CARS does not guarantee the accuracy or correctness of any information provided.
            </Typography>
          </Box>

          {/* Section: Definitions */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#000000" }}>
              Key Definitions
            </Typography>
            
            <Stack spacing={3}>
              {/* Offer */}
              <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#0a66c2" }}>
                  Offer
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                  An amount of money or a service put forward by the Buyer and when accepted, is defined as a transaction between a Buyer and a Seller. Offers are contingent upon the accuracy of the vehicle information as well as personal information submitted by the Seller.
                </Typography>
              </Paper>

              {/* Seller */}
              <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#0a66c2" }}>
                  Seller
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                  Users of PNW CASH FOR CARS who submit information about their vehicle in order to receive Offers from Buyers. When a Seller receives and accepts an Offer from a Buyer, they are connected with a Carrier to arrange for their vehicle to be picked up.
                </Typography>
              </Paper>

              {/* Buyer */}
              <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#0a66c2" }}>
                  Buyer
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                  Commercial users of PNW CASH FOR CARS who submit offer bids to buy the vehicles submitted by Sellers. The bid amount is based upon the vehicle&apos;s information that the Seller submits.
                </Typography>
              </Paper>

              {/* Carrier */}
              <Paper elevation={0} sx={{ bgcolor: "#f9fafb", p: 3, borderRadius: 2, border: "1px solid #e0dfdc" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#0a66c2" }}>
                  Carrier
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                  Commercial users of PNW CASH FOR CARS that physically transport the Seller&apos;s vehicle from its location to the Buyer.
                </Typography>
              </Paper>
            </Stack>
          </Box>

          {/* Section: Seller's Representations */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Seller&apos;s Representations, Warranties and Covenants
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              The Seller represents and warrants that all information provided to PNW CASH FOR CARS is accurate and legally true, including:
            </Typography>
            
            <Stack spacing={2} sx={{ pl: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#000000", mb: 0.5 }}>
                  • Accurate Vehicle Location
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", pl: 2 }}>
                  The address indicated at the time of submission must match that of the vehicle location when it is picked up.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#000000", mb: 0.5 }}>
                  • Accurate Vehicle Information
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", pl: 2 }}>
                  The year, make, model, trim, and VIN of the vehicle indicated at the time of submission must match that of the vehicle that gets picked up.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#000000", mb: 0.5 }}>
                  • Accurate Vehicle Condition
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", pl: 2 }}>
                  All conditions will be verified at the time the vehicle is picked up, including wheels, tires, battery, key, drivability, mileage, and overall condition.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#000000", mb: 0.5 }}>
                  • Accurate Vehicle Ownership
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", pl: 2 }}>
                  The title documentation submitted for verification of ownership and legal validity must be accurate and valid.
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Important Notice */}
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#fff8e6",
                border: "2px solid #ffd700",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: "#b8860b" }}>
                Important Notice
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000" }}>
                If any information about the vehicle provided by the Seller is found to be inaccurate at the time of inspection or if any major vehicle component is missing or removed, PNW CASH FOR CARS reserves the right to invalidate the transaction, recalculate the Offer or refuse pick up.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Disclaimer */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Disclaimer
            </Typography>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#000000", fontWeight: 600 }}>
                YOUR USE OF THE SERVICES IS AT YOUR SOLE RISK. THE WEBSITE, INCLUDING ALL THE MATERIALS, INFORMATION, SERVICES, FACILITIES AND OTHER CONTENT AVAILABLE ON THIS WEBSITE ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Liability */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Release of Liability
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              Should you have a dispute with one or more of the Sellers, Buyers or Carriers, you hereby release PNW CASH FOR CARS, LLC, its affiliates, subsidiaries, officers, directors, agents, members, managers, shareholders, employees or representatives from all claims, demands, and damages (actual and consequential) of any kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed.
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#666666", fontWeight: 600 }}>
              IN NO EVENT WILL PNW CASH FOR CARS BE LIABLE TO YOU FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, EXEMPLARY OR CONSEQUENTIAL DAMAGES.
            </Typography>
          </Box>

          {/* Section: Third Party Services */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Third Party Services
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              The Services and the Website may provide you with an opportunity to engage with third party services, information pertaining to third party services or links to third party services (&quot;Third Party Services&quot;) offered or made available by third party organizations, companies or individuals (&quot;Third Party&quot; or &quot;Third Parties&quot;). In such cases, PNW CASH FOR CARS acts as a conduit to allow you to identify, interact and engage with such Third Parties.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              PNW CASH FOR CARS is neither responsible nor liable for any activities you engage in with or any communications you have with such Third Parties. Your use of Third Party Services is subject to an independent agreement with the applicable Third Party providing such Third Party Services and is not governed by these Terms.
            </Typography>
          </Box>

          {/* Section: Prohibited Items */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Prohibited Items
            </Typography>
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
                A Carrier cannot pick up any hazardous or dangerous materials along with or inside of any vehicle. Hazardous or dangerous items are those that may pose a danger to the health, safety, or property of any person during transport (such as explosives, radioactive materials, flammable gases and solids, and toxic substances).
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", fontWeight: 600 }}>
                PNW CASH FOR CARS ONLY PROVIDES SERVICES RELATING TO PASSENGER VEHICLES. This does not include motorcycles, heavy equipment, trailers, motorhomes, RVs, or boats.
              </Typography>
            </Paper>
          </Box>

          {/* Section: Payment Process */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Payment Process and Methods
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              In most cases, the Carrier is able to make payment to the Seller at the time of pick up. If paid by mailed check, ACH, wire transfer or any such payment method, the amount due to the Seller will be processed as soon as the vehicle is confirmed to be picked up and the condition and documentation have been verified.
            </Typography>
          </Box>

          {/* Section: Proprietary Rights */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Proprietary Rights
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              If you are eligible to use the Services and the Website, PNW CASH FOR CARS grants you a non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Services and the Website solely under the terms and conditions provided hereunder.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              PNW CASH FOR CARS and/or its licensors own the Services and the Website, including all software and other technology, contents, design, layout, functions, appearance and other intellectual property comprising the Website, including all copyrights, trademarks, service marks, trade secrets, patents and other intellectual property rights.
            </Typography>
          </Box>

          {/* Section: User Conduct */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              User Conduct
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              In using the Website and Services, you agree not to:
            </Typography>
            <Box component="ul" sx={{ pl: 3, "& li": { mb: 1.5, lineHeight: 1.8, color: "#000000" } }}>
              <li>Violate any applicable international, country, province, federal or state laws, regulations or rules</li>
              <li>Provide false personal information or create an account for anyone other than yourself</li>
              <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation</li>
              <li>Violate or attempt to violate the security of any of the Services</li>
              <li>Share your password or authorize anyone else to access your account</li>
              <li>Reverse engineer, decompile, disassemble or otherwise attempt to reconstruct any aspect of the Website</li>
              <li>Scrape, copy, transfer, or display any information from the Website</li>
              <li>Harvest or collect information of other users for unsolicited communications</li>
            </Box>
          </Box>

          {/* Section: Submissions */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Submissions
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              All remarks, suggestions, ideas, graphics, photographs or other information (&quot;Submissions&quot;) communicated to PNW CASH FOR CARS through this Website will forever be the property of PNW CASH FOR CARS.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              You grant PNW CASH FOR CARS a nonexclusive, royalty-free, worldwide, perpetual, transferable, irrevocable, and fully sublicensable right and license to use, reproduce, display, perform, adapt, modify, alter, create derivative works from and distribute your Submissions, including your name, image, likeness, photograph, voice, and biographical material.
            </Typography>
          </Box>

          {/* Section: Confidentiality */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Confidentiality
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              As a result of your use of the Services and the Website, we may disclose to you or you may otherwise learn of or discover our documents, business practices, management styles, day-to-day business operations, capabilities, systems, strategies, marketing information, financial information, software, technologies, processes, and procedures (&quot;Our Information&quot;). You hereby agree that any and all of Our Information is confidential and shall be our sole and exclusive intellectual property. Any disclosure of Our Information to a third party, specifically including a direct competitor, is strictly prohibited.
            </Typography>
          </Box>

          {/* Section: Non-Solicitation */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Non-Solicitation
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              You shall not solicit or hire our employees of whom you become aware through the use of the Services or the Website. Furthermore, you shall not otherwise interfere with any of our other business relationships.
            </Typography>
          </Box>

          {/* Section: Record Keeping */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Record Keeping
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              We reserve the right to keep all records of any and all transactions and communications between you and other members for administration purposes.
            </Typography>
          </Box>

          {/* Section: Indemnification */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Indemnifications
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              You hereby agree to indemnify, defend, and hold harmless PNW CASH FOR CARS and PNW CASH FOR CARS&apos;s subsidiaries, affiliates, officers, directors, managers, members, shareholders, employees, agents, representatives and approved and permitted licensees and assigns from any and all loss and damage from and against any and all claims and expenses, including attorneys&apos; fees, arising out of your use of the Website or the Services, including but not limited to your breach of these Terms.
            </Typography>
          </Box>

          {/* Section: Termination */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Termination
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              You understand and agree that we may, in our sole discretion and at any time, terminate your account and discard and remove any content posted or submitted by you for any reason. We may take any of these actions without prior notice to you.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              PNW CASH FOR CARS may also suspend or terminate your account or rescind the Offer if a suspicion arises that you engaged in any fraudulent activity in conjunction with our Website. If PNW CASH FOR CARS becomes aware that you willfully and intentionally violated any of our rules, we may pursue damages against you in any forum we deem appropriate.
            </Typography>
          </Box>

          {/* Section: Governing Law */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Miscellaneous & Governing Law
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000", mb: 2 }}>
              These Terms and any access to or use of the Website will be governed by the laws of the State of New York, excluding its conflict of law provisions. Except for claims for injunctive or equitable relief in aid of arbitration or claims regarding PNW CASH FOR CARS&apos;s intellectual property rights, any dispute arising under these Terms shall be heard and resolved in accordance with the JAMS Streamlined Arbitration Rules and Procedures by one arbitrator appointed in accordance with such Rules.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              The arbitration shall take place in New York, NY in the English language, and the arbitral decision may be enforced in any court of competent jurisdiction.
            </Typography>
          </Box>

          {/* Section: Severability */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Severability
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              The invalidity or unenforceability of any provision of these Terms shall not affect the validity or enforceability of any other provision.
            </Typography>
          </Box>

          {/* Section: Change in Control */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#000000" }}>
              Change in Control
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#000000" }}>
              In the event of a change of control of PNW CASH FOR CARS or the sale of substantially all of PNW CASH FOR CARS&apos;s assets or other corporate event, all rights of PNW CASH FOR CARS hereunder shall be transferable without notice to you.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Contact Section */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#000000" }}>
              Questions?
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#666666", mb: 2 }}>
              If you have any questions about these Terms, please contact us:
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

