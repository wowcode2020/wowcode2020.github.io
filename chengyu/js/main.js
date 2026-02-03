/**
 * 主入口文件
 * 页面初始化和全局事件绑定
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('成语智慧阁 - 初始化中...');
    
    initNavigation();
    initKeyboardShortcuts();
    initCopyProtection();
    
    loadDailyRecommendations();
    
    console.log('成语智慧阁 - 初始化完成');
}

function initNavigation() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id;
                const pageName = pageId.replace('page-', '');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.page === pageName) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    pages.forEach(page => observer.observe(page));
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    break;
                case 'f':
                    e.preventDefault();
                    const searchInput = document.getElementById('heroSearchInput') || document.getElementById('searchPageInput');
                    if (searchInput) {
                        searchInput.focus();
                        uiManager.navigateTo('search');
                    }
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            const suggestions = document.querySelectorAll('.search-suggestions');
            suggestions.forEach(s => s.classList.remove('show'));
            
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu?.classList.contains('show')) {
                navMenu.classList.remove('show');
            }
        }
    });
}

function initCopyProtection() {
    document.addEventListener('copy', (e) => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText.length > 0) {
            const toast = document.getElementById('toast');
            if (toast) {
                const originalMessage = toast.textContent;
                toast.textContent = '已复制';
                toast.className = 'toast';
                
                setTimeout(() => {
                    toast.textContent = originalMessage;
                    toast.className = 'toast';
                }, 1000);
            }
        }
    });
}

function loadDailyRecommendations() {
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
        { word: '画龙点睛', pinyin: 'huà lóng diǎn jīng' },
        { word: '叶公好龙', pinyin: 'yè gōng hào lóng' },
        { word: '狐假虎威', pinyin: 'hú jiǎ hǔ wēi' },
        { word: '鹤立鸡群', pinyin: 'hè lì jī qún' },
        { word: '闻鸡起舞', pinyin: 'wén jī qǐ wǔ' }
    ];
    
    const shuffled = commonIdioms.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    
    container.innerHTML = selected.map(idiom => `
        <div class="daily-idiom glass-card" data-word="${idiom.word}">
            <p class="idiom-word">${idiom.word}</p>
            <p class="idiom-pinyin">${idiom.pinyin}</p>
        </div>
    `).join('');
    
    container.querySelectorAll('.daily-idiom').forEach(item => {
        item.addEventListener('click', () => {
            const word = item.dataset.word;
            uiManager.navigateTo('search');
            
            setTimeout(() => {
                const searchInput = document.getElementById('searchPageInput');
                if (searchInput) {
                    searchInput.value = word;
                    searchManager?.search(word);
                }
            }, 100);
        });
    });
}

// 全局错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise错误:', e.reason);
});

// Service Worker注册（可选，用于离线支持）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js').then(registration => {
        //     console.log('ServiceWorker注册成功:', registration.scope);
        // }).catch(error => {
        //     console.log('ServiceWorker注册失败:', error);
        // });
    });
}
