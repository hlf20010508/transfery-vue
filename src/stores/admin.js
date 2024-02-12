import { ref} from "vue";
import { getFingerPrint } from "@/hooks/admin.js";

export const fingerprint = await getFingerPrint();
export const baseHeaders = { Authorization: 'fingerprint: ' + fingerprint };
export let isAuthorized = ref(false);
export let isPrivate = ref(false);