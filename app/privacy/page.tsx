'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 sm:py-16 md:py-20 px-3 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back to home link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-terminal text-sm sm:text-base md:text-lg text-neon-green hover:text-neon-purple transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neon-green mb-4 neon-glow">
            PRIVACY POLICY
          </h1>
          <p className="font-terminal text-base sm:text-lg md:text-xl text-neon-purple">
            Last Updated: December 31, 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Introduction */}
          <section className="border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Introduction
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4 leading-relaxed">
              <p>
                Welcome to Human Intelligence Studio Limited. We build apps and software, sometimes using AI (we call it &quot;Human Intelligence&quot; because irony is fun). We take privacy seriously, even if we don&apos;t take everything else seriously.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, and protect your data across our services, websites, and applications. By using our services, you agree to this policy.
              </p>
            </div>
          </section>

          {/* Who We Are */}
          <section className="border-2 border-neon-purple rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Who We Are
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-3">
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Company:</strong> Human Intelligence Studio Limited
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Website:</strong>{' '}
                <a href="https://www.hiiiiiiiiiii.com/" className="text-neon-blue hover:text-neon-green underline">
                  https://www.hiiiiiiiiiii.com/
                </a>
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">What We Do:</strong> We&apos;re a studio labs company that builds apps and software
              </p>
            </div>
          </section>

          {/* What Data We Collect */}
          <section className="border-2 border-neon-blue rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              What Data We Collect
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-6">
              <div>
                <h3 className="text-neon-green mb-3 font-pixel text-lg sm:text-xl">Information You Provide</h3>
                <ul className="space-y-2 ml-4">
                  <li>{'•'} Name, email address, and contact information</li>
                  <li>{'•'} Account credentials and profile information</li>
                  <li>{'•'} Payment and billing information (processed securely through third-party providers)</li>
                  <li>{'•'} Communications with us (support requests, feedback, etc.)</li>
                  <li>{'•'} Content you create or upload through our services</li>
                </ul>
              </div>
              <div>
                <h3 className="text-neon-green mb-3 font-pixel text-lg sm:text-xl">Information We Collect Automatically</h3>
                <ul className="space-y-2 ml-4">
                  <li>{'•'} <strong className="text-neon-yellow">Usage Data:</strong> How you interact with our services</li>
                  <li>{'•'} <strong className="text-neon-yellow">Device Information:</strong> Device type, operating system, browser type</li>
                  <li>{'•'} <strong className="text-neon-yellow">Log Data:</strong> IP addresses, access times, pages viewed</li>
                  <li>{'•'} <strong className="text-neon-yellow">Cookies and Tracking:</strong> Session data, preferences, analytics (see Cookies section)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-neon-green mb-3 font-pixel text-lg sm:text-xl">Information from Third Parties</h3>
                <ul className="space-y-2 ml-4">
                  <li>{'•'} <strong className="text-neon-yellow">Shopify:</strong> When you use our Shopify apps, we receive shop and customer data as necessary for functionality</li>
                  <li>{'•'} <strong className="text-neon-yellow">Service Providers:</strong> Data from integrated services you authorize</li>
                  <li>{'•'} <strong className="text-neon-yellow">Public Sources:</strong> Information available publicly (for business purposes only)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Data */}
          <section className="border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              How We Use Your Data
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white">
              <p className="mb-4">We use the data we collect to:</p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} <strong className="text-neon-yellow">Provide Services:</strong> Deliver and maintain our apps, software, and websites</li>
                <li>{'•'} <strong className="text-neon-yellow">Improve Services:</strong> Analyze usage to enhance functionality and user experience</li>
                <li>{'•'} <strong className="text-neon-yellow">Communicate:</strong> Send service updates, support responses, and important notices</li>
                <li>{'•'} <strong className="text-neon-yellow">Security:</strong> Protect against fraud, abuse, and security threats</li>
                <li>{'•'} <strong className="text-neon-yellow">Legal Compliance:</strong> Meet legal obligations and enforce our terms</li>
                <li>{'•'} <strong className="text-neon-yellow">Business Operations:</strong> Manage accounts, process payments, and handle support</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="border-2 border-neon-purple rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Data Sharing and Disclosure
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>
                We don&apos;t sell your personal data. We may share data with:
              </p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} <strong className="text-neon-yellow">Service Providers:</strong> Third-party services we use (hosting, payment processing, analytics) under strict confidentiality agreements</li>
                <li>{'•'} <strong className="text-neon-yellow">Business Partners:</strong> When necessary for service delivery (e.g., Shopify for app functionality)</li>
                <li>{'•'} <strong className="text-neon-yellow">Legal Requirements:</strong> When required by law, court order, or to protect rights, property, or safety</li>
                <li>{'•'} <strong className="text-neon-yellow">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales (with notice)</li>
                <li>{'•'} <strong className="text-neon-yellow">With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section className="border-2 border-neon-blue rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Data Storage and Security
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-3">
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Storage:</strong> Data is stored in secure databases and cloud services
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Security Measures:</strong> Industry-standard encryption, access controls, and security protocols
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Location:</strong> Data may be stored in multiple locations, including outside your country
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Retention:</strong> We retain data as long as necessary for service delivery and legal compliance
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Your Rights
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>
                Depending on your location, you may have the right to:
              </p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} <strong className="text-neon-yellow">Access:</strong> Request a copy of your personal data</li>
                <li>{'•'} <strong className="text-neon-yellow">Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li>{'•'} <strong className="text-neon-yellow">Erasure:</strong> Request deletion of your data</li>
                <li>{'•'} <strong className="text-neon-yellow">Data Portability:</strong> Receive your data in a portable format</li>
                <li>{'•'} <strong className="text-neon-yellow">Object to Processing:</strong> Object to certain uses of your data</li>
                <li>{'•'} <strong className="text-neon-yellow">Restrict Processing:</strong> Request limitation of data processing</li>
                <li>{'•'} <strong className="text-neon-yellow">Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:hello@hiiiiiiiiiii.com" className="text-neon-blue hover:text-neon-green underline">
                  hello@hiiiiiiiiiii.com
                </a>
                . We&apos;ll respond within 30 days.
              </p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="border-2 border-neon-purple rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              GDPR Compliance (EU/UK Users)
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-3">
              <p>If you&apos;re in the European Union or United Kingdom:</p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} We process your data in accordance with GDPR</li>
                <li>{'•'} We have appropriate legal bases for processing</li>
                <li>{'•'} We honor data subject rights (access, deletion, portability, etc.)</li>
                <li>{'•'} We use standard contractual clauses for international transfers</li>
                <li>{'•'} We have a Data Protection Officer (contact:{' '}
                  <a href="mailto:hello@hiiiiiiiiiii.com" className="text-neon-blue hover:text-neon-green underline">
                    hello@hiiiiiiiiiii.com
                  </a>
                  )
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="border-2 border-neon-blue rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Cookies and Tracking Technologies
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>We use cookies and similar technologies for:</p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} <strong className="text-neon-yellow">Essential Functionality:</strong> Required for services to work</li>
                <li>{'•'} <strong className="text-neon-yellow">Authentication:</strong> Session management and security</li>
                <li>{'•'} <strong className="text-neon-yellow">Preferences:</strong> Remembering your settings and choices</li>
                <li>{'•'} <strong className="text-neon-yellow">Analytics:</strong> Understanding how services are used (anonymized where possible)</li>
                <li>{'•'} <strong className="text-neon-yellow">Performance:</strong> Monitoring and improving service performance</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings, though some features may not work if cookies are disabled.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Third-Party Services
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white">
              <p>
                Our services may integrate with third-party services (e.g., Shopify, payment processors, analytics). These services have their own privacy policies. We&apos;re not responsible for their practices, but we choose partners who respect privacy.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="border-2 border-neon-purple rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Children&apos;s Privacy
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white">
              <p>
                Our services are not intended for users under 18. We don&apos;t knowingly collect personal data from children. If we learn we&apos;ve collected data from a child, we&apos;ll delete it promptly.
              </p>
            </div>
          </section>

          {/* International Data Transfers */}
          <section className="border-2 border-neon-blue rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              International Data Transfers
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>
                Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place, including:
              </p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} Standard contractual clauses</li>
                <li>{'•'} Adequacy decisions where applicable</li>
                <li>{'•'} Other legal mechanisms as required</li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Data Retention
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-3">
              <p>We retain your data:</p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} <strong className="text-neon-yellow">Active Users:</strong> As long as your account is active or needed for service delivery</li>
                <li>{'•'} <strong className="text-neon-yellow">Inactive Accounts:</strong> For a reasonable period after account closure (typically 30-90 days)</li>
                <li>{'•'} <strong className="text-neon-yellow">Legal Requirements:</strong> Longer if required by law or for legitimate business purposes</li>
                <li>{'•'} <strong className="text-neon-yellow">Anonymized Data:</strong> May be retained indefinitely in anonymized form</li>
              </ul>
            </div>
          </section>

          {/* Changes to This Policy */}
          <section className="border-2 border-neon-purple rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Changes to This Policy
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>We may update this Privacy Policy. We&apos;ll notify you of material changes by:</p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} Email (if you have an account)</li>
                <li>{'•'} In-app notification</li>
                <li>{'•'} Website notice</li>
              </ul>
              <p>
                The &quot;Last Updated&quot; date at the top indicates when changes were made. Continued use after changes constitutes acceptance.
              </p>
            </div>
          </section>

          {/* California Privacy Rights */}
          <section className="border-2 border-neon-blue rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              California Privacy Rights (CCPA)
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>If you&apos;re a California resident, you have additional rights:</p>
              <ul className="space-y-2 ml-4">
                <li>{'•'} <strong className="text-neon-yellow">Right to Know:</strong> Request information about data collection and sharing</li>
                <li>{'•'} <strong className="text-neon-yellow">Right to Delete:</strong> Request deletion of personal information</li>
                <li>{'•'} <strong className="text-neon-yellow">Right to Opt-Out:</strong> Opt out of the sale of personal information (we don&apos;t sell data)</li>
                <li>{'•'} <strong className="text-neon-yellow">Non-Discrimination:</strong> We won&apos;t discriminate for exercising your rights</li>
              </ul>
            </div>
          </section>

          {/* Contact Us */}
          <section className="border-2 border-neon-green rounded-lg p-4 sm:p-6 md:p-8 bg-cyber-dark">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl text-neon-purple mb-4 sm:mb-6">
              Contact Us
            </h2>
            <div className="font-terminal text-base sm:text-lg md:text-xl text-white space-y-4">
              <p>
                Questions, concerns, or requests about privacy? Get in touch:
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Email:</strong>{' '}
                <a href="mailto:hello@hiiiiiiiiiii.com" className="text-neon-blue hover:text-neon-green underline">
                  hello@hiiiiiiiiiii.com
                </a>
              </p>
              <p>
                <span className="text-neon-green">{'>>'} </span>
                <strong className="text-neon-yellow">Website:</strong>{' '}
                <a href="https://www.hiiiiiiiiiii.com/" className="text-neon-blue hover:text-neon-green underline">
                  https://www.hiiiiiiiiiii.com/
                </a>
              </p>
              <p className="mt-6 text-neon-purple">
                We actually read our emails and will respond as quickly as we can (usually within 48 hours).
              </p>
            </div>
          </section>

          {/* Footer note */}
          <div className="text-center py-6 sm:py-8 border-t-2 border-neon-green">
            <p className="font-terminal text-base sm:text-lg md:text-xl text-neon-green mb-2">
              Built with 🤖 and a commitment to your privacy
            </p>
            <p className="font-terminal text-sm sm:text-base text-neon-purple">
              © 2026 Human Intelligence Studio Limited. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

