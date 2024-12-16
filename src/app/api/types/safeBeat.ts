import { Beat } from '@prisma/client'

export type SafePublicBeat = Pick<
  Beat,
  | 'id'
  | 'title'
  | 'metaTitle'
  | 'description'
  | 'metaDescription'
  | 'isHidden'
  | 'isDraft'
  | 'releaseDate'
  | 'basicSales'
  | 'premiumSales'
  | 'unlimitedSales'
  | 'isExclusiveSold'
  | 'duration'
  | 'bpm'
  | 'musicalKeyLetter'
  | 'tonality'
  | 'genres'
  | 'instruments'
  | 'soundsLike'
  | 'tags'
  | 'useDefaultPrices'
  | 'customPriceBasic'
  | 'customPricePremium'
  | 'customPriceUnlimited'
  | 'customPriceExclusive'
  | 'customPriceBasic'
  | 'discountPercentage'
  | 'discountExpiresAt'
  | 'fullSizeArtworkKey'
  | 'thumbnailKey'
  | 'socialPhotoKey'
  //   | 'taggedMp3Key'
  //   | 'untaggedMp3Key'
>

//     taggedMp3Key       String?
//     untaggedMp3Key     String?
//     wavKey             String?
//     zippedStemsKey     String?

//     // Analytics
//     playCount      Int @default(0)
//     favouriteCount Int @default(0)

//     // Relations
//     favouritedByIds String[] @default([]) @db.ObjectId
//     favouritedBy    User[]   @relation(fields: [favouritedByIds], references: [id])

//     // Timestamps
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt

//     @@map("beats")
//   }
