"use client";

import React from "react";
import { formatPrice } from "@/lib/price";
import Image from "next/image";
import { type Locale } from "@/lib/i18n";
import { PRICE_CHECKED_AT, type HardwareItem } from "@/content/hardware";
import SellerLine, { type MerchantPlatform } from "@/components/hardware/SellerLine";
import MarqueeText from "@/components/hardware/MarqueeText";
import AddToCartButton from "@/components/hardware/AddToCartButton";
import "@/styles/split/pages-hardware.css";

function formatCheckedDate(iso: string, isEn: boolean) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString(isEn ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const CATEGORY_LABELS: Record<HardwareItem["category"], { fr: string; en: string }> = {
  uc: { fr: "Unité", en: "Unit" },
  "cable-video": { fr: "Vidéo", en: "Video" },
  network: { fr: "Réseau", en: "Network" },
  control: { fr: "Contrôle", en: "Control" },
  "power-hub": { fr: "Connectique", en: "Connectivity" },
  mount: { fr: "Fixation", en: "Mount" },
  storage: { fr: "Stockage", en: "Storage" },
};

export default function HardwareAccessoriesGrid({
  locale,
  items,
  platform = "amazon",
  checkedAt = PRICE_CHECKED_AT,
}: {
  locale: Locale;
  items: HardwareItem[];
  platform?: MerchantPlatform;
  checkedAt?: string;
}) {
  const isEn = locale === "en";
  const checkedDate = formatCheckedDate(checkedAt, isEn);
  const platformName = platform === "aliexpress" ? "AliExpress" : "Amazon";

  if (items.length === 0) return null;

  return (
    <div className="hw-div-2">
      <div className="hw-div-3">
        <h2 className="hw-h2-1"
        >
          {isEn
            ? "Essential Studio Connectors, Remotes & Mounts"
            : "Connectique Studio, Télécommandes & Fixations Testées"}
        </h2>
        <p className="hw-p-1">
          {isEn
            ? "Need to complete your existing setup? These certified cables, wireless remotes, and secure mounts have been vetted for 24/7 reliability in gym environments."
            : "Vous possédez déjà une machine ? Retrouvez ici la câblerie blindée, les télécommandes sans fil et les supports muraux antivol testés et approuvés pour tourner en continu dans votre salle."}
        </p>
      </div>

      <div
        className="hw-acc-grid hw-div-4"
      >
        {items.map((acc) => {
          const name = acc.name;
          const desc = acc.description;
          const cat = isEn ? CATEGORY_LABELS[acc.category].en : CATEGORY_LABELS[acc.category].fr;

          return (
            <div
              key={acc.id}
              className="hw-item-card hw-div-5"
            >
              <div>
                <div className="hw-div-6"
                >
                  <span className="hw-span-1"
                  >
                    {cat}
                  </span>
                  <span
                    className="hw-price hw-span-2"
                  >
                    {formatPrice(acc.priceAmazon) ?? (isEn ? "See price on Amazon" : "Voir le prix sur Amazon")}
                  </span>
                </div>

                {/* Miniature photo et en-tête produit */}
                <div className="hw-div-7"
                >
                  <div className="hw-div-8"
                  >
                    <Image
                      src={acc.imageUrl}
                      alt=""
                      width={56}
                      height={56} className="hw-image-1"
                    />
                  </div>
                  <div className="hw-div-9">
                    <h3
                      className="hw-clamp hw-acc-name hw-h3-1"
                      title={name}
                    >
                      {name}
                    </h3>
                    <div
                      className="hw-acc-specs hw-div-10"
                    >
                      <MarqueeText text={acc.specs} />
                    </div>
                  </div>
                </div>

                <p
                  className="hw-clamp hw-acc-desc hw-p-2"
                  title={desc}
                >
                  {desc}
                </p>
                <div className="hw-seller-slot hw-div-11">
                  <SellerLine item={acc} isEn={isEn} />
                </div>
              </div>

              <div>
                <div className="hw-div-12">
                  <a
                    href={acc.amazonUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="btn-secondary hw-a-1"
                    title={isEn ? `Open the ${platformName} product page` : `Ouvrir la fiche produit ${platformName}`}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    <span>{isEn ? `Product Sheet (${platformName})` : `Fiche Produit (${platformName})`}</span>
                  </a>
                  {(
                    <AddToCartButton
                      size="sm"
                      locale={locale}
                      item={{
                        platform,
                        asin: acc.asin,
                        name,
                        imageUrl: acc.imageUrl,
                        priceAmazon: acc.priceAmazon,
                        amazonUrl: acc.amazonUrl,
                      }}
                    />
                  )}
                </div>
                {!acc.isLive && (
                  <div className="hw-div-13">
                    <span className="hw-span-3">
                      {isEn ? `Price checked ${checkedDate}` : `Prix constaté le ${checkedDate}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
