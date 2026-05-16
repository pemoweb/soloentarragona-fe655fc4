import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageHero } from "@/components/PageShell";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y condiciones — Solo en Tarragona" },
      {
        name: "description",
        content:
          "Condiciones de uso de la plataforma Solo en Tarragona: derechos, obligaciones y normas de la comunidad.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Términos y condiciones"
        subtitle="Última actualización: 16 de mayo de 2026"
      />
      <section className="mx-auto max-w-3xl px-4 md:px-8 py-12">
        <article className="space-y-8 text-foreground/85 leading-relaxed">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">1. Objeto</h2>
            <p className="mt-2">
              Estas condiciones regulan el uso de Solo en Tarragona, una plataforma local que ofrece noticias, marketplace, directorio profesional, clasificados y servicios de la ciudad.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">2. Registro y cuentas</h2>
            <p className="mt-2">
              Para publicar contenido debes registrarte facilitando información veraz. Eres responsable de mantener la confidencialidad de tu cuenta y de todo lo que se haga desde ella.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">3. Contenido del usuario</h2>
            <p className="mt-2">
              Eres responsable del contenido que publicas. No se permite contenido ilegal, ofensivo, fraudulento, spam ni que infrinja derechos de terceros. Nos reservamos el derecho de retirar contenido y suspender cuentas que incumplan estas normas.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">4. Marketplace y clasificados</h2>
            <p className="mt-2">
              Solo en Tarragona actúa como intermediario y no es parte de las transacciones entre usuarios. Recomendamos prudencia, encuentros en lugares públicos y verificar el producto antes de pagar.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">5. Propiedad intelectual</h2>
            <p className="mt-2">
              La marca, el diseño y el software de la plataforma son propiedad de Solo en Tarragona. Los usuarios conservan los derechos sobre sus contenidos y nos otorgan una licencia no exclusiva para mostrarlos en el servicio.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">6. Limitación de responsabilidad</h2>
            <p className="mt-2">
              No nos hacemos responsables de los daños derivados del uso de la plataforma cuando se deban a contenidos de terceros, fallos de conectividad o usos contrarios a estas condiciones.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">7. Legislación aplicable</h2>
            <p className="mt-2">
              Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Tarragona.
            </p>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
