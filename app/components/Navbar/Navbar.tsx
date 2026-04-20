"use client"

import { useState } from 'react'
import Link from 'next/link'
import ContactModal from '../ContactModal/ContantModal'

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <nav className="relative w-full bg-white dark:bg-black border-b border-panel flex items-center justify-between px-8 py-4">

        <div className="text-4xl text-third dark:text-secondary hover:text-primary transition-all duration-300 hover:scale-110" style={{ fontFamily: 'var(--font-grape-nuts)' }}>
          <Link href="/">Edgar Buttner</Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-16">
          <Link href="/" className="text-lg font-body text-accent dark:text-secondary hover:text-primary transition-all duration-300 hover:scale-115">Home</Link>
          <Link href="/pages/about" className="text-lg font-body text-accent dark:text-secondary hover:text-primary transition-all duration-300 hover:scale-115">About</Link>
          <Link href="/pages/projects" className="text-lg font-body text-accent dark:text-secondary hover:text-primary transition-all duration-300 hover:scale-115">Projects</Link>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-white text-third px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:shadow-[0_4px_18px_rgba(0,120,211,0.45)] hover:scale-110 transition-all duration-200 shadow-sm"
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