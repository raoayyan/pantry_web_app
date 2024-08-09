"use client";
import React, { useState } from 'react';
import PantryItemList from '@/container/pantry/pantry';



export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <PantryItemList  />
    </main>
  );
}
