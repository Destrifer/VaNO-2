const defaultIcon = "/icons/default.svg";

export const products = [
  {
    title: "Наклейки",
    href: "/stickers",
    icon: "/icons/stickers.svg",
    minPriceParams: {
      width: 50,
      height: 50,
      materialKey: "Мелованная матовая 150 гр.",
    },
  },
  {
    title: "Этикетки",
    href: "/labels",
  },
  {
    title: "Каталоги",
    href: "/catalogs",
  },
  {
    title: "Буклеты",
    href: "/booklets",
    minPriceParams: {
      width: 210,
      height: 297,
      materialKey: "Офсетная 80 гр.",
    },
  },
  {
    title: "Визитки",
    href: "/business-cards",
  },
  {
    title: "Бирки и воблеры",
    href: "/tags",
    minPriceParams: {
      width: 60,
      height: 40,
      materialKey: "Мелованная матовая 250 гр.",
    },
  },
  {
    title: "Календари",
    href: "/calendars",
  },
  {
    title: "Листовки и флаеры",
    href: "/flyers",
    icon: "/icons/default.svg",
    minPriceParams: {
      width: 148,
      height: 105,
      materialKey: "Мелованная матовая 150 гр.",
    },
  },
  {
    title: "Блокноты",
    href: "/notebooks",
  },
  {
    title: "Баннеры",
    href: "/banners",
  },
  {
    title: "Роллапы",
    href: "/rollups",
  },
  {
    title: "Таблички",
    href: "/signs",
  },
  {
    title: "Презентации",
    href: "/presentations",
  },
  {
    title: "Холсты",
    href: "/canvas",
  },
  {
    title: "Плакаты",
    href: "/posters",
    minPriceParams: {
      width: 210,
      height: 297,
      materialKey: "Мелованная матовая 150 гр.",
    },
  },
  {
    title: "Чертежи",
    href: "/blueprints",
  },
  {
    title: "Грамоты",
    href: "/certificates",
    minPriceParams: {
      width: 210,
      height: 148,
      materialKey: "Мелованная матовая 250 гр.",
    },
  },
  {
    title: "Благодарности",
    href: "/gratitudes",
    minPriceParams: {
      width: 210,
      height: 148,
      materialKey: "Мелованная матовая 250 гр.",
    },
  },
  {
    title: "Сертификаты",
    href: "/licenses",
    minPriceParams: {
      width: 210,
      height: 297,
      materialKey: "Мелованная матовая 300 гр.",
    },
  },
  {
    title: "Хенгеры",
    href: "/hangers",
  },
  {
    title: "Бланки",
    href: "/forms",
    minPriceParams: {
      width: 210,
      height: 148,
      materialKey: "Офсетная 80 гр.",
    },
  },
  {
    title: "Бейджи",
    href: "/badges",
    minPriceParams: {
      width: 100,
      height: 70,
      materialKey: "Мелованная матовая 300 гр.",
    },
  },
  {
    title: "Ценники",
    href: "/pricetags",
    minPriceParams: {
      width: 40,
      height: 60,
      materialKey: "Мелованная матовая 300 гр.",
    },
  },
  {
    title: "Открытки",
    href: "/cards",
    minPriceParams: {
      width: 210,
      height: 148,
      materialKey: "Мелованная матовая 250 гр.",
    },
  },
  {
    title: "Конверты",
    href: "/envelopes",
  },
  {
    title: "Пригласительные",
    href: "/invites",
    minPriceParams: {
      width: 200,
      height: 100,
      materialKey: "Мелованная матовая 250 гр.",
    },
  },
  {
    title: "Брошюры",
    href: "/brochures",
  },
  {
    title: "Меню",
    href: "/menu",
  },
  {
    title: "Журналы",
    href: "/magazines",
  },
  {
    title: "Лифлеты",
    href: "/leaflets",
    minPriceParams: {
      width: 210,
      height: 297,
      materialKey: "Мелованная матовая 170 гр.",
    },
  },
  {
    title: "Документация",
    href: "/docs",
    minPriceParams: {
      width: 210,
      height: 297,
      materialKey: "Офсетная 80 гр.",
    },
  },
  {
    title: "Билеты",
    href: "/tickets",
    minPriceParams: {
      width: 210,
      height: 74,
      materialKey: "Мелованная матовая 200 гр.",
    },
  },
  {
    title: "Купоны",
    href: "/coupons",
    minPriceParams: {
      width: 210,
      height: 74,
      materialKey: "Мелованная матовая 200 гр.",
    },
  },
  {
    title: "Тетради",
    href: "/notebooks2",
  },
].map((product) => ({
  ...product,
  icon: product.icon || defaultIcon,
}));
