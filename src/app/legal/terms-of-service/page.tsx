export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introducción y Aceptación</h2>
          <p className="text-muted-foreground mb-3">
            Bienvenido a LeadManager. Estos Términos de Servicio (&ldquo;Términos&rdquo;) rigen su acceso y uso de nuestra plataforma, 
            servicios, aplicaciones y sitio web (colectivamente, el &ldquo;Servicio&rdquo;).
          </p>
          <p className="text-muted-foreground mb-3">
            Al crear una cuenta, acceder o utilizar el Servicio, usted acepta estar legalmente vinculado por estos Términos. 
            Si no está de acuerdo con alguna parte de estos Términos, no debe utilizar nuestro Servicio.
          </p>
          <p className="text-muted-foreground">
            Si está utilizando el Servicio en nombre de una organización, usted declara y garantiza que tiene la autoridad 
            para vincular a dicha organización a estos Términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Uso Permitido de la Plataforma</h2>
          <p className="text-muted-foreground mb-3">
            LeadManager es una plataforma diseñada para conectar vendedores con gestores de leads, facilitando la creación, 
            gestión y monetización de leads de calidad.
          </p>
          <p className="text-muted-foreground mb-3">
            Usted se compromete a utilizar el Servicio únicamente para propósitos legítimos y de acuerdo con estos Términos. 
            Específicamente, usted se compromete a NO:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Violar cualquier ley o regulación local, nacional o internacional</li>
            <li>Infringir los derechos de propiedad intelectual de terceros</li>
            <li>Transmitir contenido fraudulento, engañoso, difamatorio u ofensivo</li>
            <li>Intentar obtener acceso no autorizado a sistemas o cuentas</li>
            <li>Interferir con el funcionamiento adecuado del Servicio</li>
            <li>Utilizar el Servicio para spam, phishing o cualquier actividad maliciosa</li>
            <li>Recopilar datos de usuarios sin su consentimiento</li>
            <li>Suplantar la identidad de otra persona u organización</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Responsabilidades sobre la Cuenta</h2>
          <p className="text-muted-foreground mb-3">
            Al crear una cuenta en LeadManager, usted es responsable de:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Proporcionar información precisa, actual y completa durante el proceso de registro</li>
            <li>Mantener la seguridad y confidencialidad de sus credenciales de acceso</li>
            <li>Actualizar su información de cuenta cuando sea necesario</li>
            <li>Notificarnos inmediatamente de cualquier uso no autorizado de su cuenta</li>
            <li>Todas las actividades que ocurran bajo su cuenta</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            LeadManager no será responsable de ninguna pérdida o daño derivado del incumplimiento de estas obligaciones 
            de seguridad.
          </p>
          <p className="text-muted-foreground">
            Nos reservamos el derecho de deshabilitar cualquier cuenta que consideremos que viola estos Términos o que 
            pueda causar daño al Servicio o a otros usuarios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Reglas sobre Ofertas, Leads y Propuestas</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">4.1. Creación de Ofertas</h3>
          <p className="text-muted-foreground mb-3">
            Los vendedores pueden crear ofertas en la plataforma. Al crear una oferta, el vendedor se compromete a:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Proporcionar información precisa y completa sobre los requisitos del lead</li>
            <li>Establecer criterios claros y razonables de aceptación</li>
            <li>Definir precios justos y transparentes</li>
            <li>Revisar las propuestas recibidas de manera oportuna</li>
            <li>Honrar los términos de la oferta una vez aceptada una propuesta</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">4.2. Envío de Propuestas</h3>
          <p className="text-muted-foreground mb-3">
            Los gestores de leads pueden enviar propuestas para ofertas disponibles. Al enviar una propuesta, el gestor 
            de leads se compromete a:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Proporcionar información veraz y verificable sobre el lead propuesto</li>
            <li>Asegurar que el lead cumple con los criterios especificados en la oferta</li>
            <li>Tener el consentimiento apropiado del lead para compartir su información</li>
            <li>Trabajar activamente en las asignaciones aceptadas</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">4.3. Asignaciones y Calificación</h3>
          <p className="text-muted-foreground mb-3">
            Una vez que una propuesta es aceptada, se crea una asignación. El gestor de leads debe:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Trabajar diligentemente en la calificación del lead</li>
            <li>Proporcionar actualizaciones regulares sobre el progreso</li>
            <li>Marcar la asignación como GANADA o PERDIDA de manera honesta y oportuna</li>
            <li>Proporcionar documentación o evidencia cuando sea solicitada</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">4.4. Pagos</h3>
          <p className="text-muted-foreground mb-3">
            Los pagos se generan automáticamente cuando un lead es marcado como GANADO. Los términos de pago incluyen:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Los pagos se procesan según el cronograma establecido en la plataforma</li>
            <li>El monto del pago corresponde al precio especificado en la oferta original</li>
            <li>LeadManager puede retener una comisión por el servicio de la plataforma</li>
            <li>Cualquier disputa sobre pagos debe resolverse a través de nuestro proceso de resolución de conflictos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">5.1. Propiedad de LeadManager</h3>
          <p className="text-muted-foreground mb-3">
            El Servicio y todo su contenido, características y funcionalidad (incluyendo pero no limitado a toda la 
            información, software, código, texto, gráficos, logotipos, iconos, imágenes, clips de audio, descargas y 
            compilaciones de datos) son propiedad de LeadManager, sus licenciantes u otros proveedores de dicho material.
          </p>
          <p className="text-muted-foreground mb-3">
            Estos están protegidos por derechos de autor, marcas comerciales, patentes, secretos comerciales y otras 
            leyes de propiedad intelectual o derechos de propiedad.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">5.2. Contenido del Usuario</h3>
          <p className="text-muted-foreground mb-3">
            Usted conserva todos los derechos sobre el contenido que carga, publica o muestra en el Servicio. Sin embargo, 
            al hacerlo, nos otorga una licencia mundial, no exclusiva, libre de regalías para usar, reproducir, modificar, 
            adaptar y mostrar dicho contenido con el fin de proporcionar y mejorar el Servicio.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">5.3. Marcas Comerciales</h3>
          <p className="text-muted-foreground">
            &ldquo;LeadManager&rdquo; y nuestros logotipos son marcas comerciales de nuestra empresa. No puede usar estas marcas 
            sin nuestro permiso previo por escrito.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitaciones de Responsabilidad</h2>
          <p className="text-muted-foreground mb-3">
            En la máxima medida permitida por la ley aplicable, LeadManager y sus afiliados, directores, empleados y 
            agentes no serán responsables de:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Daños indirectos, incidentales, especiales, consecuentes o punitivos</li>
            <li>Pérdida de beneficios, ingresos, datos o uso</li>
            <li>Daños derivados de su uso o incapacidad de usar el Servicio</li>
            <li>Daños causados por terceros o contenido de terceros en el Servicio</li>
            <li>Interrupciones o errores en el Servicio</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            El Servicio se proporciona &ldquo;tal cual&rdquo; y &ldquo;según disponibilidad&rdquo; sin garantías de ningún tipo, ya sean expresas 
            o implícitas. No garantizamos que el Servicio será ininterrumpido, seguro o libre de errores.
          </p>
          <p className="text-muted-foreground">
            Nuestra responsabilidad total hacia usted por cualquier reclamo relacionado con el Servicio está limitada 
            al monto que nos haya pagado en los 12 meses anteriores al evento que dio lugar al reclamo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Suspensión y Terminación de Cuentas</h2>
          <p className="text-muted-foreground mb-3">
            Nos reservamos el derecho de suspender o terminar su cuenta y acceso al Servicio, a nuestra sola discreción, 
            sin previo aviso y sin responsabilidad, por cualquier motivo, incluyendo pero no limitado a:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Violación de estos Términos de Servicio</li>
            <li>Conducta fraudulenta o actividad sospechosa</li>
            <li>Solicitud de autoridades gubernamentales o legales</li>
            <li>Interrupción imprevista del Servicio por razones técnicas o de seguridad</li>
            <li>Participación en actividades que dañen la reputación de LeadManager</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Usted puede cancelar su cuenta en cualquier momento contactando nuestro servicio de soporte. Al cancelar:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Perderá acceso a su cuenta y todo el contenido asociado</li>
            <li>Seguirá siendo responsable de cualquier obligación pendiente</li>
            <li>Los pagos pendientes se procesarán según nuestras políticas</li>
          </ul>
          <p className="text-muted-foreground">
            Las disposiciones de estos Términos que por su naturaleza deben sobrevivir a la terminación, sobrevivirán, 
            incluyendo las disposiciones sobre propiedad intelectual, exenciones de garantía y limitaciones de responsabilidad.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Legislación Aplicable y Resolución de Disputas</h2>
          <p className="text-muted-foreground mb-3">
            Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta sus 
            disposiciones sobre conflicto de leyes.
          </p>
          <p className="text-muted-foreground mb-3">
            Cualquier disputa que surja de o en relación con estos Términos o el Servicio deberá resolverse primero 
            a través de negociaciones de buena fe entre las partes.
          </p>
          <p className="text-muted-foreground mb-3">
            Si no se puede resolver la disputa mediante negociación, las partes acuerdan someterse a la jurisdicción 
            exclusiva de los tribunales competentes.
          </p>
          <p className="text-muted-foreground">
            Usted renuncia a su derecho a participar en demandas colectivas o acciones de clase contra LeadManager.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Modificaciones a los Términos</h2>
          <p className="text-muted-foreground mb-3">
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Cuando realicemos cambios 
            materiales, le notificaremos mediante:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Un aviso destacado en nuestra plataforma</li>
            <li>Una notificación por correo electrónico a la dirección asociada con su cuenta</li>
            <li>Una actualización de la fecha &ldquo;Última actualización&rdquo; en la parte superior de estos Términos</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Su uso continuado del Servicio después de la publicación de los Términos revisados constituye su aceptación 
            de los cambios. Si no está de acuerdo con los nuevos Términos, debe dejar de usar el Servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Disposiciones Generales</h2>
          <p className="text-muted-foreground mb-3">
            <strong>Integridad del Acuerdo:</strong> Estos Términos constituyen el acuerdo completo entre usted y 
            LeadManager con respecto al Servicio y reemplazan todos los acuerdos anteriores.
          </p>
          <p className="text-muted-foreground mb-3">
            <strong>Divisibilidad:</strong> Si alguna disposición de estos Términos se considera inválida o inaplicable, 
            dicha disposición se modificará o eliminará en la medida necesaria, y las disposiciones restantes permanecerán 
            en pleno vigor y efecto.
          </p>
          <p className="text-muted-foreground mb-3">
            <strong>Renuncia:</strong> La falta de ejercicio o aplicación de cualquier derecho o disposición de estos 
            Términos no constituirá una renuncia a dicho derecho o disposición.
          </p>
          <p className="text-muted-foreground">
            <strong>Cesión:</strong> No puede ceder o transferir estos Términos sin nuestro consentimiento previo por 
            escrito. Podemos ceder nuestros derechos bajo estos Términos sin su consentimiento.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contacto</h2>
          <p className="text-muted-foreground mb-3">
            Si tiene preguntas, comentarios o inquietudes sobre estos Términos de Servicio, puede contactarnos a través de:
          </p>
          <ul className="list-none text-muted-foreground ml-4 space-y-2">
            <li><strong>Correo electrónico:</strong> legal@leadmanager.com</li>
            <li><strong>Dirección postal:</strong> LeadManager, Departamento Legal</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Nos esforzamos por responder a todas las consultas dentro de un plazo razonable.
          </p>
        </section>
      </div>
    </div>
  );
}
