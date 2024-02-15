/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { ref } from "vue";
import { getFingerprint } from "@/utils";

export const fingerprint = getFingerprint();
export let isAuthorized = ref(false);
export let isPrivate = ref(false);