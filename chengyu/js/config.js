/**
 * 配置文件
 * 包含API配置、存储配置等
 */

const CONFIG = {
    api: {
        baseUrl: 'https://v3.alapi.cn/api/idiom',
        token: 'o6zv1d4ux9qyy9xprsrvsavguypdhk',
        timeout: 10000
    },
    storage: {
        prefix: 'idiom_',
        maxHistory: 20,
        maxCollection: 200
    },
    game: {
        baseScore: 10,
        streakMultiplier: 1.5,
        wrongPenalty: 5,
        maxHints: 3
    },
    animation: {
        duration: 300,
        stagger: 100
    }
};
