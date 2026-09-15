import type { Metadata } from "next";
import { OffsideExplainer } from "@/components/OffsideExplainer/OffsideExplainer";

const siteName = "What Is Offside?";
const siteDescription =
  "A visual, plain-English guide to football's offside law, examples, exceptions, and active-play decisions.";
const siteUrl = "https://www.whatisoffside.com";
const socialImageAlt =
  "What Is Offside? A plain-English football rule explainer shown over a football pitch.";
const ifabLaw11Url = "https://www.theifab.com/laws/latest/offside/";

export const metadata: Metadata = {
  title: siteName,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: socialImageAlt,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/twitter-image.png",
        alt: socialImageAlt,
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteName,
      description: siteDescription,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
      },
      about: {
        "@type": "Thing",
        name: "IFAB Law 11 — Offside",
        sameAs: ifabLaw11Url,
      },
      citation: {
        "@type": "CreativeWork",
        name: "IFAB Laws of the Game — Law 11: Offside",
        url: ifabLaw11Url,
      },
    },
    {
      "@type": "HowTo",
      "@id": `${siteUrl}/#howto`,
      name: "How to understand football's offside law",
      description: siteDescription,
      citation: {
        "@type": "CreativeWork",
        name: "IFAB Laws of the Game — Law 11: Offside",
        url: ifabLaw11Url,
      },
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "The line and the position",
          text: "A player is in an offside position if they are in the opponents' half and nearer to the opponents' goal line than both the ball and the second-last opponent when a teammate plays or touches the ball. Position alone is not an offence.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Level is onside",
          text: "If the attacker is level with the second-last opponent, or level with the last two opponents, they are onside. Ties go to the attacker.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Judged when the ball is played",
          text: "Offside position is judged when the teammate plays or touches the ball, not when the pass is received. A runner who starts onside may legally collect the ball behind the defence.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Involvement in active play",
          text: "Standing in an offside position is not penalised unless that player becomes involved in active play — interfering with play, interfering with an opponent, or gaining an advantage.",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Restart exemptions",
          text: "There is no offside offence directly from a throw-in, corner kick, or goal kick. Other restarts, including free kicks and dropped balls, can still produce offside.",
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OffsideExplainer />
    </>
  );
}
