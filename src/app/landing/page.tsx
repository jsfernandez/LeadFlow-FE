"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { Menu, X } from "lucide-react";

/**
 * Public Landing Page Component
 * Full dark corporate design with responsive layout
 * Includes: hero, how it works, benefits, testimonials, footer
 * Bilingual support (ENG/ESP) via language toggle in header
 * Authentication forms available via login/register dialogs
 */
export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openLoginDialog = () => {
    setAuthMode("login");
    setAuthDialogOpen(true);
    setMobileMenuOpen(false);
  };

  const openRegisterDialog = () => {
    setAuthMode("register");
    setAuthDialogOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Language Toggle */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-xl font-bold">
              Lead<span className="text-primary">Manager</span>
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.nav.features")}
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.nav.howItWorks")}
            </a>
            <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.nav.benefits")}
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("landing.nav.testimonials")}
            </a>
          </nav>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary p-1">
              <button
                onClick={() => setLanguage("en")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ENG
              </button>
              <button
                onClick={() => setLanguage("es")}
                className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                  language === "es"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ESP
              </button>
            </div>
            <Button onClick={openLoginDialog} variant="ghost" size="sm">
              {t("auth.login.title")}
            </Button>
            <Button onClick={openRegisterDialog} size="sm">
              {t("landing.nav.getStarted")}
            </Button>
          </div>

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden rounded-md p-2 hover:bg-accent"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle>{t("landing.nav.menu") || "Menu"}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 mt-6">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("landing.nav.features")}
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("landing.nav.howItWorks")}
              </a>
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("landing.nav.benefits")}
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("landing.nav.testimonials")}
              </a>
            </nav>

            {/* Language Toggle Mobile */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">{t("common.language") || "Language"}</span>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-1">
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                    language === "en"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ENG
                </button>
                <button
                  onClick={() => setLanguage("es")}
                  className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                    language === "es"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ESP
                </button>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button onClick={openLoginDialog} variant="ghost" className="w-full">
                {t("auth.login.title")}
              </Button>
              <Button onClick={openRegisterDialog} className="w-full">
                {t("landing.nav.getStarted")}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              {t("landing.hero.title")}
            </h1>
            <p className="mb-8 sm:mb-10 text-base sm:text-lg md:text-2xl text-muted-foreground px-2 sm:px-0">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0">
              <Button size="lg" onClick={openRegisterDialog} className="w-full sm:w-auto">
                {t("landing.hero.cta")}
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="w-full sm:w-auto">
                {t("landing.hero.ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-b border-border bg-background py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("landing.howItWorks.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("landing.howItWorks.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 grid-cols-1 md:grid-cols-5">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("landing.howItWorks.step1.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("landing.howItWorks.step1.description")}</p>
            </div>

            {/* Arrow */}
            <div className="hidden items-center justify-center md:flex">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("landing.howItWorks.step2.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("landing.howItWorks.step2.description")}</p>
            </div>

            {/* Arrow */}
            <div className="hidden items-center justify-center md:flex">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("landing.howItWorks.step3.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("landing.howItWorks.step3.description")}</p>
            </div>
          </div>

          <div className="mx-auto mt-6 sm:mt-8 grid max-w-5xl gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3 md:px-16">
            {/* Arrow Down on Mobile */}
            <div className="flex items-center justify-center md:hidden">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                4
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("landing.howItWorks.step4.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("landing.howItWorks.step4.description")}</p>
            </div>

            {/* Arrow */}
            <div className="hidden items-center justify-center md:flex">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                5
              </div>
              <h3 className="mb-2 text-xl font-semibold">{t("landing.howItWorks.step5.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("landing.howItWorks.step5.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="border-b border-border bg-secondary/20 py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("landing.benefits.title")}
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 sm:gap-12 grid-cols-1 lg:grid-cols-2">
            {/* Benefits for Sellers */}
            <div>
              <div className="mb-6 sm:mb-8">
                <h3 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold">{t("landing.benefits.sellers.title")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t("landing.benefits.sellers.subtitle")}</p>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.sellers.benefit1.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.sellers.benefit1.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.sellers.benefit2.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.sellers.benefit2.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.sellers.benefit3.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.sellers.benefit3.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.sellers.benefit4.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.sellers.benefit4.description")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Benefits for Lead Managers */}
            <div>
              <div className="mb-6 sm:mb-8">
                <h3 className="mb-2 text-xl sm:text-2xl md:text-3xl font-bold">{t("landing.benefits.leadManagers.title")}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t("landing.benefits.leadManagers.subtitle")}</p>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.leadManagers.benefit1.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.leadManagers.benefit1.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.leadManagers.benefit2.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.leadManagers.benefit2.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.leadManagers.benefit3.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.leadManagers.benefit3.description")}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t("landing.benefits.leadManagers.benefit4.title")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("landing.benefits.leadManagers.benefit4.description")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="border-b border-border bg-background py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("landing.testimonials.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("landing.testimonials.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm italic text-muted-foreground">
                  &ldquo;{t("landing.testimonials.testimonial1.quote")}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{t("landing.testimonials.testimonial1.author")}</p>
                  <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial1.role")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm italic text-muted-foreground">
                  &ldquo;{t("landing.testimonials.testimonial2.quote")}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{t("landing.testimonials.testimonial2.author")}</p>
                  <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial2.role")}</p>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm italic text-muted-foreground">
                  &ldquo;{t("landing.testimonials.testimonial3.quote")}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{t("landing.testimonials.testimonial3.author")}</p>
                  <p className="text-sm text-muted-foreground">{t("landing.testimonials.testimonial3.role")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
            {/* Brand */}
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="text-xl font-bold">
                  Lead<span className="text-primary">Manager</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t("landing.footer.tagline")}</p>
            </div>

            {/* Legal */}
            <div className="text-center">
              <h4 className="mb-3 sm:mb-4 font-semibold text-sm sm:text-base">{t("legal.title")}</h4>
              <ul className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <li>
                  <a href="/legal/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("legal.privacyPolicy")}
                  </a>
                </li>
                <li>
                  <a href="/legal/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("legal.termsOfService")}
                  </a>
                </li>
                <li>
                  <a href="/legal/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                    {t("legal.cookiesPolicy")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 border-t border-border pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            {t("landing.footer.copyright")}
          </div>
        </div>
      </footer>

      {/* Authentication Dialog */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-md">
          {authMode === "login" ? (
            <LoginForm
              onToggleToRegister={() => setAuthMode("register")}
            />
          ) : (
            <RegisterForm
              onToggleToLogin={() => setAuthMode("login")}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
