'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return (
      <div className="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
        <Link
          href="/signin"
          className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 flex items-center"
        >
          Entrar
        </Link>
        <Link
          href="/signup"
          className="text-sm font-semibold leading-6 text-white bg-primary-600 px-3 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          Criar conta
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="hidden md:inline-block text-sm font-medium text-gray-700">
          {session.user.name || 'Usuário'}
        </span>
        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User profile'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary-100">
              <span className="text-primary-700 text-sm font-medium">
                {(session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U').toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
          <div className="px-4 py-3">
            <p className="text-sm">{session.user.name}</p>
            <p className="text-xs font-medium text-gray-500 truncate">{session.user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Perfil
            </Link>
            <Link
              href="/my-events"
              className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
              Meus Eventos
            </Link>
            {session.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Admin
              </Link>
            )}
          </div>
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="text-gray-700 group flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}