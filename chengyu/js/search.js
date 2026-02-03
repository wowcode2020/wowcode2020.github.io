/**
 * 搜索功能模块
 * 负责成语搜索、建议显示等功能
 */

class SearchManager {
    constructor() {
        this.currentResults = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.bindHeroSearch();
        this.bindSearchPage();
    }

    bindHeroSearch() {
        const input = document.getElementById('heroSearchInput');
        const btn = document.getElementById('heroSearchBtn');

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.searchFromHome(input.value);
                }
            });
        }

        if (btn) {
            btn.addEventListener('click', () => this.searchFromHome(input?.value));
        }
    }

    bindSearchPage() {
        const input = document.getElementById('searchPageInput');
        const btn = document.getElementById('searchPageBtn');
        const clearBtn = document.getElementById('clearHistory');

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.search(input.value);
                }
            });
        }

        if (btn) {
            btn.addEventListener('click', () => this.search(input?.value));
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                storageManager.clearSearchHistory();
                uiManager.updateSearchPage();
                uiManager.showToast('搜索历史已清空', 'success');
            });
        }
    }

    // 从首页搜索 - 跳转到搜索页并显示结果
    async searchFromHome(word) {
        const trimmedWord = word?.trim();

        if (!trimmedWord || trimmedWord.length === 0) {
            uiManager.showToast('请输入成语关键词', 'error');
            return;
        }

        // 先跳转到搜索页
        uiManager.navigateTo('search');

        // 等待页面切换完成
        setTimeout(async () => {
            const searchInput = document.getElementById('searchPageInput');
            if (searchInput) {
                searchInput.value = trimmedWord;
            }
            await this.search(trimmedWord);
        }, 100);
    }

    async search(word) {
        const trimmedWord = word?.trim();

        if (!trimmedWord || trimmedWord.length === 0) {
            uiManager.showToast('请输入成语关键词', 'error');
            return;
        }

        uiManager.showLoading('查询中...');

        try {
            const results = await idiomAPI.queryAll(trimmedWord);

            if (results && results.length > 0) {
                // 记录搜索历史（只记录第一个）
                storageManager.addSearchHistory(results[0].word);

                this.currentResults = results;
                this.currentPage = 1;

                // 在搜索页显示结果
                this.renderSearchPageResults();

                uiManager.hideLoading();
            } else {
                uiManager.showEmpty(`未找到以"${trimmedWord}"开头的成语`);
                uiManager.hideLoading();
            }
        } catch (error) {
            console.error('搜索失败:', error);
            uiManager.showError(error.message);
            uiManager.hideLoading();
        }
    }

    renderSearchPageResults() {
        const resultContainer = document.getElementById('searchResult');
        if (!resultContainer) return;

        // 计算分页
        const totalPages = Math.ceil(this.currentResults.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.currentResults.length);
        const pageResults = this.currentResults.slice(startIndex, endIndex);

        // 渲染结果 - 紧凑表格样式
        let html = '<div class="results-table">';
        html += `
            <div class="results-table-header">
                <span class="col-word">成语</span>
                <span class="col-actions">操作</span>
            </div>
        `;

        pageResults.forEach((result, index) => {
            const globalIndex = startIndex + index;
            html += this.renderCompactIdiomRow(result, globalIndex);
        });

        html += '</div>';

        // 渲染分页
        if (totalPages > 1) {
            html += this.renderPagination(totalPages);
        }

        resultContainer.innerHTML = html;

        // 绑定折叠展开事件
        this.bindCollapsibleEvents();

        // 绑定收藏和复制事件
        this.bindResultActions();

        if (uiManager.currentPage === 'search') {
            uiManager.updateSearchPage();
        }
    }

    renderCompactIdiomRow(result, index) {
        const isCollected = storageManager.isCollected(result.word);

        return `
            <div class="result-row glass-card" data-index="${index}">
                <div class="result-row-header">
                    <div class="result-word-section">
                        <span class="result-word">${uiManager.escapeHtml(result.word)}</span>
                    </div>
                    <div class="result-actions">
                        <button class="action-btn collect-btn ${isCollected ? 'collected' : ''}" data-word="${uiManager.escapeHtml(result.word)}" title="${isCollected ? '取消收藏' : '收藏'}">
                            <svg viewBox="0 0 24 24" fill="${isCollected ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                            </svg>
                        </button>
                        <button class="action-btn copy-btn" data-word="${uiManager.escapeHtml(result.word)}" title="复制">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                            </svg>
                        </button>
                        <button class="action-btn expand-btn" data-index="${index}" title="展开/收起">
                            <svg class="expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="result-row-details" id="details-${index}" style="display: none;">
                    <div class="detail-item">
                        <span class="detail-label">拼音：</span>
                        <span class="detail-value">${uiManager.escapeHtml(result.pinyin)}</span>
                    </div>
                    ${result.explanation ? `
                    <div class="detail-item">
                        <span class="detail-label">释义：</span>
                        <span class="detail-value">${uiManager.escapeHtml(result.explanation)}</span>
                    </div>
                    ` : ''}
                    ${result.derivation ? `
                    <div class="detail-item">
                        <span class="detail-label">出处：</span>
                        <span class="detail-value">${uiManager.escapeHtml(result.derivation)}</span>
                    </div>
                    ` : ''}
                    ${result.example ? `
                    <div class="detail-item">
                        <span class="detail-label">示例：</span>
                        <span class="detail-value">${uiManager.escapeHtml(result.example)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderPagination(totalPages) {
        let html = '<div class="pagination">';

        // 上一页
        html += `
            <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}"
                    data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>
                上一页
            </button>
        `;

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            html += `
                <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // 下一页
        html += `
            <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}"
                    data-page="${this.currentPage + 1}" ${this.currentPage === totalPages ? 'disabled' : ''}>
                下一页
            </button>
        `;

        html += `<span class="pagination-info">共 ${this.currentResults.length} 条</span>`;
        html += '</div>';

        return html;
    }

    bindCollapsibleEvents() {
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                const details = document.getElementById(`details-${index}`);
                const icon = btn.querySelector('.expand-icon');
                const row = btn.closest('.result-row');

                if (details.style.display === 'none') {
                    details.style.display = 'block';
                    icon.style.transform = 'rotate(180deg)';
                    row.classList.add('expanded');
                } else {
                    details.style.display = 'none';
                    icon.style.transform = 'rotate(0deg)';
                    row.classList.remove('expanded');
                }
            });
        });

        // 分页按钮
        document.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderSearchPageResults();
                    // 滚动到结果顶部
                    const resultContainer = document.getElementById('searchResult');
                    if (resultContainer) {
                        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    }

    bindResultActions() {
        const container = document.getElementById('searchResult');
        if (!container) return;

        container.querySelectorAll('.collect-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const word = btn.dataset.word;

                try {
                    // 从当前结果中找到对应的成语数据
                    const result = this.currentResults.find(r => r.word === word);
                    if (!result) return;

                    if (storageManager.isCollected(result.word)) {
                        storageManager.removeFromCollection(result.word);
                        btn.classList.remove('collected');
                        btn.querySelector('svg').setAttribute('fill', 'none');
                        btn.title = '收藏';
                        uiManager.showToast('已取消收藏', 'success');
                    } else {
                        storageManager.addToCollection(result);
                        btn.classList.add('collected');
                        btn.querySelector('svg').setAttribute('fill', 'currentColor');
                        btn.title = '取消收藏';
                        uiManager.showToast('收藏成功', 'success');
                    }
                } catch (error) {
                    uiManager.showToast('操作失败，请重试', 'error');
                }
            });
        });

        container.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const word = btn.dataset.word;
                navigator.clipboard.writeText(word).then(() => {
                    uiManager.showToast('已复制到剪贴板', 'success');
                }).catch(() => {
                    uiManager.showToast('复制失败，请手动复制', 'error');
                });
            });
        });
    }

    async loadDailyIdioms() {
        const container = document.getElementById('dailyIdioms');
        if (!container) return;

        const commonIdioms = [
            { word: '一心一意', pinyin: 'yī xīn yī yì' },
            { word: '画蛇添足', pinyin: 'huà shé tiān zú' },
            { word: '守株待兔', pinyin: 'shǒu zhū dài tù' },
            { word: '亡羊补牢', pinyin: 'wáng yáng bǔ láo' },
            { word: '井底之蛙', pinyin: 'jǐng dǐ zhī wā' },
            { word: '对牛弹琴', pinyin: 'duì niú tán qín' },
            { word: '守口如瓶', pinyin: 'shǒu kǒu rú píng' },
            { word: '画龙点睛', pinyin: 'huà lóng diǎn jīng' }
        ];

        const shuffled = commonIdioms.sort(() => Math.random() - 0.5).slice(0, 4);

        container.innerHTML = shuffled.map(idiom => `
            <div class="daily-idiom glass-card" data-word="${uiManager.escapeHtml(idiom.word)}">
                <p class="idiom-word">${uiManager.escapeHtml(idiom.word)}</p>
                <p class="idiom-pinyin">${uiManager.escapeHtml(idiom.pinyin)}</p>
            </div>
        `).join('');

        container.querySelectorAll('.daily-idiom').forEach(item => {
            item.addEventListener('click', () => {
                const word = item.dataset.word;
                const searchInput = document.getElementById('heroSearchInput');
                if (searchInput) {
                    searchInput.value = word;
                    this.searchFromHome(word);
                }
            });
        });
    }
}

// 创建全局实例
window.searchManager = new SearchManager();
