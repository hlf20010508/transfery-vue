/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

export function randomInt(min, max) {
    const floatRandom = Math.random()

    const difference = max - min
    const random = Math.round(difference * floatRandom)
    const randomWithinRange = random + min

    return randomWithinRange
}