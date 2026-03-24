"use client"

import { useState } from 'react'
import Link from 'next/link'
import ContactModal from '../ContactModal/ContantModal'

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <nav className="relative w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 py-4">

        <div className="text-2xl font-italic text-gray-900 dark:text-white">
          <Link href="/">Edgar Buttner</Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-16">
          <Link href="/">Home</Link>
          <Link href="/pages/about">About</Link>
          <Link href="/pages/projects">Projects</Link>
        </div>

        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
        >
          Get In Touch
        </button>

      </nav>

      {modalOpen && (
        <ContactModal onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}