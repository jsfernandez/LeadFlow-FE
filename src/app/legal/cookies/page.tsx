export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Política de Cookies</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. ¿Qué son las Cookies?</h2>
          <p className="text-muted-foreground mb-3">
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (ordenador, tablet o móvil) 
            cuando visita nuestro sitio web. Estos archivos permiten que el sitio web recuerde sus acciones y 
            preferencias durante un período de tiempo.
          </p>
          <p className="text-muted-foreground mb-3">
            Las cookies no dañan su dispositivo ni contienen virus. Son herramientas fundamentales para que muchos 
            sitios web funcionen de manera eficiente y proporcionen información valiosa a los propietarios del sitio.
          </p>
          <p className="text-muted-foreground">
            LeadManager utiliza cookies para mejorar su experiencia, facilitando la navegación y permitiendo que 
            determinadas funcionalidades operen correctamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Tipos de Cookies que Utilizamos</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">2.1. Cookies Esenciales</h3>
          <p className="text-muted-foreground mb-3">
            Estas cookies son estrictamente necesarias para el funcionamiento del sitio web y no pueden desactivarse 
            en nuestros sistemas. Generalmente solo se establecen en respuesta a acciones realizadas por usted que 
            equivalen a una solicitud de servicios, tales como:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Establecer sus preferencias de privacidad</li>
            <li>Iniciar sesión en la plataforma</li>
            <li>Completar formularios</li>
            <li>Mantener la seguridad durante la navegación</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Sin estas cookies, algunos servicios que ha solicitado no pueden proporcionarse. Estas cookies no almacenan 
            información personal identificable.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.2. Cookies de Rendimiento</h3>
          <p className="text-muted-foreground mb-3">
            Estas cookies nos permiten contar las visitas y fuentes de tráfico para medir y mejorar el rendimiento de 
            nuestro sitio. Nos ayudan a saber qué páginas son las más y las menos populares y ver cómo los visitantes 
            se mueven por el sitio.
          </p>
          <p className="text-muted-foreground mb-3">
            La información que recopilan estas cookies es agregada y, por lo tanto, anónima. Utilizamos estos datos para:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Analizar patrones de uso del sitio</li>
            <li>Identificar y solucionar errores técnicos</li>
            <li>Optimizar la velocidad de carga de las páginas</li>
            <li>Mejorar la arquitectura de información</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.3. Cookies de Funcionalidad y Preferencias</h3>
          <p className="text-muted-foreground mb-3">
            Estas cookies permiten que el sitio web recuerde las elecciones que realiza (como su idioma preferido o 
            tema visual) y proporcione características mejoradas y más personales. También pueden usarse para recordar 
            cambios que ha realizado en:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Preferencia de idioma (Español/Inglés)</li>
            <li>Configuración de tema (claro/oscuro)</li>
            <li>Tamaño de texto y otras opciones de visualización</li>
            <li>Filtros aplicados en tablas y listados</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Si no permite estas cookies, es posible que algunos o todos estos servicios no funcionen correctamente.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">2.4. Cookies de Terceros</h3>
          <p className="text-muted-foreground mb-3">
            En algunos casos, utilizamos cookies proporcionadas por terceros de confianza. LeadManager puede utilizar 
            servicios de terceros para:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Analíticas y medición de audiencia (para entender cómo se utiliza nuestro sitio)</li>
            <li>Servicios de autenticación</li>
            <li>Optimización de rendimiento y distribución de contenido</li>
            <li>Detección de fraude y seguridad</li>
          </ul>
          <p className="text-muted-foreground">
            Estas cookies de terceros están sujetas a las políticas de privacidad de sus respectivos proveedores. 
            Le recomendamos revisar sus políticas para comprender cómo manejan sus datos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Finalidad de las Cookies en la Plataforma</h2>
          <p className="text-muted-foreground mb-3">
            En LeadManager, utilizamos cookies para múltiples propósitos específicos que mejoran su experiencia:
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">3.1. Gestión de Sesión</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Mantener su sesión activa mientras navega por la plataforma</li>
            <li>Recordar su estado de autenticación</li>
            <li>Gestionar el tiempo de expiración de sesión por seguridad</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">3.2. Personalización</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Recordar sus preferencias de idioma</li>
            <li>Guardar su selección de tema visual</li>
            <li>Mantener configuraciones de visualización de datos</li>
            <li>Personalizar el contenido según su rol (Vendedor/Gestor de Leads/Admin)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">3.3. Análisis y Mejora</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Comprender cómo los usuarios interactúan con diferentes funcionalidades</li>
            <li>Identificar problemas de usabilidad o rendimiento</li>
            <li>Medir la efectividad de nuevas características</li>
            <li>Optimizar flujos de trabajo de usuarios</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">3.4. Seguridad</h3>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Detectar y prevenir actividades fraudulentas</li>
            <li>Proteger contra ataques de seguridad</li>
            <li>Verificar la autenticidad de las solicitudes</li>
            <li>Implementar medidas de protección contra bots</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cómo Desactivar las Cookies</h2>
          <p className="text-muted-foreground mb-3">
            La mayoría de los navegadores web le permiten controlar las cookies a través de sus configuraciones de 
            preferencias. Puede configurar su navegador para que rechace cookies o le notifique cuando se esté 
            enviando una cookie.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-4">4.1. Gestión de Cookies por Navegador</h3>
          <p className="text-muted-foreground mb-3">
            A continuación, le proporcionamos enlaces a las instrucciones de los navegadores más comunes:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
            <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies y datos de sitios web</li>
            <li><strong>Microsoft Edge:</strong> Configuración → Cookies y permisos del sitio → Cookies y datos del sitio</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-4">4.2. Riesgos Asociados a la Desactivación</h3>
          <p className="text-muted-foreground mb-3">
            Es importante tener en cuenta que deshabilitar o limitar las cookies puede afectar significativamente su 
            experiencia en LeadManager. Específicamente, puede experimentar:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Imposibilidad de iniciar sesión o mantener su sesión activa</li>
            <li>Pérdida de preferencias personalizadas cada vez que cierre el navegador</li>
            <li>Funcionalidades limitadas o no operativas</li>
            <li>Necesidad de volver a configurar ajustes en cada visita</li>
            <li>Experiencia de usuario degradada en general</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Le recomendamos mantener las cookies esenciales activadas para garantizar el funcionamiento correcto de 
            la plataforma, mientras que puede optar por desactivar las cookies no esenciales si así lo prefiere.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-4">4.3. Herramientas de Gestión de Cookies</h3>
          <p className="text-muted-foreground">
            Existen herramientas y extensiones de navegador que le permiten gestionar las cookies de manera más 
            granular. Puede buscar &ldquo;gestores de cookies&rdquo; o &ldquo;bloqueadores de cookies&rdquo; en la tienda de extensiones 
            de su navegador para encontrar opciones que se adapten a sus necesidades.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Notificación de Cambios en la Política</h2>
          <p className="text-muted-foreground mb-3">
            Nos reservamos el derecho de modificar esta Política de Cookies en cualquier momento para reflejar cambios 
            en nuestras prácticas, tecnología o requisitos legales.
          </p>
          <p className="text-muted-foreground mb-3">
            Cuando realicemos cambios significativos en esta política, le notificaremos mediante:
          </p>
          <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1 mb-4">
            <li>Una actualización de la fecha &ldquo;Última actualización&rdquo; en la parte superior de esta página</li>
            <li>Un aviso destacado en nuestra plataforma</li>
            <li>Una notificación por correo electrónico, si lo consideramos apropiado</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Le recomendamos revisar esta Política de Cookies periódicamente para mantenerse informado sobre cómo 
            utilizamos las cookies y cómo protegemos su información.
          </p>
          <p className="text-muted-foreground">
            El uso continuado de nuestra plataforma después de que se publiquen cambios en esta política constituirá 
            su aceptación de dichos cambios.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Más Información y Contacto</h2>
          <p className="text-muted-foreground mb-3">
            Si tiene preguntas o inquietudes sobre nuestra Política de Cookies o sobre cómo utilizamos las cookies 
            en LeadManager, no dude en contactarnos.
          </p>
          <ul className="list-none text-muted-foreground ml-4 space-y-2 mb-4">
            <li><strong>Correo electrónico:</strong> cookies@leadmanager.com</li>
            <li><strong>Dirección postal:</strong> LeadManager, Departamento de Privacidad</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Nuestro equipo estará encantado de ayudarle a comprender mejor cómo funcionan las cookies y cómo puede 
            gestionar sus preferencias.
          </p>
          <p className="text-muted-foreground">
            Para información más detallada sobre cómo manejamos sus datos personales, le invitamos a revisar nuestra 
            Política de Privacidad completa.
          </p>
        </section>
      </div>
    </div>
  );
}
