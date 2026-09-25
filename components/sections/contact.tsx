import { buttonVariants } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { t, ui, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ContactProps = {
  locale: Locale;
};

export function Contact({ locale }: ContactProps) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border py-[clamp(3.5rem,8vw,6.5rem)]"
    >
      <div className="mx-auto grid max-w-page grid-cols-12 items-end gap-x-6 gap-y-8 px-4">
        <h2
          id="contact-heading"
          className="col-span-12 font-display text-section font-semibold leading-tight tracking-tight break-all md:col-span-8"
        >
          <a
            href={`mailto:${profile.email}`}
            className="text-foreground no-underline hover:text-primary"
          >
            {profile.email}
          </a>
          <small className="mt-3 block max-w-measure font-sans text-body font-normal break-normal text-muted-foreground tracking-normal">
            {t(ui.actions.emailFastest, locale)}
          </small>
        </h2>
        <div className="col-span-12 flex flex-wrap gap-3 md:col-span-3 md:col-start-10">
          <a
            href={profile.resumeHref}
            className={cn(buttonVariants({ variant: "primary" }), "no-underline")}
          >
            {t(ui.actions.resume, locale)}
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }), "no-underline")}
          >
            {t(ui.actions.github, locale)}
          </a>
        </div>
      </div>
    </section>
  );
}
