import { Beat } from '@prisma/client'

export type SafePublicBeat = Omit<
  Beat,
  | 'isHidden'
  | 'isDraft'
  | 'releaseDate'
  | 'basicSales'
  | 'premiumSales'
  | 'unlimitedSales'
  | 'isExclusiveSold'
  | 'untaggedMp3Key'
  | 'wavKey'
  | 'zippedStemsKey'
  | 'favouritedBy'
  | 'favouritedByIds'
  | 'createdAt'
  | 'updatedAt'
>
