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
            switch (error.response.status) {
                case 404:
                    console.error(`API request failed: ${error.response.data.error}`);
                    break
                case 500:
                    // 本来はエラーだが向こうのAPI設計がおかしいのでここでハンドリング
                    if (error.response.data.error === "Machine is stoppeddisassociated, therefore it cannot be stopped") {
                        return {success: true, error: "Machine is stoppeddisassociated, therefore it cannot be stopped", status: 'already'};
                    } else if (error.response.data.error === "Machine is running, therefore it cannot be started") {
                        return {success: true, error: "Machine is running, therefore it cannot be started", status: 'already'};
                    }
                    console.error(`API request failed: ${error.response.data.error}`);
                    break;
                default:
                    console.error(`API request failed: ${error.message}`);
                    break;
            }
            console.error(`API request failed: ${error.message}`);
            // 具体的なエラー処理（例：リトライ、通知など）
            throw error;
        }
    }

    async test(params) {
        const formData = await this.getFormData(params);
        return this.request('/auth/test', 'POST', formData, params);
    }

    /**
     * status: "success" or "false" or "already"
     * @param serverId
     * @returns {Promise<any|{success: boolean, error: string}|{success: boolean, error: string}|undefined>}
     */
    async start(serverId) {
        const params = { server: serverId };
        const formData = await this.getFormData(params);
        return this.request('/client/start/single', 'POST', formData, {});
    }

    async stop(serverId) {
        // disassociate_resources: "true" // gpuを解放する
        const params = { server: serverId, disassociate_resources: 'true' };
        const formData = await this.getFormData(params);
        return this.request('/client/stop/single', 'POST', formData, {});
    }

    /**
     * id -> info　のmapを返す
     * @param params
     * @returns {Promise<*>}
     */
    async list(params = {}) {
        const formData = await this.getFormData(params);
        const res = await this.request('/client/list', 'POST', formData, {});
        return res.virtualmachines;
    }

    async detail(serverId) {
        const params = { server: serverId };
        const formData = await this.getFormData(params);
        return this.request('/client/get/single', 'POST', formData, {});
    }

    // 使用不可
    async bidPrice(serverId, price) {
        const params = { server: serverId, price };
        const formData = await this.getFormData(params);
        return this.request('/client/spot/validate/existing', 'POST', formData, {});
    }
    // 使用不可
    async modify(params) {
        const formData = await this.getFormData(params);
        return this.request('/client/modify/single', 'POST', formData, {});
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