import { ref} from "vue";
import { getFingerPrint } from "@/hooks/admin.js";

export const fingerprint = await getFingerPrint();
export let isAuthorized = ref(false);
export let isPrivate = ref(false);

export function getBaseHeaders() {
    return {
        Authorization: `fingerprint: ${fingerprint}, certification: ${localStorage.getItem('certification')}`
    };
};