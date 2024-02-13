/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import { ref } from "vue";

export let messageBuffer = ref({});
export let messageItemRemoving = ref(false);
export let newMessageNumber = ref(0);
export let showToBottomButton = ref(false);
export let infiniteLoadingReset = ref(false);