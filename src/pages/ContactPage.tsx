import React from "react"; // Removed useState as form is no longer present
import { MapPin, Phone, Mail, Clock } from "lucide-react"; // Removed Send as form is no longer present

const ContactPage: React.FC = () => {
  // Removed formData, handleSubmit, and handleChange as the form is gone

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              Ready to start your road construction project? Get in touch with
              our expert team for a free consultation and detailed quote.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information - Now takes full width on small screens, half on large */}
            <div className="lg:col-span-1 space-y-8">
              {" "}
              {/* Added lg:col-span-1 for explicit layout */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 text-md mb-8">
                  We're here to help bring your road construction vision to
                  life. Contact us through any of the channels below or visit
                  our offices.
                </p>
              </div>
              {/* Office Locations */}
              <div className="space-y-6">
                {/* Head Office */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-teal-500 mr-2" />
                    Head Office - Abia
                  </h3>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p>No. 1, Nnono Oboro Ikwuano Abia State, Nigeria</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-teal-500 mr-2" />
                      <a
                        href="tel:+2348065438080"
                        className="hover:text-teal-500 text-sm"
                      >
                        +234 806 512 2463
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-orange-teal mr-2" />
                      <span className="text-sm">Mon - Fri: 8:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Branch Office */}
                {/* <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-teal-500 mr-2" />
                    Branch Office - Uyo
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      Trinity Plaza 2nd Floor Right Wing Ring Road 3, Before
                      Hensek Asphalt Yard Uyo, Akwa Ibom State
                    </p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-teal-500 mr-2" />
                      <a
                        href="tel:+2348029006984"
                        className="hover:text-teal-500"
                      >
                        +234 802 900 6984
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-teal-500 mr-2" />
                      <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </div> */}
              </div>
              {/* Quick Contact */}
              <div className="bg-teal-50 p-6 rounded-xl">
                <h3 className="text-md font-semibold text-gray-900 mb-4">
                  Quick Contact
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+2348065438080"
                    className="flex items-center text-sm text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Call Us: +234 806 512 2463 , +234 902 888 8797
                  </a>
                  <a
                    href="mailto:info@itekconstruction.com"
                    className="flex items-center text-sm text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    Email: onapalconstructionltd@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map Section - Now takes full width on small screens, half on large */}
            <div className="lg:col-span-1 space-y-8">
              {" "}
              {/* Added lg:col-span-1 for explicit layout */}
              <h2 className="text-xl font-bold text-gray-900 mb-8 lg:mb-6">
                Our Locations
              </h2>{" "}
              {/* Adjusted margin for better spacing */}
              <div className="grid grid-cols-1 gap-8">
                {" "}
                {/* Removed lg:grid-cols-2 as maps are now side-by-side with contact info */}
                {/* Abuja Map */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d15884.687938940939!2d7.496124000000001!3d5.541497!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMzInMjkuNCJOIDfCsDI5JzQ2LjEiRQ!5e0!3m2!1sen!2sus!4v1761040163582!5m2!1sen!2sus"
                    width="600"
                    height="450"
                    style={{border:0}}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  {/* <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.882193574163!2d7.472750374944883!3d9.088362090956425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0a4d0f7a5b1b%3A0xf67b7e5f8f8f8f8f!2sGarki%20Mall!5e0!3m2!1sen!2sng!4v1678901234567!5m2!1sen!2sng"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Abia Head Office"
                  ></iframe> */}
                </div>
                {/* Uyo Map */}
                {/* <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.766723225893!2d7.91578327490333!3d5.035760294901416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105d1bb9e5a6c8e3%3A0x2f90a18f8e8f8e8f!2sTrinity%20Plaza!5e0!3m2!1sen!2sng!4v1678901234567!5m2!1sen!2sng"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Uyo Branch Office"
                  ></iframe>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
