/**
 * API调用模块
 * 负责与成语词典API的交互
 */

class IdiomAPI {
    constructor() {
        this.baseUrl = 'https://v3.alapi.cn/api/idiom';
        this.token = 'o6zv1d4ux9qyy9xprsrvsavguypdhk';
        this.timeout = 10000;
        this.lastRequestTime = 0;
        this.minRequestInterval = 1500; // 最小请求间隔1500ms
    }

    async query(word) {
        if (!word || word.trim().length === 0) {
            throw new Error('请输入成语关键词');
        }

        const trimmedWord = word.trim();

        // 频率限制检查
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
            await this.delay(this.minRequestInterval - timeSinceLastRequest);
        }

        this.lastRequestTime = Date.now();

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const requestBody = {
                token: this.token,
                word: trimmedWord
            };

            console.log('API请求:', { url: this.baseUrl, body: requestBody });

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`网络错误: ${response.status}`);
            }

            const data = await response.json();
            console.log('API响应:', data);

            // 处理各种返回情况
            if (data.code === 200 && data.data) {
                // API返回的是数组，取第一个匹配的结果
                const result = Array.isArray(data.data) ? data.data[0] : data.data;
                if (result) {
                    return this.formatResult(result);
                }
            }
            
            // 处理错误码
            if (data.code === 10001) {
                throw new Error('API Token配置错误，请检查Token是否有效');
            }
            
            if (data.code === 10006 || data.code === 429) {
                throw new Error('请求过于频繁，请稍后再试');
            }
            
            if (data.success === false || !data.data || (Array.isArray(data.data) && data.data.length === 0)) {
                const errorMsg = this.getErrorMessage(data.code);
                throw new Error(errorMsg || '未找到相关成语，请尝试其他关键词');
            }

            const result = Array.isArray(data.data) ? data.data[0] : data.data;
            return this.formatResult(result);
        } catch (error) {
            console.error('API请求错误:', error);
            if (error.name === 'AbortError') {
                throw new Error('请求超时，请检查网络连接后重试');
            }
            throw error;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    formatResult(data) {
        if (!data) {
            return {
                word: '',
                pinyin: '',
                abbr: '',
                explanation: '',
                derivation: '',
                example: ''
            };
        }

        return {
            word: data.word || '',
            pinyin: data.pinyin || '',
            abbr: data.abbr || '',
            explanation: data.explanation || '',
            derivation: data.derivation || '',
            example: data.example || ''
        };
    }

    getErrorMessage(code) {
        const errorMessages = {
            10001: 'API Token未配置或无效',
            10002: 'API Token无效',
            10003: 'API Token已过期',
            10004: 'API Token权限不足',
            10005: '请求参数错误',
            10006: '请求频率过高',
            10007: '服务维护中',
            10008: '服务暂时不可用',
            10009: '未找到相关成语',
            10010: '查询失败',
            10011: '数据格式错误',
            10012: '未知错误',
            429: '请求过于频繁'
        };

        return errorMessages[code] || `查询失败（错误代码：${code}）`;
    }

    async prefixSearch(prefix) {
        if (!prefix || prefix.length < 1) {
            return [];
        }

        try {
            const result = await this.query(prefix);

            if (!result.word) {
                return [];
            }

            return [result];
        } catch (error) {
            console.warn('前缀查询失败:', error);
            return [];
        }
    }

    async queryAll(word, retryCount = 0) {
        if (!word || word.trim().length === 0) {
            throw new Error('请输入成语关键词');
        }

        const trimmedWord = word.trim();
        const maxRetries = 2;

        // 频率限制检查
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.minRequestInterval) {
            await this.delay(this.minRequestInterval - timeSinceLastRequest);
        }

        this.lastRequestTime = Date.now();

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const requestBody = {
                token: this.token,
                word: trimmedWord
            };

            console.log('API请求:', { url: this.baseUrl, body: requestBody, retry: retryCount });

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // 服务器错误（5xx）时尝试重试
                if (response.status >= 500 && response.status < 600 && retryCount < maxRetries) {
                    console.warn(`服务器错误 ${response.status}，${retryCount + 1}秒后重试...`);
                    await this.delay(1000 * (retryCount + 1));
                    return this.queryAll(word, retryCount + 1);
                }
                throw new Error(`服务器错误: ${response.status}，请稍后重试`);
            }

            const data = await response.json();
            console.log('API响应:', data);

            // 处理各种返回情况
            if (data.code === 200 && data.data) {
                // API返回的是数组，格式化所有结果
                if (Array.isArray(data.data) && data.data.length > 0) {
                    return data.data.map(item => this.formatResult(item));
                } else if (!Array.isArray(data.data)) {
                    return [this.formatResult(data.data)];
                }
            }
            
            // 处理错误码
            if (data.code === 10001) {
                throw new Error('API Token配置错误，请检查Token是否有效');
            }
            
            if (data.code === 10006 || data.code === 429) {
                throw new Error('请求过于频繁，请稍后再试');
            }
            
            if (data.success === false || !data.data || (Array.isArray(data.data) && data.data.length === 0)) {
                const errorMsg = this.getErrorMessage(data.code);
                throw new Error(errorMsg || '未找到相关成语，请尝试其他关键词');
            }

            return [];
        } catch (error) {
            console.error('API请求错误:', error);
            
            // 网络错误或CORS错误时尝试重试
            if ((error.name === 'TypeError' || error.message.includes('Failed to fetch')) && retryCount < maxRetries) {
                console.warn(`网络错误，${retryCount + 1}秒后重试...`);
                await this.delay(1000 * (retryCount + 1));
                return this.queryAll(word, retryCount + 1);
            }
            
            if (error.name === 'AbortError') {
                throw new Error('请求超时，请检查网络连接后重试');
            }
            
            // 提供更友好的错误信息
            if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                throw new Error('无法连接到成语词典服务器，请检查网络或稍后重试');
            }
            
            throw error;
        }
    }
}

// 创建全局实例
window.idiomAPI = new IdiomAPI();
