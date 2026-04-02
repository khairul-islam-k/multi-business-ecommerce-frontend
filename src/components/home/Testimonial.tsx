'use client';

import React from 'react';
import { motion } from "framer-motion";
import Image from 'next/image';
import { StarFilled } from '@ant-design/icons';

import user_1 from "@/assets/user-1.jpeg";
import user_2 from "@/assets/user-2.jpeg";
import user_3 from "@/assets/user-3.jpg";
import animateLogo from "@/assets/testimony.webp";
import Logo from '../shared/logo';
import { theme } from 'antd';

/* ----------------------------------
   Hover animation for cards
----------------------------------- */
const cardHoverAnimation = {
  whileHover: {
    y: -10,
    scale: 1.03,
    boxShadow: "0px 20px 40px rgba(0,0,0,0.35)",
    transition: {
      type: "spring" as const, // Type-safe
      stiffness: 200,
      damping: 15,
    },
  },
};

const Testimonial = () => {
    const {token} = theme.useToken();

  return (
    <div
    style={{color: token.colorTextHeading}}
    className="pt-10 px-2 md:px-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-[1200px] mx-auto">

        {/* LEFT TEXT */}
        <div className="md:w-1/2">
          <h3 className="font-semibold">TESTIMONIALS</h3>
          <h2 className="text-2xl font-bold">From our Clients</h2>
          <p className="mt-2">
            Use these awesome forms to login or create new account in your project
            for free.
          </p>

          {/* Floating image animation */}
          <motion.div
            animate={{ y: [20, 50, 20] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="mt-6"
          >
            <Image
              src={animateLogo}
              width={300}
              height={300}
              alt="banner"
            />
          </motion.div>
        </div>

        {/* RIGHT CARDS */}
        <div className="md:w-1/2 flex flex-col gap-5">

          {/* CARD ROW 1 */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* CARD 1 */}
            <motion.div
              {...cardHoverAnimation}
              className="max-w-md rounded-2xl shadow-lg p-6 flex flex-col justify-between"
              style={{background: token.colorBgElevated}}
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-4">
                <Logo />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex space-x-1 text-yellow-400"
                >
                  <StarFilled />
                  <StarFilled />
                  <StarFilled />
                  <StarFilled />
                  <StarFilled />
                </motion.div>
              </div>

              {/* Middle */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">E-commerce</h3>
                <p className="text-sm">
                  OneComm made launching my online business so easy. The setup
                  was quick, the design templates are beautiful, and I love that
                  I’m not stuck paying monthly fees like other platforms.
                </p>
              </div>

              {/* Bottom */}
              <div className="flex items-center gap-3 mt-auto">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full overflow-hidden"
                >
                  <Image src={user_1} alt="Md Tamim" width={40} height={40} />
                </motion.div>
                <div>
                  <p className="font-semibold mb-0">Md Tamim</p>
                  <p className="text-sm">Founder</p>
                </div>
              </div>
            </motion.div>

            {/* CARD 2 */}
            <motion.div
              {...cardHoverAnimation}
              className="max-w-md rounded-2xl shadow-lg p-6 flex flex-col justify-between"
              style={{background: token.colorBgElevated}}
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-4">
                <Logo />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex space-x-1 text-yellow-400"
                >
                  <StarFilled />
                  <StarFilled />
                  <StarFilled />
                  <StarFilled />
                  <StarFilled />
                </motion.div>
              </div>

              {/* Middle */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">E-commerce</h3>
                <p className="text-sm">
                  OneComm made launching my online business so easy. The setup
                  was quick, the design templates are beautiful, and I love that
                  I’m not stuck paying monthly fees like other platforms.
                </p>
              </div>

              {/* Bottom */}
              <div className="flex items-center gap-3 mt-auto">
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3 }}
                  className="w-10 h-10 rounded-full overflow-hidden"
                >
                  <Image src={user_2} alt="Md Tamim" width={40} height={40} />
                </motion.div>
                <div>
                  <p className="font-semibold mb-0">Md Tamim</p>
                  <p className="text-sm">Founder</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CARD 3 */}
          <motion.div
            {...cardHoverAnimation}
            className="max-w-md rounded-2xl shadow-lg p-6 flex flex-col justify-between mx-auto "
            style={{background: token.colorBgElevated}}
          >
            {/* Top */}
            <div className="flex items-center justify-between mb-4">
              <Logo />
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex space-x-1 text-yellow-400"
              >
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
                <StarFilled />
              </motion.div>
            </div>

            {/* Middle */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">E-commerce</h3>
              <p className="text-sm">
                What I love most is the full control I have over my store — from
                hosting to customizing features. The Laravel framework keeps
                things fast and secure, and the support team is super responsive.
              </p>
            </div>

            {/* Bottom */}
            <div className="flex items-center gap-3 mt-auto">
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-full overflow-hidden"
              >
                <Image src={user_3} alt="Mr. Sakib" width={40} height={40} />
              </motion.div>
              <div>
                <p className="font-semibold mb-0">Mr. Sakib</p>
                <p className="text-sm">Owner</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Testimonial;