import prisma from '../database/prisma'
import { addAssets } from './addAssets'
import { BasicMessages, PublicBeatWithAssets } from '@/types'

import { publicBeatSelect } from './publicBeatSelect'

export interface GetPublishedBeatsResponse {
  message: BasicMessages | 'beats not found' | 'beat not found'
  beats?: PublicBeatWithAssets[]
  beat?: PublicBeatWithAssets
}

export default async function getPublishedBeats({
  slug,
  id,
}: {
  slug?: string
  id?: string
} = {}): Promise<GetPublishedBeatsResponse> {
  try {
    let result
    if (slug || id) {
      result = await prisma.beat.findFirst({
        where: {
          AND: [
            {
              isDraft: false,
              isHidden: false,
              isExclusiveSold: false,
              releaseDate: {
                lte: new Date(),
              },
            },
            slug ? { slug } : id ? { id } : {},
          ],
        },
        select: publicBeatSelect,
      })
      if (!result) {
        return {
          message: 'beat not found',
        }
      }

      return {
        message: 'success',
        beat: addAssets(result),
      }
    } else {
      result = await prisma.beat.findMany({
        where: {
          isDraft: false,
          isHidden: false,
          isExclusiveSold: false,
          releaseDate: {
            lte: new Date(),
          },
        },
        select: publicBeatSelect,
        orderBy: {
          releaseDate: 'desc',
        },
      })
    }

    if (!result || result.length === 0) {
      return {
        message: 'beats not found',
      }
    }

    const beatsWithAssets: PublicBeatWithAssets[] = result.map(beat => addAssets(beat))
    return {
      message: 'success',
      beats: beatsWithAssets,
    }
  } catch {
    return {
      message: 'server error',
    }
  }
}
