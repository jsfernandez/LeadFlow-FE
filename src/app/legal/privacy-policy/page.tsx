export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
          <p className="text-muted-foreground mb-3">
            En LeadManager, nos comprometemos a proteger su privacidad y sus datos personales. Esta Política de Privacidad 
            explica qué información recopilamos, cómo la utilizamos, con quién la compartimos y qué derechos tiene sobre 
            sus datos personales.
          </p>
          <p className="text-muted-foreground">
            Al utilizar nuestra plataforma, usted acepta las prácticas descritas en esta política. Le recomendamos leer 
            este documento detenidamente para comprender cómo manejamos su información.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Datos que Recopilamos</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">2.1. Datos Proporcionados por el Usuario</h3>
          <p className="text-muted-foreground mb-2">
            Recopilamos la información que usted nos proporciona directamente al:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Crear una cuenta (nombre, correo electrónico, contraseña)</li>
            <li>Completar su perfil de usuario</li>
            <li>Crear ofertas o enviar propuestas de leads</li>
            <li>Comunicarse con nuestro equipo de soporte</li>
            <li>Participar en encuestas o promociones</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.2. Datos Recopilados Automáticamente</h3>
          <p className="text-muted-foreground mb-2">
            Cuando utiliza LeadManager, recopilamos automáticamente cierta información, incluyendo:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Dirección IP y ubicación geográfica aproximada</li>
            <li>Tipo de dispositivo, navegador y sistema operativo</li>
            <li>Páginas visitadas y acciones realizadas en la plataforma</li>
            <li>Fecha y hora de acceso</li>
            <li>Datos de cookies y tecnologías similares</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.3. Datos de Terceros</h3>
          <p className="text-muted-foreground">
            Podemos recibir información adicional sobre usted de terceros, como proveedores de servicios de autenticación, 
            proveedores de datos comerciales o redes sociales, si decide vincular su cuenta de LeadManager con estos servicios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Uso de los Datos</h2>
          <p className="text-muted-foreground mb-2">
            Utilizamos los datos recopilados para los siguientes propósitos:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">3.1. Operación del Servicio</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Proporcionar, mantener y mejorar nuestros servicios</li>
            <li>Procesar transacciones y gestionar pagos</li>
            <li>Facilitar la comunicación entre vendedores y gestores de leads</li>
            <li>Personalizar su experiencia en la plataforma</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">3.2. Comunicación y Notificaciones</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Enviar notificaciones sobre actividades relevantes en su cuenta</li>
            <li>Responder a sus consultas y solicitudes de soporte</li>
            <li>Enviar actualizaciones sobre nuestros servicios y novedades</li>
            <li>Solicitar feedback y realizar encuestas de satisfacción</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">3.3. Cumplimiento Legal y Seguridad</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Cumplir con obligaciones legales y regulatorias</li>
            <li>Detectar, prevenir y abordar fraudes y actividades ilegales</li>
            <li>Proteger los derechos, propiedad y seguridad de LeadManager y sus usuarios</li>
            <li>Resolver disputas y hacer cumplir nuestros términos de servicio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Conservación y Eliminación de Datos</h2>
          <p className="text-muted-foreground mb-3">
            Conservamos sus datos personales durante el tiempo necesario para cumplir con los propósitos descritos en esta 
            política, a menos que la ley exija o permita un período de retención más largo.
          </p>
          <p className="text-muted-foreground mb-3">
            Cuando decida cerrar su cuenta, eliminaremos o anonimizaremos sus datos personales dentro de un período razonable, 
            salvo que debamos conservar cierta información para cumplir con obligaciones legales, resolver disputas o hacer 
            cumplir nuestros acuerdos.
          </p>
          <p className="text-muted-foreground">
            Los criterios utilizados para determinar nuestros períodos de retención incluyen la naturaleza de los datos, 
            los propósitos del procesamiento y los requisitos legales aplicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Compartición de Datos</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">5.1. Empresas Involucradas en la Transacción</h3>
          <p className="text-muted-foreground mb-3">
            Compartimos ciertos datos entre vendedores y gestores de leads para facilitar las transacciones de leads. 
            La información compartida se limita a lo necesario para la operación del servicio y está sujeta a acuerdos 
            de confidencialidad.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">5.2. Proveedores de Servicios</h3>
          <p className="text-muted-foreground mb-3">
            Trabajamos con proveedores de servicios externos que nos ayudan a operar nuestra plataforma, incluyendo:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Servicios de hosting y almacenamiento en la nube</li>
            <li>Procesadores de pagos</li>
            <li>Servicios de análisis y monitoreo</li>
            <li>Herramientas de comunicación y marketing</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Estos proveedores solo tienen acceso a los datos necesarios para realizar sus funciones y están obligados 
            contractualmente a proteger su información.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">5.3. Autoridades y Cumplimiento Legal</h3>
          <p className="text-muted-foreground">
            Podemos divulgar su información si es requerido por ley, orden judicial, proceso legal o solicitud gubernamental, 
            o cuando creamos de buena fe que la divulgación es necesaria para proteger nuestros derechos, su seguridad o 
            la seguridad de otros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Seguridad y Medidas Técnicas</h2>
          <p className="text-muted-foreground mb-3">
            Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger sus datos 
            personales contra acceso no autorizado, pérdida, destrucción o alteración. Estas medidas incluyen:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Encriptación de datos en tránsito y en reposo</li>
            <li>Controles de acceso basados en roles</li>
            <li>Monitoreo continuo de seguridad y auditorías regulares</li>
            <li>Capacitación del personal en prácticas de seguridad de datos</li>
            <li>Protocolos de respuesta a incidentes de seguridad</li>
          </ul>
          <p className="text-muted-foreground">
            Sin embargo, ningún sistema de seguridad es completamente infalible. Por lo tanto, no podemos garantizar 
            la seguridad absoluta de su información. Usted también es responsable de mantener la seguridad de sus 
            credenciales de cuenta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Derechos del Usuario</h2>
          <p className="text-muted-foreground mb-3">
            Dependiendo de su ubicación, puede tener ciertos derechos con respecto a sus datos personales, incluyendo:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre usted</li>
            <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos</li>
            <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos personales</li>
            <li><strong>Portabilidad:</strong> Solicitar una copia de sus datos en un formato estructurado y legible</li>
            <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos para ciertos propósitos</li>
            <li><strong>Limitación:</strong> Solicitar la restricción del procesamiento de sus datos</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Para ejercer cualquiera de estos derechos, puede contactarnos a través de los medios indicados en la 
            sección &ldquo;Contacto&rdquo; a continuación.
          </p>
          <p className="text-muted-foreground">
            También tiene derecho a presentar una queja ante la autoridad de protección de datos de su jurisdicción 
            si considera que el procesamiento de sus datos personales viola las leyes aplicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Actualizaciones de la Política</h2>
          <p className="text-muted-foreground mb-3">
            Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente para reflejar cambios 
            en nuestras prácticas, tecnología, requisitos legales y otros factores.
          </p>
          <p className="text-muted-foreground mb-3">
            Cuando realicemos cambios materiales a esta política, le notificaremos mediante un aviso destacado en 
            nuestra plataforma o por correo electrónico. Le recomendamos revisar esta política regularmente para 
            mantenerse informado sobre cómo protegemos su información.
          </p>
          <p className="text-muted-foreground">
            El uso continuado de nuestros servicios después de la publicación de cambios constituye su aceptación 
            de dichos cambios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
          <p className="text-muted-foreground mb-3">
            Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o nuestras 
            prácticas de manejo de datos, puede contactarnos a través de:
          </p>
          <ul className="list-none text-muted-foreground ml-4 space-y-2">
            <li><strong>Correo electrónico:</strong> privacy@leadmanager.com</li>
            <li><strong>Dirección postal:</strong> LeadManager, Departamento de Privacidad</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Haremos nuestro mejor esfuerzo para responder a su consulta dentro de un plazo razonable, generalmente 
            no superior a 30 días.
          </p>
        </section>
      </div>
    </div>
  );
}
