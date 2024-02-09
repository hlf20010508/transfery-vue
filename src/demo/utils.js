/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

export function randomInt(min, max) {
    let floatRandom = Math.random()

    let difference = max - min
    let random = Math.round(difference * floatRandom)
    let randomWithinRange = random + min

    return randomWithinRange
}