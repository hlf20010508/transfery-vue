/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { fingerprint } from "@/stores/admin.js"

export function getCertificate() {
    return JSON.stringify({
        fingerprint,
        certificate: localStorage.getItem('certificate')
    });
}