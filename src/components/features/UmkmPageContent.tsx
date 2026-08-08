'use client';

import { useState } from 'react';
import Link from 'next/link';
import UmkmHeroSection from './UmkmHeroSection';
import UmkmFilterGrid from './UmkmFilterGrid';

export default function UmkmPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="flex flex-col w-full bg-surface">
      {/* Breadcrumb Header */}
      <div className="px-margin-desktop py-4 bg-surface-container-low max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-2 text-label-caps text-text-muted font-body-base">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">UMKM</span>
        </div>
      </div>

      {/* Hero Section with Search */}
      <UmkmHeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Filter & Cards Grid */}
      <UmkmFilterGrid
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </div>
  );
}
