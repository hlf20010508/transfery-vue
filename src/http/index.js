/*
:project: transfery-vue
:author: L-ING
:copyright: (C) 2024 L-ING <hlf01@icloud.com>
:license: MIT, see LICENSE for more details.
*/

import axios from "axios"
import axiosRetry from "axios-retry";
import { isDemo } from "@/utils";
import { getCertificate } from "@/hooks/certificate.js"

if (import.meta.env.DEV)
    axios.defaults.baseURL = '/api'

if (!isDemo())
    axios.interceptors.request.use(function (config) {
        config.headers = { Authorization: getCertificate() };

        return config;
    });

axiosRetry(axios, {
    retryCondition: error => {
        // if retry condition is not specified, by default idempotent requests are retried
        switch (error.response.status) {
            case 500:
            case 502:
            case 503:
            case 504:
                return true;
            default:
                return false; // Do not retry the others
        };
    },
    retryDelay: () => 5000,
    onRetry: (retryCount, error) => {
        console.error("axios error:", error);
        console.log("axios retry count:", retryCount);
    }
});

export default axios;