"use client";

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-app-gradient bg-to-br from-app-dark-blue via-app-blue to-app-blue px-4 py-8 md:py-0 md:max-h-screen flex flex-col items-center justify-center">
      {/* Animated Gradient Background Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-app-dark-blue via-app-blue to-app-blue animate-gradient-move opacity-80" />
        <div className="absolute left-1/2 top-1/4 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-app-blue opacity-20 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-app-blue opacity-10 rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white/98 backdrop-blur-sm border-b border-gray-200 p-6 md:p-8 z-10">
            <div className="text-center">
              <img
                src="/windows11/StoreLogo.scale-400.png"
                alt="Shift Scan Logo"
                className="h-16 w-auto mx-auto mb-4 rounded-lg"
              />
              <h1 className="text-2xl font-bold text-app-dark-blue mb-2">
                Shift Scan App Privacy Policy
              </h1>
              <p className="text-gray-600">Last updated December 08, 2025</p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="text-gray-700 space-y-4 text-sm">
              {/* --- Inserted new policy content here --- */}
              <p>
                This Privacy Notice for Streamline Precision LLC ("we", "us", or
                "our"), describes how and why we might access, collect, store,
                use, and/or share ("process") your personal information when you
                use our services ("Services"), including when you:
              </p>
              <ul className="list-disc ml-4">
                <li>
                  Visit our website at{" "}
                  <a
                    href="https://shiftscanapp.com"
                    className="text-app-blue underline"
                  >
                    https://shiftscanapp.com
                  </a>{" "}
                  or any website of ours that links to this Privacy Notice
                </li>
                <li>
                  Download and use our mobile applications (Shift Scan), or any
                  other application of ours that links to this Privacy Notice.
                </li>
                <li>
                  Use Shift Scan. Shift Scan is a workforce management
                  application designed to streamline time tracking and personnel
                  management for job sites and field operations. It provides
                  real time tools for administrators and employees to manage
                  shifts, record attendance, and generate reports, improving
                  operational efficiency and accountability.
                </li>
                <li>
                  Engage with us in other related ways, including any marketing
                  or events
                </li>
              </ul>
              <p>
                Questions or concerns? Reading this privacy notice will help you
                understand your privacy rights and choices. We are responsible
                for making decisions about how your information is processed. If
                you do not agree with our policies and practices, please do not
                use our services. If you still have questions or concerns,
                please contact us at{" "}
                <a
                  href="mailto:support@shiftscan.com"
                  className="text-app-blue underline"
                >
                  support@shiftscan.com
                </a>
              </p>

              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                Summary of key points
              </h2>
              <p>
                This summary provides key points from our privacy notice, but
                you can find more details about any of these topics by clicking
                the link following each key point or by using our table of
                contents below to find the section you are looking for.
              </p>
              <ul className="list-disc ml-4">
                <li>
                  <b>What personal information do we process?</b> When you
                  visit, use, or navigate our services, we may process personal
                  information depending on how you interact with us and the
                  services, the choices you make, and products and features you
                  use. We do not process sensitive personal information.
                </li>
                <li>
                  <b>Do we process any sensitive personal information?</b> Some
                  of the information may be considered special or sensitive in
                  certain jurisdictions for example your racial or ethnic or
                  origins, sexual orientations, and religious beliefs. We do not
                  process sensitive personal information.
                </li>
                <li>
                  <b>Do we collect any information from third parties?</b> Yes,
                  we share information in specific situations with affiliates,
                  business partners, and service providers (including for
                  services like the Google Maps Platform). We also allow certain
                  third parties to use tracking technologies on our services for
                  analytics and advertising.
                </li>
                <li>
                  <b>How do we process your information?</b> We process your
                  information to provide, improve and administer our services,
                  communicate with you, for security and fraud prevention, and
                  to comply with law. We may also process your information for
                  other purposes with your consent. We process your information
                  only when we have a valid legal reason to do so. Learn more
                  about how we process your information.
                </li>
                <li>
                  <b>
                    In what situations and with which parties do we share
                    personal information?
                  </b>{" "}
                  We share information in specific situations with specific
                  third parties. Learn more about when and with whom we share
                  your personal information.
                </li>
                <li>
                  <b>How do we keep your information safe?</b> We have adequate
                  organizational and technical processes and procedures in place
                  to protect your personal information. However, no electronic
                  transmission over the Internet or information storage
                  technology can be guaranteed to be 100% secure, so we cannot
                  promise or guarantee that hackers, cyber criminals or other
                  unauthorized third parties will not be able to defeat our
                  secure and improperly collect, access, steal, or modify your
                  information. Learn more about how we keep your information
                  safe.
                </li>
                <li>
                  <b>What are your rights?</b> Depending on where you are
                  located geographically, the applicable privacy laws may mean
                  you have certain rights regarding your personal information.
                  Learn more about your privacy rights.
                </li>
                <li>
                  <b>
                    Want to learn more about what we do with any information we
                    collect?
                  </b>{" "}
                  Review the Privacy notice in full.
                </li>
              </ul>

              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                TABLE OF CONTENTS
              </h2>
              <ol className="list-decimal ml-4">
                <li>What information do we collect?</li>
                <li>How do we process your information?</li>
                <li>
                  When and with whom do we share your personal information?
                </li>
                <li>Do we use cookies and other tracking technologies?</li>
                <li>How long do we keep your information?</li>
                <li>How do we keep your information safe?</li>
                <li>WHAT ARE YOUR PRIVACY RIGHTS?</li>
                <li>Controls for Do-Not-Track features.</li>
                <li>
                  Do United States residents have specific privacy rights?
                </li>
                <li>Do we make updates to this notice?</li>
                <li>How can you contact us about this notice?</li>
                <li>
                  How can you review, update, or delete the data we collect from
                  you?
                </li>
              </ol>

              {/* --- Section 1: WHAT INFORMATION DO WE COLLECT? --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                1. WHAT INFORMATION DO WE COLLECT?
              </h2>
              <p className="font-semibold">
                Personal information you disclose to us
              </p>
              <p>
                In short: We collect personal information that you provide to
                us.
              </p>
              <p>
                We collect personal information that you voluntarily provide to
                us when you register on the services, express an interest in
                obtaining information about us or our product and services, when
                you participate in activities on the service, or otherwise when
                you contact us.
              </p>
              <p>
                Personal information provided by you. The personal information
                that we collect depends on the context of your interaction with
                us and the service is, the choices you make, the products and
                features you use.
              </p>
              <ul className="list-disc ml-4">
                <li>name</li>
                <li>phone numbers</li>
                <li>email addresses</li>
                <li>usernames</li>
                <li>passwords</li>
                <li>location</li>
                <li>date of birth</li>
                <li>Signature</li>
              </ul>
              <p>
                <b>Sensitive information.</b> We do not process sensitive
                information.
              </p>
              <p className="font-semibold">Application Data.</p>
              <p>
                If you use our application(s), we also may collect the following
                information if you chose to provide us with access or
                permission:
              </p>
              <p>
                <b>Biometric Information.</b> Our application may allow you to
                use device native features, such as fingerprint or face
                recognition, for account access or verification. It is important
                to note that Streamline Precision LLC does not collect, store,
                or process your biometrics data (such as fingerprints or facial
                geometry). This data is stored solely on your local device,
                controlled by your device’s operating system, and is not
                transmitted to us or any third parties.
              </p>
              <p>
                <b>Mobile device access.</b> We may request access or permission
                to certain features from your mobile device including your
                mobile device's camera, camera roll, and other features. If you
                wish to change your access or permission you may do so in your
                device’s settings.
              </p>
              <p>
                <b>Mobile device data.</b> We automatically collect device
                information (such as your mobile device ID, model, and
                manufacturer), operating system, version information and system
                configuration information, device and application identification
                numbers, browser type and version, hardware model, internet
                service provider and/or mobile carrier, and Internet Protocol
                (IP) address (or proxy server). If you are using our
                application(s), we may also collect information about the phone
                network associated with your mobile device, your mobile device's
                operating system or platform, the type of mobile device you use,
                your mobile device's unique device ID, and information about the
                features of your application(s) you accessed.
              </p>
              <p>
                <b>Push notifications.</b> We may request to send you push
                notifications regarding your account or certain features of your
                application(s). If you wish to opt out from receiving these
                types of communications you may turn them off in your device’s
                settings.
              </p>
              <p>
                This information is primarily needed to maintain security and
                operations of our application(s), for troubleshooting, and for
                internal analytics and reporting purposes.
              </p>
              <p>
                All personal information that you provide to us must be true,
                complete, and accurate, and you must notify us of any changes to
                such personal information.
              </p>
              <p className="font-semibold">
                Information automatically collected
              </p>
              <p>
                In short: some information - such as your Internet Protocol (IP)
                address and/or browser and device characteristics - is collected
                automatically when you visit our Services.
              </p>
              <p>
                We automatically collect certain information when you visit,
                use, or navigate the Services. This information does not reveal
                your specific identity (like your name or contact information)
                but may include device and usage information, such as your IP
                address, browser and device characteristics, operating system,
                language preferences, referring URLs, device name, country,
                location, information about how and when you use our services,
                and other technical information. This information is primarily
                needed to maintain the security and operations of our services
                and for our internal analytic and reporting purposes.
              </p>
              <p>
                Like many businesses, we also collect information through
                cookies and similar Technologies.
              </p>
              <p>The information we collect includes:</p>
              <ul className="list-disc ml-4">
                <li>
                  <b>Log and usage data.</b> Log and usage data is information
                  pertaining to the function, security, and performance of our
                  services, which our servers automatically collect when you
                  access or use the Shift Scan application or website. We record
                  this information in log files. This data is strictly limited
                  to your activity within our services and is used solely for
                  internal purposes. This log data may include your IP address,
                  device information and browser type, and details about your
                  service usage (such as the date/time stamps associated with
                  your session, pages and files viewed, searches performed,
                  features utilized, and device event information, including
                  system activity and error reports).
                </li>
                <li>
                  <b>Device data.</b> We collect device data such as information
                  about your computer, phone, tablet, or other devices you use
                  to access the services. Depending on the device used, this
                  device data may include information such as your IP address
                  (or proxy server), device and application identification
                  numbers, location, browser type, hardware model, internet
                  service provider and/or mobile carrier, operating system, and
                  system configuration information.
                </li>
                <li>
                  <b>Location data.</b> We collect location data such as
                  information about your device’s location, which can be either
                  precise or imprecise. How much information we collect depends
                  on the type and setting of the device you use to access the
                  services. For example we may use GPS and other Technologies to
                  collect geolocation data that tells us your current location
                  based on your IP address you can opt out of allowing us to
                  collect this information either by refusing access to the
                  information or by disabling your location settings on the
                  device however if you choose to opt out you may not be able to
                  use certain aspects of the services.
                </li>
              </ul>
              <p>
                <b>Google Api</b>
                <br />
                Our use of information received from Google apis would hear to
                Google API Service User Data Policy including the Limited Use
                requirements.
              </p>

              {/* --- Section 2: HOW DO WE PROCESS YOUR INFORMATION? --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                2. HOW DO WE PROCESS YOUR INFORMATION?
              </h2>
              <p>
                In Short: We process your information to provide, improve, and
                administer our services, communicate with you, for security and
                fraud prevention, and to comply with law. We may also process
                your information for other purposes with your consent.
              </p>
              <p>
                We process your personal information for a variety of reasons
                depending on how you interact with our services, including:
              </p>
              <ul className="list-disc ml-4">
                <li>
                  To facilitate account creation and authentication and
                  otherwise manage users accounts. We may process your
                  information so you can create and log into your account, as
                  well as keep your account and working order.
                </li>
                <li>
                  To deliver and facilitate delivery of services to the user. We
                  may process your information to provide you with the requested
                  service.
                </li>
                <li>
                  To respond to user inquiries/offer support to users. We may
                  process your information to respond to your inquiries and
                  solve any potential issues you might have with the requested
                  service.
                </li>
                <li>
                  To send administrative information to you. We may process your
                  information to send you details about our product and
                  services, changes to our terms and policies, and other similar
                  information.
                </li>
                <li>
                  To fulfill and manage your orders. We may process your
                  information to fulfill and manage your orders payments returns
                  exchanges made through the services.
                </li>
                <li>
                  To enable users to use your communication. We may process your
                  information when necessary to request feedback and to contact
                  you about your use of our services.
                </li>
                <li>
                  To request feedback. We may process your information as
                  necessary to request feedback and to contact you about your
                  use of our services.
                </li>
                <li>
                  To send you marketing and promotional Communications. We may
                  process the personal information you send to us for our
                  marketing purposes, if this is in accordance with your
                  marketing preference you can opt out of our marketing emails
                  anytime for more information see “what are your privacy
                  rights?” below.
                </li>
                <li>
                  To post testimonials. We post testimonials on our services
                  that may contain personal information.
                </li>
                <li>
                  To protect our services. We may process your information as
                  part of our efforts to keep our services safe and secure,
                  including fraud monitoring and prevention.
                </li>
                <li>
                  To evaluate and improve our services, products, marketing, and
                  your experience. We may process your information when we
                  believe it’s necessary to identify usage trends, determine the
                  effectiveness of our promotional campaigns, and to evaluate
                  and improve our services, products, marketing, and your
                  experience.
                </li>
                <li>
                  To identify usage trends. We may process information about how
                  you use our services to better understand how they are being
                  used so we can improve them.
                </li>
                <li>
                  To determine the effectiveness of our marketing and
                  promotional campaigns. We may process your information to
                  better understand how to provide marketing and promotional
                  campaigns that are most relevant to you.
                </li>
                <li>
                  To comply with our legal obligations. We may process your
                  information to comply with our legal obligations, respond to
                  Legal requests, and exercise, establish, or defend our legal
                  rights.
                </li>
              </ul>

              {/* --- Section 3: WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION? --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
              </h2>
              <p>
                In short: we may share information in specific situations
                described in this section and/or with the following third
                parties.
              </p>
              <p>
                We may need to share your personal information in the following
                situations:
              </p>
              <ul className="list-disc ml-4">
                <li>
                  <b>Business transfers.</b> We may share or transfer your
                  information in connection with, or during negotiations of, any
                  merger, sale of company assets, financing, or acquisition of
                  all or a portion of our business to another company.
                </li>
                <li>
                  <b>When we use Google Maps platform APIs.</b> We may share
                  your information with certain Google Map platform APIs (e.g.,
                  Google Map API, Places API). Google Maps uses GPS, Wi-Fi, and
                  cell towers to estimate your location. GPS is accurate to
                  about 20 meters, while Wi-Fi and cell towers help improve
                  accuracy when GPS signals are weak, like indoors. This data
                  helps Google Maps provide directions, but it's not always
                  perfectly precise. We obtain and store on your devices (cache)
                  your location. Your consent anytime by contacting us at the
                  contact details provided at the end of this document.
                </li>
                <li>
                  <b>Affiliates.</b> We may share your information with our
                  Affiliates, in which cases we will require those Affiliates to
                  honor this privacy notice. Affiliates include our parent
                  companies and any subsidiaries, joint venture Partners, or
                  other companies that we control or that are under common
                  control with us.
                </li>
                <li>
                  <b>Business partners.</b> We may share your information with
                  our business partners to offer you certain products, Services,
                  or promotions.
                </li>
                <li>
                  <b>Other Users.</b> When you share personal information (for
                  example, by posting comments, contributions, or other content
                  to the services) or otherwise interact with public areas of
                  the services, such personal information may be viewed by all
                  users and may be publicly made available outside the services
                  in perpetuity. Similarly other users will be able to view
                  descriptions of your activity, communicate with you within our
                  services, and view your profile.
                </li>
              </ul>

              {/* --- Section 4: COOKIES AND TRACKING --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
              </h2>
              <p>
                In Short: we may use cookies and other tracking technologies to
                collect and store information.
              </p>
              <p>
                We may use cookies and similar tracking Technologies (like web
                beacons and pixels) to gather information when you interact with
                our services. Some online tracking technologies help us maintain
                the security of our services and your account, prevent crashes,
                fix bugs, save your preferences, and assist with basic site
                functions.
              </p>
              <p>
                We do not permit third parties or service providers to use
                online tracking technologies on our services to tailor
                advertisements to your interests, track your activity across
                other websites, or for behavioral advertising purposes that
                would constitute a "sale" or "sharing" of personal information
                under applicable US state laws. We only use cookies and similar
                tracking technologies as described above for security,
                functionality, and internal analytics of our own services.
              </p>
              <p>
                To the extent these online tracking Technologies are deemed to
                be a “sale”/”sharing” (which includes targeted advertising, as
                defined under the applicable laws) under applicable US state
                laws, you can opt out of these online tracking Technologies by
                submitting a request as described below under the section “DO
                UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?”
              </p>
              <p>
                Specific information about how we use such Technologies and how
                you can refuse certain cookies is set in our cookie notice.
              </p>

              {/* --- Section 5: DATA RETENTION --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                5. HOW LONG DO WE KEEP YOUR INFORMATION?
              </h2>
              <p>
                In short: we keep your information for as long as necessary to
                fulfill the purposes outlined in the privacy notice unless
                otherwise required by law.
              </p>
              <p>
                We will only keep your personal information for as long as it is
                needed for the purpose set out in the Privacy notice, unless a
                longer retention is required or permitted by law (such as tax,
                accounting, or other legal requirements). No purpose in this
                notice will require us keeping your personal information for
                longer than ninety six (96) months past the termination of your
                user’s account.
              </p>
              <p>
                When we have no ongoing legitimate business needs to process
                your personal information, we will either delete or anonymize
                such information, or, if this is not possible (for example
                because your personal information has been stored in backup
                archives), then we will securely store your personal information
                and isolate it from any further processing until deletion is
                possible.
              </p>

              {/* --- Section 6: DATA SECURITY --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                6. HOW DO WE KEEP YOUR INFORMATION SAFE?
              </h2>
              <p>
                In short: We aim to protect your personal information through a
                system of organizational and technical security measures.
              </p>
              <p>
                We have implemented appropriate and reasonable technical and
                organizational security measures designed to protect the
                security of any personal information we process. However,
                despite our safeguards and efforts to secure your information,
                no electronic transmission over the Internet or information
                storage technology can be guaranteed to be 100% secure, so we
                cannot promise or guarantee that hackers, cyber criminals, or
                other unauthorized third parties will not be able to defeat our
                security and improperly collect, access, steal or modify your
                information. Although we do our best to protect your personal
                information, transmission of personal information to and from
                our services is at your own risk. You should only access the
                services within a secure environment.
              </p>

              {/* --- Section 7: PRIVACY RIGHTS --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                7. WHAT ARE YOUR PRIVACY RIGHTS?
              </h2>
              <p>
                In short: You may review, change, or terminate your account at
                any time, depending on your country, province, or state of
                residence.
              </p>
              <p>
                <b>Withdrawing your consent:</b> If we are relying on your
                consent to process your personal information, which may be
                expressed and/or implied consent depending on the applicable
                law, you have the right to withdraw your consent at any time.
                You can withdraw your consent at any time by contacting Us by
                using the contact details provided in this section “HOW CAN YOU
                CONTACT US ABOUT THIS NOTICE?” below.
              </p>
              <p>
                However, please note that this will not affect the lawfulness of
                the processing before it's withdrawn nor, when applicable law
                allows, will it affect the process of your personal information
                conducted in Reliance on lawful processing grounds other than
                consent.
              </p>
              <p>
                <b>Opting out of marketing and promotional Communications:</b>{" "}
                You can unsubscribe from our marketing and promotional
                Communications at any time by clicking on the unsubscribe Link
                in the emails that we sent, or by contacting us using the
                details provided in this section “HOW CAN YOU CONTACT US ABOUT
                THIS NOTICE?” below. You will then be removed from the marketing
                list. However, we may still communicate with you - for example,
                to send you service related messages that are necessary for your
                Administration and use of your account, to respond to service
                requests, or for other non-marketing purposes.
              </p>
              <p className="font-semibold">ACCOUNT INFORMATION</p>
              <ul className="list-disc ml-4">
                <li>
                  If you would at any time like to review or change the
                  information in your account or terminate your account you can:
                </li>
                <li>Edit personal information on your profile page</li>
                <li>
                  You may contact your account administrator to edit and
                  terminate your account
                </li>
                <li>
                  Your account administrator may edit/terminate your account
                  whenever
                </li>
              </ul>
              <p>
                Upon your request to terminate your account, we will deactivate
                or delete your accounts and information from our active
                databases. However, we may retain some information in our files
                to prevent fraud, troubleshooting problems, assist with any
                investigations, and enforce our legal terms and/or comply with
                applicable legal requirements.
              </p>
              <p>
                <b>Cookies and similar Technologies:</b> Most web browsers are
                set to accept cookies by default. If you prefer, you can usually
                choose to set your browser to remove cookies and to reject
                cookies. If you choose to remove cookies or reject cookies, this
                could affect certain features or services of our Services.
              </p>
              <p>
                If you have any questions or comments about your privacy rights
                you may email us at{" "}
                <a
                  href="mailto:support@shiftscan.com"
                  className="text-app-blue underline"
                >
                  support@shiftscan.com
                </a>
                .
              </p>

              {/* --- Section 8: DO-NOT-TRACK --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                8. CONTROLS FOR DO-NOT-TRACK FEATURES
              </h2>
              <p>
                Most web browsers and some mobile operating systems and mobile
                applications include a Do-Not-Track (“DNT”) feature or setting
                you can activate to signal your privacy preference not to have
                data about your online browsing activity monitored and
                collected. At this stage, no uniform technology standard for
                recognizing and implementing DNT signals has been finalized. As
                such, we do not currently respond to DNT browser signals or any
                other mechanism that automates communication of your choice not
                to be tracked online. If a standard for online tracking is
                adopted that we must follow in the future we will inform you
                about the practice in a revised version of this privacy notice.
              </p>
              <p>
                California law requires us to let you know how we respond to web
                browser DNT signals. Because there currently is not an industry
                or legal standard for recognizing or honoring DNT signals, we do
                not respond to them at this time.
              </p>

              {/* --- Section 9: US RESIDENTS' RIGHTS & TABLE --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                9. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
              </h2>
              <p>
                In short: If you are a resident of California, Colorado,
                Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky,
                Maryland, Minnesota, Montana, Nebraska, New Hampshire, New
                Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, Virginia,
                you may have the right to request access to and receive details
                about the personal information we maintain about you and how we
                have processed it, correct inaccuracies, get a copy of, or
                delete your personal information. You may also have the right to
                withdraw your consent to our processing of your personal
                information. These rights may be limited in some circumstances
                by applicable law. More information is provided below.
              </p>

              <div className="overflow-x-auto my-4">
                <table className="min-w-full border text-xs">
                  <thead>
                    <tr className="bg-app-blue text-white">
                      <th className="border px-2 py-1">Category</th>
                      <th className="border px-2 py-1">Examples</th>
                      <th className="border px-2 py-1">Collected</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">A. Identifiers</td>
                      <td className="border px-2 py-1">
                        Contact details, such as real name, alias, postal
                        address, telephone or mobile contact number, unique
                        personal identifier, online identifier, internet
                        protocol address, email address, and account name
                      </td>
                      <td className="border px-2 py-1">YES</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        B. Personal information as defined in California
                        Customer Records statute
                      </td>
                      <td className="border px-2 py-1">
                        Name, contact information, education, employment,
                        employment history, and financial information
                      </td>
                      <td className="border px-2 py-1">YES</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        C. Protected classification characteristics under state
                        or federal law
                      </td>
                      <td className="border px-2 py-1">
                        Gender, age, date of birth, race and ethnicity, national
                        origin, marital status, and other demographic data
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        D. Commercial Information
                      </td>
                      <td className="border px-2 py-1">
                        Transaction information, purchase history, financial
                        details, and payment information
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        E. Biometric Information
                      </td>
                      <td className="border px-2 py-1">
                        Fingerprint and voiceprints
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        F. Internet or other similar network activity
                      </td>
                      <td className="border px-2 py-1">
                        Browsing history, search history, online behavior,
                        interest data, and interactions with our and other
                        websites, applications, systems, and advertisements
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">G. Geolocation data</td>
                      <td className="border px-2 py-1">Device location</td>
                      <td className="border px-2 py-1">YES</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        H. Audio, electronic, sensory, or similar information
                      </td>
                      <td className="border px-2 py-1">
                        Images and audio, video or call recording created in
                        connection with our business activities.
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        I. Professional or employment-related information
                      </td>
                      <td className="border px-2 py-1">
                        Business contact details in order to provide you our
                        services at a business level or job title, work history,
                        and professional qualifications if you apply for a job
                        with us
                      </td>
                      <td className="border px-2 py-1">YES</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        J. Education Information
                      </td>
                      <td className="border px-2 py-1">
                        Student records and directory information
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        K. Inferences drawn from collected personnel information
                      </td>
                      <td className="border px-2 py-1">
                        Inference drawn from any of the collected personal
                        information listed above to create a profile or summary
                        about, for example an individual’s preference and
                        characteristics
                      </td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">
                        L. Sensitive Personal Information
                      </td>
                      <td className="border px-2 py-1"></td>
                      <td className="border px-2 py-1">NO</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* --- The rest of the policy continues as in your provided text, with sections 10, 11, 12, etc. --- */}
              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                10. DO WE MAKE UPDATES TO THIS NOTICE?
              </h2>
              <p>
                In short: Yes, we will update this notice as necessary to stay
                compliant with relevant laws.
              </p>
              <p>
                We may update this Privacy Notice from time to time. The updated
                version will be indicated by an updated “Revised” date at the
                top of this Privacy Notice. If we make material changes to this
                privacy Notice, we may notify you either by prominently posting
                a notice of such change or by directly sending a notification.
                We encourage you to review this Privacy Notice frequently to be
                informed of how we are protecting your information.
              </p>

              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
              </h2>
              <p>
                If you have questions or comments about this notice, you may
                email us at{" "}
                <a
                  href="mailto:support@shiftscan.com"
                  className="text-app-blue underline"
                >
                  support@shiftscan.com
                </a>{" "}
                or contact us by post at:
              </p>
              <p>
                Streamline Precision LLC
                <br />
                120 S 100 W<br />
                Burley, ID 83318
                <br />
                United States
              </p>

              <h2 className="font-semibold text-app-dark-blue mb-2 mt-6">
                12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT
                FROM YOU?
              </h2>
              <p>
                Based on the applicable laws of your country or state of
                residence in the US, you may have the right to request access to
                the personal information we collect from you, details about how
                we have processed it, correct inaccuracies, or delete your
                personal information. You may also have the right to withdraw
                your consent to our processing of your personal information.
                These rights may be limited in some circumstances by applicable
                law. To request to review, update, or delete your personal
                information, please fill out and submit a{" "}
                <a
                  href="/privacy-policy/dsa-request"
                  className="text-app-blue underline"
                >
                  data subject access request
                </a>
                .
              </p>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white/98 backdrop-blur-sm border-t border-gray-200 p-4 z-10">
            <div className="text-center">
              <a
                href="/"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
