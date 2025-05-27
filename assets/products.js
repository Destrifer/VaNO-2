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
    minPriceParams: {
      width: 90,
      height: 50,
      materialKey: "Мелованная матовая 300 гр.",
    },
  },
  {
    title: "Бирки и воблеры",
    href: "/tags",
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
      height: 210,
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
  },
  {
    title: "Чертежи",
    href: "/blueprints",
  },
  {
    title: "Грамоты",
    href: "/certificates",
  },
  {
    title: "Благодарности",
    href: "/gratitudes",
  },
  {
    title: "Сертификаты",
    href: "/licenses",
  },
  {
    title: "Хенгеры",
    href: "/hangers",
  },
  {
    title: "Бланки",
    href: "/forms",
  },
  {
    title: "Бейджи",
    href: "/badges",
  },
  {
    title: "Ценники",
    href: "/pricetags",
  },
  {
    title: "Открытки",
    href: "/cards",
  },
  {
    title: "Конверты",
    href: "/envelopes",
  },
  {
    title: "Пригласительные",
    href: "/invites",
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
  },
  {
    title: "Документация",
    href: "/docs",
  },
  {
    title: "Билеты",
    href: "/tickets",
  },
  {
    title: "Купоны",
    href: "/coupons",
  },
  {
    title: "Тетради",
    href: "/notebooks2",
  },
].map((product) => ({
  ...product,
  icon: product.icon || defaultIcon,
}));
