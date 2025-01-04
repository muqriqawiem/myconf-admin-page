
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TiThMenu } from "react-icons/ti";
import { AiOutlineClose } from "react-icons/ai"; // Import the close icon
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Framer motion variants for opening and closing the menu
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: "-100%", // Slide up when hidden
    },
    visible: {
      opacity: 1,
      y: 0, // Slide down into view when visible
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: "-100%", // Slide back up when exiting
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  // Icon animation for hamburger to cross
  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }, // Smooth icon rotation when menu is open
  };

  return (
    <nav className="p-2 backdrop-blur-3xl shadow-background sticky top-0 z-50 ">
      {/* Mobile Navigation */}
      <div className="lg:hidden flex justify-between items-center ">
        <div className="flex gap-2">
          {/* Animate the Hamburger Menu to Cross */}
          <motion.div
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
            initial={false}
            animate={open ? "open" : "closed"}
            variants={iconVariants}
          >
            {open ? (
              <AiOutlineClose size={25} />
            ) : (
              <TiThMenu size={25} />
            )}
          </motion.div>

          <Link href="/" className="text-xl font-bold">
            <Image src={"/AdroidCMTLogo.png"} alt={"MYCONF"} width={150} height={100} />
          </Link>
        </div>

        <div>
          {/* {session ? "hello" : (
            <div className="flex gap-4 items-center">
              <Link href="/sign-in">
                <Button className="p-2 h-8 rounded-sm" variant={'ghost'}>
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="p-2 h-8 rounded-sm" variant={'default'}>
                  Sign up
                </Button>
              </Link>
            </div>
          )} */}
        </div>
      </div>

      {/* Animate Presence for handling open/close transitions */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute min-h-screen min-w-full bg-white z-40 flex flex-col justify-center items-center" // Full screen overlay
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="flex flex-col gap-6 text-center mt-4"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Link href="/conferences" className="hover:font-bold" onClick={() => setOpen(false)}>
                Conferences
              </Link>
              <Link href="/users" className="hover:font-bold" onClick={() => setOpen(false)}>
                Users
              </Link>
              {/* <Link href="/smart-sub" className="hover:font-bold" onClick={() => setOpen(false)}>
                SmartSub
              </Link> */}
              {/* <Link href="/pricing" className="hover:font-bold" onClick={() => setOpen(false)}>
                Pricing
              </Link> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <div className="hidden container mx-auto lg:flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          <Image src={"/AdroidCMTLogo.png"} alt={"MYCONF"} width={150} height={100} />
        </Link>
        <div className="flex flex-col lg:flex-row gap-6 text-center">
          <Link href="/conferences" className="hover:font-bold" onClick={() => setOpen(false)}>
                Conferences
              </Link>
          <Link href="/users" className="hover:font-bold">
            Users
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
