import { atom } from 'jotai'
import { Community } from './types'

export const selectedCommunityAtom = atom<Community | null>(null)
