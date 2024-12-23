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
  | 'audioDuration' // Remove this!
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
> & {
  assetUrls: {
    taggedMp3: URL
    artworkFull: URL
    artworkThumb: URL
    artworkSocialProxied: URL
  }
}

export type BeatMetadata = Omit<
  SafePublicBeat,
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
