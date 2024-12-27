export const publicBeatSelect = {
  id: true,
  title: true,
  slug: true,
  metaTitle: true,
  description: true,
  metaDescription: true,
  duration: true,
  bpm: true,
  musicalKeyLetter: true,
  tonality: true,
  genres: true,
  instruments: true,
  soundsLike: true,
  tags: true,
  useDefaultPrices: true,
  customPriceBasic: true,
  customPricePremium: true,
  customPriceUnlimited: true,
  customPriceExclusive: true,
  discountPercentage: true,
  discountExpiresAt: true,
  playCount: true,
  favouriteCount: true,
} as const

export const activeBeatsWhere = {
  isDraft: false,
  isHidden: false,
  isExclusiveSold: false,
  releaseDate: {
    lte: new Date(),
  },
} as const
