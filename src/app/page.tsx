"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Root Page - Redirects to Landing Page
 * All unauthenticated users are redirected to /landing
 * This ensures the landing page is the default entry point
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/landing");
  }, [router]);

  return null;
}
