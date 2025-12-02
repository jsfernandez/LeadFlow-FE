import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mockProvider } from "@/lib/mockProvider";

/**
 * Validation schema for pre-registration persona
 */
const preRegistroPersonaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  tipoContactos: z.string().min(1, "El tipo de contactos es requerido"),
});

/**
 * POST /api/preregistro-personas
 * Creates a new pre-registration for personas/conectores
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = preRegistroPersonaSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    // Check API mode - for now, we'll use mockProvider
    // In production, this could check NEXT_PUBLIC_API_MODE and route to real API
    const apiMode = process.env.NEXT_PUBLIC_API_MODE || "mock";

    if (apiMode === "mock") {
      // Store in mock provider
      const preRegistro = await mockProvider.createPreRegistroPersona(validationResult.data);
      return NextResponse.json(
        {
          success: true,
          data: preRegistro,
          message: "Pre-registro creado exitosamente",
        },
        { status: 201 }
      );
    } else {
      // In real mode, you would call the actual backend API here
      // For now, we'll still use mockProvider as fallback
      const preRegistro = await mockProvider.createPreRegistroPersona(validationResult.data);
      return NextResponse.json(
        {
          success: true,
          data: preRegistro,
          message: "Pre-registro creado exitosamente",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error creating pre-registro persona:", error);
    return NextResponse.json(
      {
        error: "Error al procesar la solicitud",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

