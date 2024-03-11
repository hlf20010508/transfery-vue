/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { ref } from "vue";
import UAParser from "ua-parser-js";
import { getFingerprint } from "@/utils";

const uaParser = new UAParser();
const browserInfo = uaParser.getBrowser()

export const fingerprint = getFingerprint();
export const browser  = `${browserInfo.name} ${browserInfo.version}`;
export let isAuthorized = ref(false);
export let isPrivate = ref(false);
export let isDeviceLoading = ref(true);
export let deviceList = ref([]);