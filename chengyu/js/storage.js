/**
 * 本地存储模块
 * 负责用户数据的持久化存储
 */

class StorageManager {
    constructor() {
        this.prefix = CONFIG.storage.prefix;
    }
    
    get(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('读取存储失败:', error);
            return null;
        }
    }
    
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('写入存储失败:', error);
            return false;
        }
    }
    
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('删除存储失败:', error);
            return false;
        }
    }
    
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清除存储失败:', error);
            return false;
        }
    }
    
    // 搜索历史
    getSearchHistory() {
        const history = this.get('searchHistory') || [];
        return history.slice(0, CONFIG.storage.maxHistory);
    }
    
    addSearchHistory(word) {
        if (!word || word.length < 2) return;
        
        let history = this.getSearchHistory();
        history = history.filter(item => item.word !== word);
        
        history.unshift({
            word: word,
            time: Date.now()
        });
        
        history = history.slice(0, CONFIG.storage.maxHistory);
        this.set('searchHistory', history);
    }
    
    clearSearchHistory() {
        this.remove('searchHistory');
    }
    
    // 收藏夹
    getCollection() {
        const collection = this.get('collection') || [];
        return collection;
    }
    
    isCollected(word) {
        const collection = this.getCollection();
        return collection.some(item => item.word === word);
    }
    
    addToCollection(idiom) {
        if (!idiom || !idiom.word) return false;
        
        if (this.isCollected(idiom.word)) {
            return false;
        }
        
        const collection = this.getCollection();
        if (collection.length >= CONFIG.storage.maxCollection) {
            collection.shift();
        }
        
        collection.push({
            ...idiom,
            addedAt: Date.now(),
            status: 'learning'
        });
        
        this.set('collection', collection);
        return true;
    }
    
    removeFromCollection(word) {
        const collection = this.getCollection();
        const filtered = collection.filter(item => item.word !== word);
        
        if (filtered.length !== collection.length) {
            this.set('collection', filtered);
            return true;
        }
        return false;
    }
    
    updateCollectionStatus(word, status) {
        const collection = this.getCollection();
        const index = collection.findIndex(item => item.word === word);
        
        if (index !== -1) {
            collection[index].status = status;
            collection[index].updatedAt = Date.now();
            this.set('collection', collection);
            return true;
        }
        return false;
    }
    
    // 游戏记录
    getGameRecords() {
        return this.get('gameRecords') || [];
    }
    
    saveGameRecord(record) {
        const records = this.getGameRecords();
        records.push({
            ...record,
            playedAt: Date.now()
        });
        
        const maxRecords = 50;
        if (records.length > maxRecords) {
            records.sort((a, b) => b.score - a.score);
            records.splice(maxRecords);
        }
        
        this.set('gameRecords', records);
    }
    
    getBestScore() {
        const records = this.getGameRecords();
        if (records.length === 0) return 0;
        return Math.max(...records.map(r => r.score));
    }
    
    getMaxStreak() {
        const records = this.getGameRecords();
        if (records.length === 0) return 0;
        return Math.max(...records.map(r => r.maxStreak));
    }
    
    // 用户设置
    getUserSettings() {
        return this.get('settings') || {
            soundEnabled: true,
            animationEnabled: true
        };
    }
    
    saveUserSettings(settings) {
        this.set('settings', settings);
    }
    
    // 导出数据
    exportData() {
        return {
            searchHistory: this.getSearchHistory(),
            collection: this.getCollection(),
            gameRecords: this.getGameRecords(),
            settings: this.getUserSettings(),
            exportedAt: new Date().toISOString()
        };
    }
    
    // 导入数据
    importData(data) {
        if (!data || typeof data !== 'object') return false;
        
        try {
            if (data.searchHistory) {
                this.set('searchHistory', data.searchHistory);
            }
            if (data.collection) {
                this.set('collection', data.collection);
            }
            if (data.gameRecords) {
                this.set('gameRecords', data.gameRecords);
            }
            if (data.settings) {
                this.set('settings', data.settings);
            }
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

// 创建全局实例
window.storageManager = new StorageManager();
