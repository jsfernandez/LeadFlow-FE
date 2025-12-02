"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Landing Page for Empresas
 * Allows companies to pre-register to receive validated leads
 */
export default function LandingEmpresasPage() {
  const [formData, setFormData] = useState({
    empresa: "",
    rubro: "",
    responsable: "",
    email: "",
    telefono: "",
    tamano: "",
    tipoLead: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic validation
    if (
      !formData.empresa ||
      !formData.rubro ||
      !formData.responsable ||
      !formData.email ||
      !formData.telefono ||
      !formData.tamano ||
      !formData.tipoLead
    ) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/preregistro-empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar el formulario");
      }

      setSuccess(true);
      setFormData({
        empresa: "",
        rubro: "",
        responsable: "",
        email: "",
        telefono: "",
        tamano: "",
        tipoLead: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el formulario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Recibe, conecta y convierte.
            </h1>
            <p className="mb-8 sm:mb-10 text-base sm:text-lg md:text-2xl text-muted-foreground px-2 sm:px-0">
              Recibe leads validados y calificados sin necesidad de hacer ventas frías. Conecta con clientes que realmente necesitan tus soluciones.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-b border-border bg-background py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-12 sm:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight">
              ¿Cómo funciona?
            </h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Recomendación</h3>
              <p className="text-sm text-muted-foreground">
                Nuestra red de conectores identifica personas que necesitan tus soluciones y las recomienda.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Validación</h3>
              <p className="text-sm text-muted-foreground">
                Nuestro equipo valida y califica cada lead para asegurar que cumpla con tus criterios de aceptación.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Lead listo para agendar</h3>
              <p className="text-sm text-muted-foreground">
                Recibe leads calificados y listos para contactar. Sin ventas frías, solo conexiones de calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="border-b border-border bg-secondary/20 py-12 sm:py-16 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl text-center">
                  Registro
                </CardTitle>
                <p className="text-center text-muted-foreground mt-2">
                  Completa el formulario y te contactaremos pronto
                </p>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
                    <p className="text-primary font-semibold">
                      ¡Gracias por tu interés! Te contactaremos pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Empresa */}
                    <div className="space-y-2">
                      <Label htmlFor="empresa">
                        Empresa <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="empresa"
                        type="text"
                        placeholder="Nombre de tu empresa"
                        value={formData.empresa}
                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Rubro */}
                    <div className="space-y-2">
                      <Label htmlFor="rubro">
                        Rubro <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="rubro"
                        type="text"
                        placeholder="Ej: Tecnología, Retail, Servicios"
                        value={formData.rubro}
                        onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Responsable */}
                    <div className="space-y-2">
                      <Label htmlFor="responsable">
                        Responsable <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="responsable"
                        type="text"
                        placeholder="Nombre del responsable"
                        value={formData.responsable}
                        onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contacto@empresa.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                      <Label htmlFor="telefono">
                        Teléfono <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="telefono"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Tamaño */}
                    <div className="space-y-2">
                      <Label htmlFor="tamano">
                        Tamaño de la empresa <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.tamano}
                        onValueChange={(value) => setFormData({ ...formData, tamano: value })}
                        disabled={isLoading}
                        required
                      >
                        <SelectTrigger id="tamano">
                          <SelectValue placeholder="Selecciona el tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pequena">Pequeña (1-10)</SelectItem>
                          <SelectItem value="mediana">Mediana (11-50)</SelectItem>
                          <SelectItem value="grande">Grande (51+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tipo de lead */}
                    <div className="space-y-2">
                      <Label htmlFor="tipoLead">
                        Tipo de lead <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.tipoLead}
                        onValueChange={(value) => setFormData({ ...formData, tipoLead: value })}
                        disabled={isLoading}
                        required
                      >
                        <SelectTrigger id="tipoLead">
                          <SelectValue placeholder="Selecciona el tipo de lead" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="B2B">B2B</SelectItem>
                          <SelectItem value="B2C">B2C</SelectItem>
                          <SelectItem value="ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {error && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                      {isLoading ? "Enviando..." : "Registrarse"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/30 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LeadManager. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

