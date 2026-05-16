import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — Solo en Tarragona" },
      {
        name: "description",
        content:
          "Cómo recogemos, usamos y protegemos tus datos personales en Solo en Tarragona.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Política de privacidad"
        subtitle="Última actualización: 16 de mayo de 2026"
      />
      <section className="mx-auto max-w-3xl px-4 md:px-8 py-12 prose-tarragona">
        <article className="space-y-8 text-foreground/85 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">1. Responsable del tratamiento</h2>
            <p className="mt-2">
              Solo en Tarragona es responsable del tratamiento de los datos personales recogidos a través de esta plataforma. Puedes contactarnos en{" "}
              <a href="mailto:hola@soloentarragona.cat" className="text-coral underline">hola@soloentarragona.cat</a>.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">2. Datos que recogemos</h2>
            <p className="mt-2">
              Recogemos los datos que nos facilitas al registrarte, publicar contenido o contactar con otros usuarios: nombre, email, ubicación aproximada y contenido publicado.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">3. Finalidad</h2>
            <p className="mt-2">
              Utilizamos los datos para gestionar tu cuenta, mostrar tus anuncios, moderar la comunidad y enviar comunicaciones relacionadas con el servicio.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">4. Cookies</h2>
            <p className="mt-2">
              Usamos cookies técnicas necesarias para el funcionamiento y, con tu consentimiento, cookies analíticas y de personalización. Puedes cambiar tu decisión en cualquier momento borrando la preferencia desde tu navegador.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">5. Tus derechos</h2>
            <p className="mt-2">
              Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiéndonos al correo indicado arriba. También puedes presentar una reclamación ante la Agencia Española de Protección de Datos.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">6. Conservación</h2>
            <p className="mt-2">
              Conservamos tus datos mientras mantengas una cuenta activa y durante los plazos legales aplicables para resolver posibles reclamaciones.
            </p>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
