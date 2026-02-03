/**
 * UI交互模块
 * 负责页面交互、Toast提示、Loading状态等
 */

class UIManager {
    constructor() {
        this.toastElement = null;
        this.loadingElement = null;
        this.currentPage = 'home';
        this.collectionPage = 1;
        this.collectionItemsPerPage = 15;
        this.init();
    }
    
    init() {
        this.toastElement = document.getElementById('toast');
        this.loadingElement = document.getElementById('loadingOverlay');
        this.bindNavigation();
        this.bindMobileMenu();
    }
    
    // 页面导航
    bindNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const featureCards = document.querySelectorAll('.feature-card');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateTo(page);
            });
        });
        
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const page = card.dataset.page;
                this.navigateTo(page);
            });
        });
    }
    
    navigateTo(page) {
        const pages = document.querySelectorAll('.page');
        const navLinks = document.querySelectorAll('.nav-link');
        
        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));
        
        const targetPage = document.getElementById(`page-${page}`);
        const targetLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        this.currentPage = page;
        
        // 关闭移动端菜单
        this.closeMobileMenu();
        
        if (page === 'search') {
            this.updateSearchPage();
        } else if (page === 'collection') {
            this.updateCollectionPage();
        }
    }
    
    // 关闭移动端菜单
    closeMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu) {
            navMenu.classList.remove('show');
        }
        if (menuBtn) {
            menuBtn.classList.remove('active');
        }
    }
    
    // 移动端菜单
    bindMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('show');
                menuBtn.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('show');
                    menuBtn.classList.remove('active');
                }
            });
        }
    }
    
    // Toast提示
    showToast(message, type = 'default', duration = 2500) {
        if (!this.toastElement) return;
        
        this.toastElement.textContent = message;
        this.toastElement.className = 'toast';
        
        if (type === 'success') {
            this.toastElement.classList.add('success');
        } else if (type === 'error') {
            this.toastElement.classList.add('error');
        }
        
        this.toastElement.classList.add('show');
        
        setTimeout(() => {
            this.toastElement.classList.remove('show');
        }, duration);
    }
    
    // Loading状态
    showLoading(message = '加载中...') {
        if (!this.loadingElement) return;
        
        const spinner = this.loadingElement.querySelector('.loading-spinner');
        if (spinner) {
            spinner.setAttribute('data-message', message);
        }
        
        this.loadingElement.classList.add('show');
    }
    
    hideLoading() {
        if (!this.loadingElement) return;
        this.loadingElement.classList.remove('show');
    }
    
    // 搜索页更新
    updateSearchPage() {
        this.renderSearchHistory();
    }
    
    renderSearchHistory() {
        const historyList = document.getElementById('historyList');
        const historySection = document.getElementById('searchHistory');
        const history = storageManager.getSearchHistory();
        
        if (!historyList) return;
        
        if (history.length === 0) {
            if (historySection) {
                historySection.style.display = 'none';
            }
            return;
        }
        
        if (historySection) {
            historySection.style.display = 'block';
        }
        
        historyList.innerHTML = history.map((item, index) => `
            <span class="history-item" data-word="${this.escapeHtml(item.word)}" data-index="${index}">
                ${this.escapeHtml(item.word)}
            </span>
        `).join('');
        
        historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const word = item.dataset.word;
                const searchInput = document.getElementById('searchPageInput');
                if (searchInput) {
                    searchInput.value = word;
                    searchInput.focus();
                }
            });
        });
    }
    
    // 收藏页更新
    updateCollectionPage() {
        this.renderCollection('all');
        this.updateCollectionStats();
    }
    
    renderCollection(filter = 'all') {
        const collectionList = document.getElementById('collectionList');
        if (!collectionList) return;

        const collection = storageManager.getCollection();
        let filteredCollection = collection;

        if (filter === 'learning') {
            filteredCollection = collection.filter(item => item.status === 'learning');
        } else if (filter === 'learned') {
            filteredCollection = collection.filter(item => item.status === 'learned');
        }

        if (filteredCollection.length === 0) {
            collectionList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                    <p>${filter === 'all' ? '暂无收藏，去添加一些成语吧！' : '暂无该状态的成语'}</p>
                </div>
            `;
            return;
        }

        // 计算分页
        const totalPages = Math.ceil(filteredCollection.length / this.collectionItemsPerPage);
        const startIndex = (this.collectionPage - 1) * this.collectionItemsPerPage;
        const endIndex = Math.min(startIndex + this.collectionItemsPerPage, filteredCollection.length);
        const pageItems = filteredCollection.slice(startIndex, endIndex);

        // 简化显示：只显示成语和操作按钮，一行一个
        let html = pageItems.map(item => `
            <div class="collection-item-row glass-card" data-word="${this.escapeHtml(item.word)}">
                <span class="item-word">${this.escapeHtml(item.word)}</span>
                <span class="item-status status-${item.status}">${this.getStatusText(item.status)}</span>
                <div class="item-actions">
                    <button class="action-btn view-btn" data-word="${this.escapeHtml(item.word)}" title="查看详情">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </button>
                    <button class="action-btn status-btn" data-word="${this.escapeHtml(item.word)}" data-status="${item.status}" title="切换状态">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" data-word="${this.escapeHtml(item.word)}" title="删除">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // 添加分页
        if (totalPages > 1) {
            html += this.renderCollectionPagination(totalPages, filteredCollection.length);
        }

        collectionList.innerHTML = html;

        collectionList.querySelectorAll('.collection-item-row').forEach(item => {
            const word = item.dataset.word;

            item.querySelector('.view-btn')?.addEventListener('click', () => {
                // 从本地存储获取完整数据并显示详情弹窗
                this.showCollectionDetail(word);
            });

            item.querySelector('.status-btn')?.addEventListener('click', () => {
                const collection = storageManager.getCollection();
                const currentItem = collection.find(c => c.word === word);
                if (currentItem) {
                    const newStatus = currentItem.status === 'learned' ? 'learning' : 'learned';
                    storageManager.updateCollectionStatus(word, newStatus);
                    this.updateCollectionPage();
                    this.showToast(`已标记为${this.getStatusText(newStatus)}`, 'success');
                }
            });

            item.querySelector('.delete-btn')?.addEventListener('click', () => {
                storageManager.removeFromCollection(word);
                this.updateCollectionPage();
                this.showToast('已从收藏中删除', 'success');
            });
        });

        // 绑定分页事件
        this.bindCollectionPaginationEvents(filter);
    }

    renderCollectionPagination(totalPages, totalItems) {
        let html = '<div class="pagination">';

        // 上一页
        html += `
            <button class="pagination-btn ${this.collectionPage === 1 ? 'disabled' : ''}"
                    data-page="${this.collectionPage - 1}" ${this.collectionPage === 1 ? 'disabled' : ''}>
                上一页
            </button>
        `;

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="pagination-btn ${i === this.collectionPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // 下一页
        html += `
            <button class="pagination-btn ${this.collectionPage === totalPages ? 'disabled' : ''}"
                    data-page="${this.collectionPage + 1}" ${this.collectionPage === totalPages ? 'disabled' : ''}>
                下一页
            </button>
        `;

        html += `<span class="pagination-info">共 ${totalItems} 条</span>`;
        html += '</div>';

        return html;
    }

    bindCollectionPaginationEvents(filter) {
        const collectionList = document.getElementById('collectionList');
        if (!collectionList) return;

        collectionList.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page && page !== this.collectionPage) {
                    this.collectionPage = page;
                    this.renderCollection(filter);
                    // 滚动到列表顶部
                    collectionList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // 显示收藏详情弹窗（使用本地存储的完整数据，无需请求API）
    showCollectionDetail(word) {
        const collection = storageManager.getCollection();
        const item = collection.find(c => c.word === word);
        if (!item) return;

        // 处理示例文本：将~替换为成语并高亮
        const processedExample = item.example ? this.highlightIdiomInExample(item.example, item.word) : '';

        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'collection-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>${this.escapeHtml(item.word)}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="detail-row">
                        <span class="detail-label">拼音：</span>
                        <span class="detail-value">${this.escapeHtml(item.pinyin)}</span>
                    </div>
                    ${item.explanation ? `
                    <div class="detail-row">
                        <span class="detail-label">释义：</span>
                        <span class="detail-value">${this.escapeHtml(item.explanation)}</span>
                    </div>
                    ` : ''}
                    ${item.derivation ? `
                    <div class="detail-row">
                        <span class="detail-label">出处：</span>
                        <span class="detail-value">${this.escapeHtml(item.derivation)}</span>
                    </div>
                    ` : ''}
                    ${processedExample ? `
                    <div class="detail-row">
                        <span class="detail-label">示例：</span>
                        <span class="detail-value">${processedExample}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    // 处理示例文本：将~替换为成语并高亮显示
    highlightIdiomInExample(example, word) {
        if (!example) return '';

        // 将~替换为成语
        let processed = example.replace(/~/g, word);

        // 对成语进行高亮（使用span包裹）
        // 使用正则表达式匹配成语，避免HTML注入
        const escapedWord = this.escapeHtml(word);
        const highlightRegex = new RegExp(this.escapeRegex(word), 'g');
        processed = processed.replace(highlightRegex, `<span class="highlight-idiom">${escapedWord}</span>`);

        return processed;
    }

    // 转义正则表达式特殊字符
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    updateCollectionStats() {
        const collection = storageManager.getCollection();
        const totalEl = document.getElementById('totalCollection');
        const learnedEl = document.getElementById('learnedCount');
        const learningEl = document.getElementById('learningCount');
        
        if (totalEl) totalEl.textContent = collection.length;
        if (learnedEl) learnedEl.textContent = collection.filter(i => i.status === 'learned').length;
        if (learningEl) learningEl.textContent = collection.filter(i => i.status === 'learning').length;
    }
    
    getStatusText(status) {
        return status === 'learned' ? '已学习' : '学习中';
    }
    
    // 渲染成语详情卡片
    renderIdiomCard(idiom, options = {}) {
        const { showActions = true, compact = false } = options;
        
        if (!idiom || !idiom.word) {
            return '<div class="result-card glass-card"><p>未找到相关成语</p></div>';
        }
        
        const isCollected = storageManager.isCollected(idiom.word);
        
        let actionsHtml = '';
        if (showActions) {
            actionsHtml = `
                <div class="result-actions">
                    <button class="action-btn collect-btn ${isCollected ? 'collected' : ''}" 
                            data-word="${this.escapeHtml(idiom.word)}" 
                            title="${isCollected ? '取消收藏' : '收藏'}">
                        <svg viewBox="0 0 24 24" fill="${isCollected ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                    </button>
                    <button class="action-btn copy-btn" data-word="${this.escapeHtml(idiom.word)}" title="复制">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                        </svg>
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="result-card glass-card" data-word="${this.escapeHtml(idiom.word)}">
                <div class="result-header">
                    <div>
                        <p class="result-word">${this.escapeHtml(idiom.word)}</p>
                        <p class="result-pinyin">${this.escapeHtml(idiom.pinyin)}</p>
                    </div>
                    ${actionsHtml}
                </div>
                <div class="result-section">
                    <p class="section-label">解释</p>
                    <p class="result-content">${this.escapeHtml(idiom.explanation) || '暂无解释'}</p>
                </div>
                ${idiom.derivation ? `
                    <div class="result-section">
                        <p class="section-label">出处</p>
                        <p class="result-content">${this.escapeHtml(idiom.derivation)}</p>
                    </div>
                ` : ''}
                ${idiom.example ? `
                    <div class="result-section">
                        <p class="section-label">例句</p>
                        <p class="result-content">${this.escapeHtml(idiom.example)}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // 工具方法
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    truncate(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }
    
    // 显示错误状态
    showError(message) {
        const resultContainer = document.getElementById('searchResult');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="error-card glass-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:48px;height:48px;color:#C41E3A;margin-bottom:16px;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p style="font-size:16px;color:#1A1A1A;margin-bottom:8px;">查询失败</p>
                    <p style="font-size:14px;color:#6B6B6B;">${this.escapeHtml(message)}</p>
                </div>
            `;
        }
    }
    
    // 显示空结果状态
    showEmpty(message = '未找到相关成语') {
        const resultContainer = document.getElementById('searchResult');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="empty-card glass-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:48px;height:48px;color:#B8860B;margin-bottom:16px;opacity:0.5;">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                    <p style="font-size:16px;color:#1A1A1A;margin-bottom:8px;">${this.escapeHtml(message)}</p>
                    <p style="font-size:14px;color:#6B6B6B;">试试其他关键词吧</p>
                </div>
            `;
        }
    }
}

// 创建全局实例
window.uiManager = new UIManager();
