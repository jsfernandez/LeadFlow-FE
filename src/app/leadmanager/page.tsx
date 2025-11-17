"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage } from "@/contexts/language-context";
import { RegisterForm } from "@/components/auth/register-form";
import { 
  Menu, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Users, 
  FileCheck, 
  BarChart3,
  CheckCircle2,
  Lock,
  Eye
} from "lucide-react";

/**
 * Lead Manager Landing Page Component
 * Dedicated landing page for Lead Managers with:
 * - Hero section with specific messaging
 * - Benefits section with 6 cards
 * - Earnings model with simulator
 * - How it works (5 steps)
 * - Legal & Compliance section
 * - Testimonials (3 hardcoded)
 * - FAQ section
 * - Final CTA
 * Bilingual support (ENG/ESP) via language context
 */
export default function LeadManagerLandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Earnings simulator state
  const [leadCount, setLeadCount] = useState(10);
  const [avgPayment, setAvgPayment] = useState(50);
  const estimatedEarnings = leadCount * avgPayment;

  const openRegisterDialog = () => {
    setRegisterDialogOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Language Toggle */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Lead<span className="text-primary">Manager</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("leadManagerLanding.nav.benefits")}
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("leadManagerLanding.nav.howItWorks")}
            </a>
            <a href="#earnings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("leadManagerLanding.nav.earnings")}
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {t("leadManagerLanding.nav.faq")}
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
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
            <Button onClick={openRegisterDialog} size="sm">
              {t("leadManagerLanding.nav.getStarted")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
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
            <nav className="flex flex-col gap-4">
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("leadManagerLanding.nav.benefits")}
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("leadManagerLanding.nav.howItWorks")}
              </a>
              <a
                href="#earnings"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("leadManagerLanding.nav.earnings")}
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("leadManagerLanding.nav.faq")}
              </a>
            </nav>

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

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button onClick={openRegisterDialog} className="w-full">
                {t("leadManagerLanding.nav.getStarted")}
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
              {t("leadManagerLanding.hero.title")}
            </h1>
            <p className="mb-8 sm:mb-10 text-base sm:text-lg md:text-2xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.hero.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row px-4 sm:px-0">
              <Button size="lg" onClick={openRegisterDialog} className="w-full sm:w-auto">
                {t("leadManagerLanding.hero.ctaPrimary")}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} 
                className="w-full sm:w-auto"
              >
                {t("leadManagerLanding.hero.ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="border-b border-border bg-background py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.benefits.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.benefits.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Benefit 1 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.benefits.benefit1.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.benefits.benefit1.description")}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 2 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.benefits.benefit2.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.benefits.benefit2.description")}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 3 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.benefits.benefit3.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.benefits.benefit3.description")}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 4 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.benefits.benefit4.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.benefits.benefit4.description")}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 5 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.benefits.benefit5.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.benefits.benefit5.description")}
                </p>
              </CardContent>
            </Card>

            {/* Benefit 6 */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.benefits.benefit6.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.benefits.benefit6.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Earnings Model Section */}
      <section id="earnings" className="border-b border-border bg-secondary/20 py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.earnings.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.earnings.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 sm:gap-12 grid-cols-1 lg:grid-cols-2 mb-12">
            {/* Fixed Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("leadManagerLanding.earnings.fixedPayment.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("leadManagerLanding.earnings.fixedPayment.description")}
                </p>
              </CardContent>
            </Card>

            {/* Percentage Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("leadManagerLanding.earnings.percentagePayment.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("leadManagerLanding.earnings.percentagePayment.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Simulator */}
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">{t("leadManagerLanding.earnings.simulator.title")}</CardTitle>
                <p className="text-center text-muted-foreground">{t("leadManagerLanding.earnings.simulator.description")}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("leadManagerLanding.earnings.simulator.leadCount")}: {leadCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={leadCount}
                    onChange={(e) => setLeadCount(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("leadManagerLanding.earnings.simulator.avgPayment")}: ${avgPayment}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={avgPayment}
                    onChange={(e) => setAvgPayment(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {t("leadManagerLanding.earnings.simulator.estimatedEarnings")}
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      ${estimatedEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-b border-border bg-background py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.howItWorks.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.howItWorks.subtitle")}
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t("leadManagerLanding.howItWorks.step1.title")}</h3>
                <p className="text-muted-foreground">{t("leadManagerLanding.howItWorks.step1.description")}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t("leadManagerLanding.howItWorks.step2.title")}</h3>
                <p className="text-muted-foreground">{t("leadManagerLanding.howItWorks.step2.description")}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t("leadManagerLanding.howItWorks.step3.title")}</h3>
                <p className="text-muted-foreground">{t("leadManagerLanding.howItWorks.step3.description")}</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t("leadManagerLanding.howItWorks.step4.title")}</h3>
                <p className="text-muted-foreground">{t("leadManagerLanding.howItWorks.step4.description")}</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                5
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">{t("leadManagerLanding.howItWorks.step5.title")}</h3>
                <p className="text-muted-foreground">{t("leadManagerLanding.howItWorks.step5.description")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal & Compliance Section */}
      <section className="border-b border-border bg-secondary/20 py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.legal.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.legal.subtitle")}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 grid-cols-1 md:grid-cols-3">
            {/* Data Ownership */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.legal.dataOwnership.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.legal.dataOwnership.description")}
                </p>
              </CardContent>
            </Card>

            {/* Anonymization */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.legal.anonymization.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.legal.anonymization.description")}
                </p>
              </CardContent>
            </Card>

            {/* Compliance */}
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t("leadManagerLanding.legal.compliance.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("leadManagerLanding.legal.compliance.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-b border-border bg-background py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.testimonials.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.testimonials.subtitle")}
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
                  &ldquo;{t("leadManagerLanding.testimonials.testimonial1.quote")}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{t("leadManagerLanding.testimonials.testimonial1.author")}</p>
                  <p className="text-sm text-muted-foreground">{t("leadManagerLanding.testimonials.testimonial1.role")}</p>
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
                  &ldquo;{t("leadManagerLanding.testimonials.testimonial2.quote")}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{t("leadManagerLanding.testimonials.testimonial2.author")}</p>
                  <p className="text-sm text-muted-foreground">{t("leadManagerLanding.testimonials.testimonial2.role")}</p>
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
                  &ldquo;{t("leadManagerLanding.testimonials.testimonial3.quote")}&rdquo;
                </p>
                <div>
                  <p className="font-semibold">{t("leadManagerLanding.testimonials.testimonial3.author")}</p>
                  <p className="text-sm text-muted-foreground">{t("leadManagerLanding.testimonials.testimonial3.role")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="border-b border-border bg-secondary/20 py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.faq.title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2 sm:px-0">
              {t("leadManagerLanding.faq.subtitle")}
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            {/* Question 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("leadManagerLanding.faq.question1.q")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("leadManagerLanding.faq.question1.a")}</p>
              </CardContent>
            </Card>

            {/* Question 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("leadManagerLanding.faq.question2.q")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("leadManagerLanding.faq.question2.a")}</p>
              </CardContent>
            </Card>

            {/* Question 3 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("leadManagerLanding.faq.question3.q")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("leadManagerLanding.faq.question3.a")}</p>
              </CardContent>
            </Card>

            {/* Question 4 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("leadManagerLanding.faq.question4.q")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("leadManagerLanding.faq.question4.a")}</p>
              </CardContent>
            </Card>

            {/* Question 5 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t("leadManagerLanding.faq.question5.q")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("leadManagerLanding.faq.question5.a")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-b from-background to-secondary/20 py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {t("leadManagerLanding.finalCta.title")}
            </h2>
            <p className="mb-8 text-lg sm:text-xl text-muted-foreground">
              {t("leadManagerLanding.finalCta.subtitle")}
            </p>
            <Button size="lg" onClick={openRegisterDialog} className="text-base px-8">
              {t("leadManagerLanding.finalCta.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">
                  Lead<span className="text-primary">Manager</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t("landing.footer.tagline")}</p>
            </div>

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

      {/* Registration Dialog */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="w-[95vw] max-w-[400px] sm:max-w-md">
          <RegisterForm onToggleToLogin={() => setRegisterDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
