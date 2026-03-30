export const navItems = [
  { href: "/", label: "Home" },
  { href: "/wie", label: "Wie ben ik" },
  { href: "/trimsalon", label: "Trimsalon" },
  { href: "/bodywork", label: "Bodywork" },
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
  },
  {
    href: "/bodywork",
    title: "Bodywork",
    text: "Massage, fitness en loopbandtraining om honden sterk, soepel en in balans te houden.",
    image: "/images/Home/bodywork.jpg"
  }
];

export const carouselImages = [
  "/images/Home/bodywork.jpg",
  "/images/Home/trimsalon.jpg",
  "/images/Home/loopband.jpg"
];

export const pages = {
  wie: {
    title: "Wie ben ik",
    intro: [
      "Mijn naam is Cindy, geboren in 1978, en honden zijn al mijn hele leven mijn passie.",
      "Sinds juni 2010 heet ik baasjes en honden welkom in t Snuffeltje in Boortmeerbeek, waar een rustige, diervriendelijke aanpak centraal staat."
    ],
    body: [
      "Met mijn eigen honden ontdekte ik door de jaren heen gehoorzaamheid, Dog Dance, Treibball, Rally-O-Fun, snuitgolf, canicross, fitness en flyball.",
      "In 2023 startte ik de opleiding tot professionele fitnesstrainer voor honden, waardoor trimsalon en bodywork vandaag samenkomen in dezelfde praktijk.",
      "Ik blijf me voortdurend bijscholen via workshops, rasgerichte opleidingen en hondenmassage zodat de begeleiding altijd actueel en doordacht blijft."
    ],
    images: [
      { src: "/images/wie/honden.jpg", alt: "Cindy met haar honden" },
      { src: "/images/wie/cindy.jpeg", alt: "Cindy" }
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
  bodywork: {
    title: "Bodywork",
    intro: "Kies tussen fitness, loopbandtraining en ontspannende massages die het welzijn van je hond ondersteunen.",
    cards: [
      {
        href: "/bodywork/fitness",
        title: "Fitness",
        text: "Gerichte oefeningen voor kracht, conditie, coordinatie en blessurepreventie.",
        image: "/images/Buttons/btnfitness.png"
      },
      {
        href: "/bodywork/massages",
        title: "Massages",
        text: "Raindrop en ontspanningsmassage voor herstel, rust en balans.",
        image: "/images/Buttons/btnmassage.jpg"
      }
    ]
  },
  fitness: {
    title: "Fitness",
    sections: [
      {
        heading: "Waarom fitness?",
        paragraphs: [
          "Fitness voor honden helpt conditie, spieropbouw, lichaamsbewustzijn en mentale balans verbeteren.",
          "Het is geschikt voor jonge en oudere honden, huishonden en sporthonden."
        ],
        list: [
          "Blessurepreventie",
          "Betere conditie en prestaties",
          "Spieropbouw",
          "Meer soepelheid",
          "Algemeen welzijn",
          "Ondersteuning bij gewichtsverlies"
        ]
      },
      {
        heading: "Onze vijf pijlers",
        list: ["Cardio", "Kracht", "Flexibiliteit", "Lichaamsbewustzijn", "Mentaal"]
      },
      {
        heading: "Loopband",
        paragraphs: [
          "Met loopbandtraining werken we aan conditie en uithoudingsvermogen en kunnen we spelen met tempo en helling.",
          "De loopband kan een losse sessie zijn of deel uitmaken van een bredere fitnessaanpak."
        ],
        image: "/images/loopband/loopband.jpg"
      }
    ]
  },
  massages: {
    title: "Massages",
    sections: [
      {
        heading: "Raindrop massage",
        paragraphs: [
          "Bij de Raindrop-techniek worden essentiele olien gecombineerd met een zachte massagetechniek om honden fysiek en emotioneel te ondersteunen.",
          "De behandeling kan rust brengen, ontspanning bevorderen en het algemeen welzijn ondersteunen."
        ],
        images: [
          "/images/raindrop_massage/product.jpeg",
          "/images/raindrop_massage/sara.jpg"
        ]
      },
      {
        heading: "Ontspanningsmassage",
        paragraphs: [
          "Ook honden kunnen last hebben van gespannen spieren. Een massage helpt pijn en stijfheid verminderen en werkt tegelijk rustgevend.",
          "Deze behandeling is interessant voor sporthonden, senior honden en gevoelige honden."
        ],
        image: "/images/ontspannings_massage/massage.jpg"
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
