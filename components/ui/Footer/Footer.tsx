import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaGithub, FaInstagram, FaTiktok } from 'react-icons/fa';
import Logo from '@/components/icons/Logo';
import GitHub from '@/components/icons/GitHub';

export default function Footer() {
  return (
    <footer className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="text-center">
        <div>
          <Link href="/" aria-label="Brand" className="flex-none text-xl font-semibold text-black dark:text-white">
            Brand
          </Link>
        </div>
        <div className="mt-3">
          <p className="text-gray-250 dark:text-neutral-500">
            All rights reserved by Altin Kukaj 2024.
          </p>
        </div>
        <div className="mt-3 space-x-2">
          <a
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
            href="https://www.tiktok.com/@ai.ltin"
            aria-label="TikTok"
          >
            <FaTiktok className="flex-shrink-0 size-5.5" />
          </a>
          <a
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
            href="https://x.com/A_i_Tini"
            aria-label="Twitter"
          >
            <FaTwitter className="flex-shrink-0 size-5.5" />
          </a>
          <a
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
            href="https://github.com/altink14"
            aria-label="GitHub"
          >
            <FaGithub className="flex-shrink-0 size-5.5" />
          </a>
          <a
            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
            href="https://www.instagram.com/ai.ltin/?next=%2F"
            aria-label="Instagram"
          >
            <FaInstagram className="flex-shrink-0 size-5.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}