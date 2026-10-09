import {
  ExternalLink,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { saveSettings } from "@/lib/admin-content-actions";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SITE_SETTINGS,
  isSiteSettingKey,
  type PublicSiteSettings,
} from "@/lib/site-settings";

type SearchParams = {
  saved?: string;
  error?: string;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid-email":
      return "Please enter a valid email address.";
    case "invalid-url":
      return "Please enter valid HTTPS/HTTP URLs for the social and Rayeen Shadi links.";
    case "invalid-phone":
      return "Please enter a valid phone number.";
    case "invalid":
      return "Please check the settings and try again.";
    default:
      return "";
  }
}

export default async function SettingsAdmin({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [...Object.keys(DEFAULT_SITE_SETTINGS)],
      },
    },
    select: {
      key: true,
      value: true,
    },
  });

  const settings: PublicSiteSettings = {
    ...DEFAULT_SITE_SETTINGS,
  };

  for (const row of rows) {
    if (isSiteSettingKey(row.key) && typeof row.value === "string") {
      settings[row.key] = row.value;
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#dfe1d8] bg-[#f8f7f1] px-4 py-3 text-sm text-[#15231c] outline-none transition placeholder:text-[#8b958f] focus:border-[#056839] focus:ring-4 focus:ring-[#056839]/10";

  const errorMessage = getErrorMessage(params.error);

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#056839]">
            Website configuration
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#15231c]">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66746c]">
            Manage the contact details and public links used across the AIJR
            website.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Connected to public website
        </div>
      </div>

      {params.saved === "1" && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Website settings saved successfully. Public pages now use the
          updated values.
        </div>
      )}

      {errorMessage && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {errorMessage}
        </div>
      )}

      <form action={saveSettings} className="mt-7 space-y-6">
        <section className="rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#056839]/10 text-[#056839]">
              <Phone size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#15231c]">
                Contact information
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#66746c]">
                These values are shown in the public Contact section.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                Email address
              </span>
              <input
                required
                name="email"
                type="email"
                defaultValue={settings.email}
                className={inputClass}
                placeholder="name@example.com"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                Phone number
              </span>
              <input
                required
                name="phone"
                type="tel"
                defaultValue={settings.phone}
                className={inputClass}
                placeholder="+91 00000 00000"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                Address / location
              </span>
              <input
                required
                name="address"
                type="text"
                defaultValue={settings.address}
                className={inputClass}
                placeholder="India"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#e3e4dc] bg-white p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#056839]/10 text-[#056839]">
              <Link2 size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#15231c]">
                Public links
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#66746c]">
                These links are used by the Rayeen Shadi section and footer
                social buttons.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                Facebook URL
              </span>
              <input
                required
                name="facebookUrl"
                type="url"
                defaultValue={settings.facebookUrl}
                className={inputClass}
                placeholder="https://www.facebook.com/..."
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                Instagram URL
              </span>
              <input
                required
                name="instagramUrl"
                type="url"
                defaultValue={settings.instagramUrl}
                className={inputClass}
                placeholder="https://www.instagram.com/..."
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#66746c]">
                Rayeen Shadi URL
              </span>
              <input
                required
                name="rayeenShadiUrl"
                type="url"
                defaultValue={settings.rayeenShadiUrl}
                className={inputClass}
                placeholder="https://..."
              />
            </label>
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-[#e3e4dc] bg-[#f8f7f1] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#15231c]">
                Changes take effect on the public website
              </p>
              <p className="mt-1 text-xs leading-5 text-[#66746c]">
                Current values are prefilled from the live defaults until they
                are saved to the database.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#056839] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#04572f]"
            >
              Save settings
            </button>
          </div>
        </section>

        <div className="flex flex-wrap gap-2 text-xs text-[#89948d]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
            <Mail size={13} />
            Contact
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
            <Phone size={13} />
            Phone
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2">
            <MapPin size={13} />
            Location
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 font-semibold text-[#056839] hover:bg-[#056839]/5"
          >
            <ExternalLink size={13} />
            View website
          </a>
        </div>
      </form>
    </>
  );
}
