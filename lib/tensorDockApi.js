import axios from 'axios';
const api_base_url = 'https://marketplace.tensordock.com/api/v0';
const api_key = process.env.TENSOR_DOCK_API_KEY;
const api_token = process.env.TENSOR_DOCK_API_TOKEN;


class TensorDock {
    constructor(config) {
        this.config = config;
        this.axiosInstance = axios.create({
            baseURL: api_base_url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    // data は FormData オブジェクトを受け取る, params はクエリパラメータ,headersもセットできる
    async request(endpoint, method = 'GET', data = null, params = {}) {
        try {
            const response = await this.axiosInstance({
                method,
                url: endpoint,
                data,
                params,
            });
            return response.data;
        } catch (error) {
            console.error(`API request failed: ${error.message}`);
            // 具体的なエラー処理（例：リトライ、通知など）
            throw error;
        }
    }

    // 通った
    async test(params) {
        const formData = await this.getFormData(params);
        return this.request('/auth/test', 'POST', formData, params);
    }

    async start(params) {
        const formData = await this.getFormData(params);
        return this.request('/start', 'POST', formData, {});
    }

    async stop(params) {
        const formData = await this.getFormData(params);
        return this.request('/stop', 'POST', formData, {});
    }

    async list(params) {
        const formData = await this.getFormData(params);
        return this.request('/client/list', 'POST', formData, {});
    }


    async getFormData(params) {
        const formData = new FormData();
        if (params) {
            Object.keys(params).forEach(key => {
                formData.append(key, params[key]);
            });
        }
        // APIキーをヘッダーにセット
        formData.append('api_key', api_key);
        formData.append('api_token', api_token);
        return formData;
    }
    // ...その他のメソッド (stop, validate, modify, list, detail) も同様に実装

}

export { TensorDock };