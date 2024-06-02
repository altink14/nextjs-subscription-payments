'use client';

import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  return (
    <div className={`${s.navbar} ${s.flexRow} ${s.justifyBetween} ${s.alignCenter}`}>
      <div className="w-full flex justify-between">

        <nav className="flex justify-center items-center ml-6 space-x-2">
        <Link href="/" className="" aria-label="Home">
          <img src="/logo.png" alt="Logo" style={{ height: '50px', marginRight: '20px' }} />
        </Link>
        <div className=''>
          {user && (
            <div className='space-x-4'>
              <Link href="/account" className={s.link}>Account</Link>
              <Link href="/private" className={s.link}>Studio</Link>
              <Link href="#about" className={s.link}>About</Link>
            </div>
          )}
          </div>
      <div style={{ marginLeft: '475px' }}>
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={usePathname()} />
            <button type="submit" className={s.link}>Sign out</button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>Sign In</Link>
        )}
      </div>
        </nav>
      </div>
     
    </div>
  );
}