import { Beat } from '@prisma/client'

export type PublicBeat = Omit<
  Beat,
  | 'isHidden'
  | 'isDraft'
  | 'releaseDate'
  | 'basicSales'
  | 'premiumSales'
  | 'unlimitedSales'
  | 'isExclusiveSold'
  | 'untaggedMp3Key'
  | 'originalArtworkFileName'
  | 'wavKey'
  | 'zippedStemsKey'
  | 'favouritedBy'
  | 'favouritedByIds'
  | 'createdAt'
  | 'updatedAt'
  | 'taggedMp3'
  | 'untaggedMp3'
  | 'wav'
  | 'stems'
>

export type PublicBeatWithAssets = PublicBeat & {
  assetUrls: {
    taggedMp3: string
    artworkFull: string
    artworkThumb: string
    artworkSocial: string
  }
}

export type BeatMetadata = Omit<
  PublicBeat,
  | 'id'
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
  | 'fullSizeArtworkKey'
  | 'thumbnailKey'
  | 'socialPhotoKey'
  | 'taggedMp3Key'
  | 'playCount'
  | 'favouriteCount'
  | 'duration'
>
