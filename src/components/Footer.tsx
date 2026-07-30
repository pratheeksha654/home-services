"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#08090D] border-t border-[#C8A55E]/20 text-[#ECEDF0]">
      <div className="max-w-7xl mx-auto px-8 py-14">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="FixNest Logo"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>

            <p className="mt-4 text-[#9CA0AE] leading-7">
              Smart Home Repair &
              <br />
              Field Service Platform
            </p>

            <p className="mt-6 text-[#5C6070] text-sm leading-7 max-w-xs">
              Connecting homes with trusted professionals for all your repair and
              maintenance needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold text-[#C8A55E] mb-6">
              Quick Links
            </h2>

            <ul className="space-y-4 text-[#9CA0AE]">
              <li className="hover:text-[#C8A55E] transition-colors duration-200"><Link href="/customer">Home</Link></li>
              <li className="hover:text-[#C8A55E] transition-colors duration-200"><Link href="/about">About</Link></li>
              <li className="hover:text-[#C8A55E] transition-colors duration-200"><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li className="hover:text-[#C8A55E] transition-colors duration-200"><Link href="/terms">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold text-[#C8A55E] mb-6">
              Contact Us
            </h2>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <Phone className="text-[#C8A55E]" />
                <div>
                  <p>+91 XXXXX XXXXX</p>
                  <span className="text-[#5C6070] text-sm">
                    Mon - Sat : 9:00 AM - 7:00 PM
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-[#C8A55E]" />
                <div>
                  <p>support@fixnest.com</p>
                  <span className="text-[#5C6070] text-sm">
                    We reply within 24 hours
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-[#C8A55E]" />
                <div>
                  <p>Mangalore, Karnataka</p>
                  <span className="text-[#5C6070] text-sm">
                    India
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Social */}
          <div>
            <h2 className="text-xl font-semibold text-[#C8A55E] mb-6">
              Follow Us
            </h2>

            <div className="flex gap-4">

              <div className="p-3 rounded-full border border-[#C8A55E]/30 hover:bg-[#C8A55E] hover:text-black cursor-pointer transition">
                <FaFacebookF size={22} />
              </div>

              <div className="p-3 rounded-full border border-[#C8A55E]/30 hover:bg-[#C8A55E] hover:text-black cursor-pointer transition">
                <FaInstagram size={22} />
              </div>

              <div className="p-3 rounded-full border border-[#C8A55E]/30 hover:bg-[#C8A55E] hover:text-black cursor-pointer transition">
                <FaLinkedinIn size={22} />
              </div>

            </div>

            <p className="mt-6 text-[#5C6070] leading-7">
              Stay connected for updates,
              <br />
              offers and more!
            </p>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-12 border-t border-[#C8A55E]/20 pt-6 text-center text-[#9CA0AE]">
          © 2026 <span className="text-[#C8A55E] font-semibold">FixNest</span>.
          All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}
