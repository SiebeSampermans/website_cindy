export const navItems = [
  { href: "/", label: "Home" },
  { href: "/wie", label: "Wie ben ik" },
  { href: "/trimsalon", label: "Trimsalon" },
  { href: "/contact", label: "Contact" },
  { href: "/huisregels", label: "Huisregels" },
  { href: "/gallerij", label: "Gallerij" }
];

export const socialLinks = [
  {
    href: "https://www.instagram.com/tsnuffeltje?igsh=azh3eXJ6eThrOG1t",
    label: "Instagram"
  },
  {
    href: "https://www.facebook.com/hondenkapsalontsnuffeltje?locale=nl_NL",
    label: "Facebook"
  }
];

export const footerInfo = {
  name: "t'Snuffeltje",
  address: ["Korenweg 29", "3190 Boortmeerbeek"],
  contact: ["0477 69 80 33", "tsnuffeltje@gmail.com", "BE0825.002.420"],
  hours: "Dinsdag tot en met vrijdag: 9u - 19u"
};

export const homepageCards = [
  {
    href: "/trimsalon",
    title: "Trimsalon",
    text: "Vachtverzorging, puppygewenning en advies op maat voor kleine en middelgrote honden.",
    image: "/images/Home/trimsalon.jpg"
  }
];

export const carouselImages = [
  "/images/Home/trimsalon.jpg",
  "/images/wie/honden.jpg",
  "/images/puppygewenning/puppy1.jpg"
];

export const pages = {
  wie: {
    title: "Wie ben ik",
    intro: [
      "Mijn naam is Cindy,",
      "geboren in '78 en al mijn hele leven heb ik een enorme passie voor honden! Zolang als ik me kan herinneren hebben er bij ons altijd honden aanwezig geweest, momenteel heb ik er nog 6, Jaron, Liam, N'Kai, Pepper, Pax en Luna, mijn Border Collies, kruisingen en Dwergkees."
    ],
    body: [
      "Samen met hen ging ik op ontdekkingstocht doorheen verschillende hondensporten. We begonnen in de gehoorzaamheid, van daaruit gingen we door naar Dog Dance, Treibball, Rally-O-Fun, Snuitgolf, Canicross, Fitness en onze hoofdsport al meer dan 15 jaar is Flyball. Samen met mijn team DragonForce behaalden we al enkele mooie doelen!",
      "In 2008 kreeg men leven een andere wending en besloot ik om een opleiding tot gediplomeerde hondentrimmer te gaan volgen.",
      "Sinds juni 2010 heet ik jullie welkom in 't Snuffeltje, een klein trimsalon, voor kleine en middelgrote honden, in Boortmeerbeek, gelegen in een rustige omgeving waar de verzorging van uw hond op de eerste plaats komt! Elke verzorging gebeurt op een diervriendelijke manier met veel liefde en in samenspraak met de eigenaar, waardoor ik enkel op afspraak werk.",
      "Ik blijf mijn kennis verder bijschaven en neem regelmatig deel aan workshops over verschillende hondenrassen, zodat mijn aanpak steeds afgestemd blijft op de noden van hond en eigenaar.",
      "Hopelijk tot binnenkort!",
      "Cindy"
    ],
    images: [
      { src: "/images/wie/honden.jpg", alt: "cindy haar honden" },
      { src: "/images/wie/cindy.jpeg", alt: "cindy" }
    ]
  },
  trimsalon: {
    title: "Trimsalon",
    sections: [
      {
        heading: "Diensten",
        paragraphs: [
          "Bij onze eerste kennismaking bespreken we samen welke trimbehandeling het best past bij jouw hond en gewenste model.",
          "Ik werk bij voorkeur volgens rasstandaard, met ruimte voor praktische afspraken op maat van hond en eigenaar."
        ]
      },
      {
        heading: "Standaard vachtverzorging",
        paragraphs: [
          "De verzorging kan onder meer bestaan uit wassen, drogen, borstelen, ontklitten, ontwollen, knippen of scheren en nagels knippen.",
          "Wegens omstandigheden worden er momenteel geen plukhonden meer aangenomen."
        ],
        list: [
          "Wassen en drogen",
          "Borstelen, uitkammen en ontklitten",
          "Ontwollen",
          "Knippen of scheren",
          "Nagels knippen"
        ]
      },
      {
        heading: "Puppy gewenning",
        paragraphs: [
          "Voor pups tot 16 weken is een eerste, zachte kennismaking met salon, tafel, bad en geluiden ideaal om latere stress te vermijden.",
          "Je krijgt tegelijk uitleg en tips om de vacht thuis correct verder te onderhouden."
        ],
        images: [
          "/images/puppygewenning/puppy1.jpg",
          "/images/puppygewenning/puppy1_optafel.jpg",
          "/images/puppygewenning/puppy2.jpeg"
        ]
      },
      {
        heading: "Workshop borstelen",
        paragraphs: [
          "Tijdens een een-op-een workshop leer je hoe je tussen twee trimbeurten thuis correct onderhoud doet.",
          "Je werkt met je eigen hond en materiaal, en krijgt praktische begeleiding om klitten en vervilting te voorkomen."
        ]
      }
    ]
  },
  huisregels: {
    title: "Huisregels",
    sections: [
      {
        heading: "Praktische afspraken",
        list: [
          "Kom op tijd naar je afspraak, niet te vroeg en niet te laat.",
          "Hou je hond steeds aan de lijn.",
          "Laat je hond vooraf nog even uit.",
          "Ruim uitwerpselen altijd op.",
          "Breng je hond liever niet met volle maag.",
          "Kom indien mogelijk met een droge vacht.",
          "Breng geen hond met vlooien binnen.",
          "Meld medische, allergische of besmettelijke aandoeningen vooraf.",
          "Geef veranderingen in gedrag, medicatie of gezondheid door.",
          "Bij agressie kan een behandeling stopgezet worden.",
          "Sterk vervilte vachten worden niet uitgeborsteld als dat pijnlijk zou zijn.",
          "Pas gewijzigde adres- of telefoongegevens aan.",
          "Persoonsgegevens worden niet gedeeld met derden.",
          "Laat weten als je geen foto's van je hond online wilt zien."
        ]
      },
      {
        heading: "Annulaties",
        list: [
          "Verwittig minstens 24 uur op voorhand als je afspraak niet kan doorgaan.",
          "Bij laattijdige annulatie of afwezigheid kan 50% van de kosten aangerekend worden.",
          "Wie een afspraak maakt, gaat akkoord met de huisregels."
        ]
      }
    ]
  }
};

export const galleryImages = Array.from({ length: 6 }, (_, groupIndex) =>
  Array.from({ length: 4 }, (_, imageIndex) => ({
    thumb: `/images/Gallerij/Gallerij_${groupIndex + 1}/${imageIndex + 1}.jpg`,
    full: `/images/Gallerij/Gallerij_${groupIndex + 1}/resized-images/${imageIndex + 1}.jpg`,
    alt: `Galerij foto ${groupIndex + 1}-${imageIndex + 1}`
  }))
).flat();

