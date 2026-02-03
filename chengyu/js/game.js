/**
 * 成语接龙游戏模块
 * 负责游戏逻辑、积分系统、提示功能等
 */

// 本地成语接龙词库（200+常用成语）
const IDIOM_LIBRARY = [
    { word: '一心一意', pinyin: 'yī xīn yī yì' },
    { word: '意气风发', pinyin: 'yì qì fēng fā' },
    { word: '发扬光大', pinyin: 'fā yáng guāng dà' },
    { word: '大公无私', pinyin: 'dà gōng wú sī' },
    { word: '私心杂念', pinyin: 'sī xīn zá niàn' },
    { word: '念念不忘', pinyin: 'niàn niàn bù wàng' },
    { word: '忘恩负义', pinyin: 'wàng ēn fù yì' },
    { word: '义不容辞', pinyin: 'yì bù róng cí' },
    { word: '辞旧迎新', pinyin: 'cí jiù yíng xīn' },
    { word: '新陈代谢', pinyin: 'xīn chén dài xiè' },
    { word: '谢天谢地', pinyin: 'xiè tiān xiè dì' },
    { word: '地大物博', pinyin: 'dì dà wù bó' },
    { word: '博大精深', pinyin: 'bó dà jīng shēn' },
    { word: '深入浅出', pinyin: 'shēn rù qiǎn chū' },
    { word: '出口成章', pinyin: 'chū kǒu chéng zhāng' },
    { word: '章台杨柳', pinyin: 'zhāng tái yáng liǔ' },
    { word: '柳暗花明', pinyin: 'liǔ àn huā míng' },
    { word: '明目张胆', pinyin: 'míng mù zhāng dǎn' },
    { word: '胆战心惊', pinyin: 'dǎn zhàn xīn jīng' },
    { word: '惊天动地', pinyin: 'jīng tiān dòng dì' },
    { word: '地动山摇', pinyin: 'dì dòng shān yáo' },
    { word: '摇头摆尾', pinyin: 'yáo tóu bǎi wěi' },
    { word: '尾大不掉', pinyin: 'wěi dà bù diào' },
    { word: '掉以轻心', pinyin: 'diào yǐ qīng xīn' },
    { word: '心旷神怡', pinyin: 'xīn kuàng shén yí' },
    { word: '怡然自得', pinyin: 'yí rán zì dé' },
    { word: '得心应手', pinyin: 'dé xīn yìng shǒu' },
    { word: '手不释卷', pinyin: 'shǒu bù shì juàn' },
    { word: '卷土重来', pinyin: 'juǎn tǔ chóng lái' },
    { word: '来日方长', pinyin: 'lái rì fāng cháng' },
    { word: '长年累月', pinyin: 'cháng nián lěi yuè' },
    { word: '月白风清', pinyin: 'yuè bái fēng qīng' },
    { word: '清风明月', pinyin: 'qīng fēng míng yuè' },
    { word: '月明星稀', pinyin: 'yuè míng xīng xī' },
    { word: '稀奇古怪', pinyin: 'xī qí gǔ guài' },
    { word: '怪力乱神', pinyin: 'guài lì luàn shén' },
    { word: '神机妙算', pinyin: 'shén jī miào suàn' },
    { word: '算无遗策', pinyin: 'suàn wú yí cè' },
    { word: '策马扬鞭', pinyin: 'cè mǎ yáng biān' },
    { word: '鞭长莫及', pinyin: 'biān cháng mò jí' },
    { word: '及时行乐', pinyin: 'jí shí xíng lè' },
    { word: '乐不思蜀', pinyin: 'lè bù sī shǔ' },
    { word: '蜀犬吠日', pinyin: 'shǔ quǎn fèi rì' },
    { word: '日新月异', pinyin: 'rì xīn yuè yì' },
    { word: '异口同声', pinyin: 'yì kǒu tóng shēng' },
    { word: '声东击西', pinyin: 'shēng dōng jī xī' },
    { word: '西装革履', pinyin: 'xī zhuāng gé lǚ' },
    { word: '履险如夷', pinyin: 'lǚ xiǎn rú yí' },
    { word: '夷为平地', pinyin: 'yí wéi píng dì' },
    { word: '地广人稀', pinyin: 'dì guǎng rén xī' },
    { word: '稀奇古怪', pinyin: 'xī qí gǔ guài' },
    { word: '怪模怪样', pinyin: 'guài mó guài yàng' },
    { word: '样样俱全', pinyin: 'yàng yàng jù quán' },
    { word: '全力以赴', pinyin: 'quán lì yǐ fù' },
    { word: '赴汤蹈火', pinyin: 'fù tāng dǎo huǒ' },
    { word: '火树银花', pinyin: 'huǒ shù yín huā' },
    { word: '花好月圆', pinyin: 'huā hǎo yuè yuán' },
    { word: '圆颅方趾', pinyin: 'yuán lú fāng zhǐ' },
    { word: '趾高气扬', pinyin: 'zhǐ gāo qì yáng' },
    { word: '扬眉吐气', pinyin: 'yáng méi tǔ qì' },
    { word: '气吞山河', pinyin: 'qì tūn shān hé' },
    { word: '河清海晏', pinyin: 'hé qīng hǎi yàn' },
    { word: '晏然自若', pinyin: 'yàn rán zì ruò' },
    { word: '若无其事', pinyin: 'ruò wú qí shì' },
    { word: '事半功倍', pinyin: 'shì bàn gōng bèi' },
    { word: '倍道而进', pinyin: 'bèi dào ér jìn' },
    { word: '进退两难', pinyin: 'jìn tuì liǎng nán' },
    { word: '难能可贵', pinyin: 'nán néng kě guì' },
    { word: '贵人多忘', pinyin: 'guì rén duō wàng' },
    { word: '忘乎所以', pinyin: 'wàng hū suǒ yǐ' },
    { word: '以理服人', pinyin: 'yǐ lǐ fú rén' },
    { word: '人山人海', pinyin: 'rén shān rén hǎi' },
    { word: '海阔天空', pinyin: 'hǎi kuò tiān kōng' },
    { word: '空前绝后', pinyin: 'kōng qián jué hòu' },
    { word: '后来居上', pinyin: 'hòu lái jū shàng' },
    { word: '上行下效', pinyin: 'shàng xíng xià xiào' },
    { word: '效犬马力', pinyin: 'xiào quǎn mǎ lì' },
    { word: '力不从心', pinyin: 'lì bù cóng xīn' },
    { word: '心直口快', pinyin: 'xīn zhí kǒu kuài' },
    { word: '快马加鞭', pinyin: 'kuài mǎ jiā biān' },
    { word: '鞭辟入里', pinyin: 'biān pì rù lǐ' },
    { word: '里应外合', pinyin: 'lǐ yìng wài hé' },
    { word: '合情合理', pinyin: 'hé qíng hé lǐ' },
    { word: '理直气壮', pinyin: 'lǐ zhí qì zhuàng' },
    { word: '壮志凌云', pinyin: 'zhuàng zhì líng yún' },
    { word: '云消雾散', pinyin: 'yún xiāo wù sàn' },
    { word: '散兵游勇', pinyin: 'sǎn bīng yóu yǒng' },
    { word: '勇往直前', pinyin: 'yǒng wǎng zhí qián' },
    { word: '前功尽弃', pinyin: 'qián gōng jìn qì' },
    { word: '弃暗投明', pinyin: 'qì àn tóu míng' },
    { word: '明察秋毫', pinyin: 'míng chá qiū háo' },
    { word: '毫发无损', pinyin: 'háo fà wú sǔn' },
    { word: '损兵折将', pinyin: 'sǔn bīng zhé jiàng' },
    { word: '将心比心', pinyin: 'jiāng xīn bǐ xīn' },
    { word: '心照不宣', pinyin: 'xīn zhào bù xuān' },
    { word: '宣化承流', pinyin: 'xuān huà chéng liú' },
    { word: '流连忘返', pinyin: 'liú lián wàng fǎn' },
    { word: '返老还童', pinyin: 'fǎn lǎo huán tóng' },
    { word: '童颜鹤发', pinyin: 'tóng yán hè fà' },
    { word: '发号施令', pinyin: 'fā hào shī lìng' },
    { word: '令行禁止', pinyin: 'lìng xíng jìn zhǐ' },
    { word: '止步不前', pinyin: 'zhǐ bù bù qián' },
    { word: '前仆后继', pinyin: 'qián pū hòu jì' },
    { word: '继往开来', pinyin: 'jì wǎng kāi lái' },
    { word: '来龙去脉', pinyin: 'lái lóng qù mài' },
    { word: '脉脉含情', pinyin: 'mò mò hán qíng' },
    { word: '情投意合', pinyin: 'qíng tóu yì hé' },
    { word: '合二为一', pinyin: 'hé èr wéi yī' },
    { word: '一鸣惊人', pinyin: 'yī míng jīng rén' },
    { word: '人定胜天', pinyin: 'rén dìng shèng tiān' },
    { word: '天经地义', pinyin: 'tiān jīng dì yì' },
    { word: '义薄云天', pinyin: 'yì bó yún tiān' },
    { word: '天高地厚', pinyin: 'tiān gāo dì hòu' },
    { word: '厚此薄彼', pinyin: 'hòu cǐ bó bǐ' },
    { word: '彼竭我盈', pinyin: 'bǐ jié wǒ yíng' },
    { word: '盈千累万', pinyin: 'yíng qiān lěi wàn' },
    { word: '万水千山', pinyin: 'wàn shuǐ qiān shān' },
    { word: '山穷水尽', pinyin: 'shān qióng shuǐ jìn' },
    { word: '尽善尽美', pinyin: 'jìn shàn jìn měi' },
    { word: '美中不足', pinyin: 'měi zhōng bù zú' },
    { word: '足智多谋', pinyin: 'zú zhì duō móu' },
    { word: '谋事在人', pinyin: 'móu shì zài rén' },
    { word: '人山人海', pinyin: 'rén shān rén hǎi' },
    { word: '海阔天空', pinyin: 'hǎi kuò tiān kōng' },
    { word: '空穴来风', pinyin: 'kōng xué lái fēng' },
    { word: '风和日丽', pinyin: 'fēng hé rì lì' },
    { word: '丽句清词', pinyin: 'lì jù qīng cí' },
    { word: '词不达意', pinyin: 'cí bù dá yì' },
    { word: '意在言外', pinyin: 'yì zài yán wài' },
    { word: '外强中干', pinyin: 'wài qiáng zhōng gān' },
    { word: '干净利落', pinyin: 'gān jìng lì luò' },
    { word: '落花流水', pinyin: 'luò huā liú shuǐ' },
    { word: '水落石出', pinyin: 'shuǐ luò shí chū' },
    { word: '出类拔萃', pinyin: 'chū lèi bá cuì' },
    { word: '萃聚精华', pinyin: 'cuì jù jīng huá' },
    { word: '华而不实', pinyin: 'huá ér bù shí' },
    { word: '实事求是', pinyin: 'shí shì qiú shì' },
    { word: '是非曲直', pinyin: 'shì fēi qū zhí' },
    { word: '直截了当', pinyin: 'zhí jié liǎo dàng' },
    { word: '当仁不让', pinyin: 'dāng rén bù ràng' },
    { word: '让枣推梨', pinyin: 'ràng zǎo tuī lí' },
    { word: '梨园弟子', pinyin: 'lí yuán dì zǐ' },
    { word: '子虚乌有', pinyin: 'zǐ xū wū yǒu' },
    { word: '有目共赏', pinyin: 'yǒu mù gòng shǎng' },
    { word: '赏心悦目', pinyin: 'shǎng xīn yuè mù' },
    { word: '目中无人', pinyin: 'mù zhōng wú rén' },
    { word: '人浮于事', pinyin: 'rén fú yú shì' },
    { word: '事在人为', pinyin: 'shì zài rén wéi' },
    { word: '为所欲为', pinyin: 'wéi suǒ yù wéi' },
    { word: '为虎作伥', pinyin: 'wèi hǔ zuò chāng' },
    { word: '伥鬼缠身', pinyin: 'chāng guǐ chán shēn' },
    { word: '身经百战', pinyin: 'shēn jīng bǎi zhàn' },
    { word: '战无不胜', pinyin: 'zhàn wú bù shèng' },
    { word: '胜不骄败不馁', pinyin: 'shèng bù jiāo bài bù něi' },
    { word: '馁殍相望', pinyin: 'něi piǎo xiāng wàng' },
    { word: '望子成龙', pinyin: 'wàng zǐ chéng lóng' },
    { word: '龙飞凤舞', pinyin: 'lóng fēi fèng wǔ' },
    { word: '舞文弄墨', pinyin: 'wǔ wén nòng mò' },
    { word: '墨守成规', pinyin: 'mò shǒu chéng guī' },
    { word: '规行矩步', pinyin: 'guī xíng jǔ bù' },
    { word: '步步为营', pinyin: 'bù bù wéi yíng' },
    { word: '营私舞弊', pinyin: 'yíng sī wǔ bì' },
    { word: '弊绝风清', pinyin: 'bì jué fēng qīng' },
    { word: '清风两袖', pinyin: 'qīng fēng liǎng xiù' },
    { word: '袖手旁观', pinyin: 'xiù shǒu páng guān' },
    { word: '观过知仁', pinyin: 'guān guò zhī rén' },
    { word: '仁至义尽', pinyin: 'rén zhì yì jìn' },
    { word: '尽善尽美', pinyin: 'jìn shàn jìn měi' },
    { word: '美不胜收', pinyin: 'měi bù shèng shōu' },
    { word: '收放自如', pinyin: 'shōu fàng zì rú' },
    { word: '如日中天', pinyin: 'rú rì zhōng tiān' },
    { word: '天造地设', pinyin: 'tiān zào dì shè' },
    { word: '设身处地', pinyin: 'shè shēn chǔ dì' },
    { word: '地利人和', pinyin: 'dì lì rén hé' },
    { word: '和衷共济', pinyin: 'hé zhōng gòng jì' },
    { word: '济世安民', pinyin: 'jì shì ān mín' },
    { word: '民不聊生', pinyin: 'mín bù liáo shēng' },
    { word: '生离死别', pinyin: 'shēng lí sǐ bié' },
    { word: '别出心裁', pinyin: 'bié chū xīn cái' },
    { word: '才高八斗', pinyin: 'cái gāo bā dǒu' },
    { word: '斗转星移', pinyin: 'dǒu zhuǎn xīng yí' },
    { word: '移花接木', pinyin: 'yí huā jiē mù' },
    { word: '木已成舟', pinyin: 'mù yǐ chéng zhōu' },
    { word: '舟车劳顿', pinyin: 'zhōu chē láo dùn' },
    { word: '顿开茅塞', pinyin: 'dùn kāi máo sè' },
    { word: '塞翁失马', pinyin: 'sài wēng shī mǎ' },
    { word: '马到成功', pinyin: 'mǎ dào chéng gōng' },
    { word: '功成名就', pinyin: 'gōng chéng míng jiù' },
    { word: '就地取材', pinyin: 'jiù dì qǔ cái' },
    { word: '材大难用', pinyin: 'cái dà nán yòng' },
    { word: '用兵如神', pinyin: 'yòng bīng rú shén' },
    { word: '神出鬼没', pinyin: 'shén chū guǐ mò' },
    { word: '没齿难忘', pinyin: 'mò chǐ nán wàng' },
    { word: '忘恩负义', pinyin: 'wàng ēn fù yì' },
    { word: '义无反顾', pinyin: 'yì wú fǎn gù' },
    { word: '顾全大局', pinyin: 'gù quán dà jú' },
    { word: '局促不安', pinyin: 'jú cù bù ān' },
    { word: '安步当车', pinyin: 'ān bù dàng chē' },
    { word: '车水马龙', pinyin: 'chē shuǐ mǎ lóng' },
    { word: '龙腾虎跃', pinyin: 'lóng téng hǔ yuè' },
    { word: '跃然纸上', pinyin: 'yuè rán zhǐ shàng' },
    { word: '上善若水', pinyin: 'shàng shàn ruò shuǐ' },
    { word: '水到渠成', pinyin: 'shuǐ dào qú chéng' },
    { word: '成千上万', pinyin: 'chéng qiān shàng wàn' },
    { word: '万众一心', pinyin: 'wàn zhòng yī xīn' },
    { word: '心花怒放', pinyin: 'xīn huā nù fàng' },
    { word: '放虎归山', pinyin: 'fàng hǔ guī shān' },
    { word: '山明水秀', pinyin: 'shān míng shuǐ xiù' },
    { word: '秀外慧中', pinyin: 'xiù wài huì zhōng' },
    { word: '中流砥柱', pinyin: 'zhōng liú dǐ zhù' },
    { word: '柱石之坚', pinyin: 'zhù shí zhī jiān' },
    { word: '坚如磐石', pinyin: 'jiān rú pán shí' },
    { word: '石破天惊', pinyin: 'shí pò tiān jīng' },
    { word: '惊弓之鸟', pinyin: 'jīng gōng zhī niǎo' },
    { word: '鸟语花香', pinyin: 'niǎo yǔ huā xiāng' },
    { word: '香消玉殒', pinyin: 'xiāng xiāo yù yǔn' },
    { word: '殒身不恤', pinyin: 'yǔn shēn bù xù' },
    { word: '恤老怜贫', pinyin: 'xù lǎo lián pín' },
    { word: '贫病交加', pinyin: 'pín bìng jiāo jiā' },
    { word: '加人一等', pinyin: 'jiā rén yī děng' },
    { word: '等而下之', pinyin: 'děng ér xià zhī' },
    { word: '之乎者也', pinyin: 'zhī hū zhě yě' },
    { word: '也里可温', pinyin: 'yě lǐ kě wēn' },
    { word: '温文尔雅', pinyin: 'wēn wén ěr yǎ' },
    { word: '雅俗共赏', pinyin: 'yǎ sú gòng shǎng' },
    { word: '赏罚分明', pinyin: 'shǎng fá fēn míng' },
    { word: '明辨是非', pinyin: 'míng biàn shì fēi' },
    { word: '非同小可', pinyin: 'fēi tóng xiǎo kě' },
    { word: '可歌可泣', pinyin: 'kě gē kě qì' },
    { word: '泣不成声', pinyin: 'qì bù chéng shēng' },
    { word: '声嘶力竭', pinyin: 'shēng sī lì jié' },
    { word: '竭尽全力', pinyin: 'jié jìn quán lì' },
    { word: '力挽狂澜', pinyin: 'lì wǎn kuáng lán' },
    { word: '澜倒波随', pinyin: 'lán dǎo bō suí' },
    { word: '随波逐流', pinyin: 'suí bō zhú liú' },
    { word: '流离失所', pinyin: 'liú lí shī suǒ' },
    { word: '所向披靡', pinyin: 'suǒ xiàng pī mǐ' },
    { word: '靡靡之音', pinyin: 'mǐ mǐ zhī yīn' },
    { word: '音容笑貌', pinyin: 'yīn róng xiào mào' },
    { word: '貌合神离', pinyin: 'mào hé shén lí' },
    { word: '离经叛道', pinyin: 'lí jīng pàn dào' },
    { word: '道听途说', pinyin: 'dào tīng tú shuō' },
    { word: '说一不二', pinyin: 'shuō yī bù èr' },
    { word: '二龙戏珠', pinyin: 'èr lóng xì zhū' },
    { word: '珠光宝气', pinyin: 'zhū guāng bǎo qì' },
    { word: '气冲斗牛', pinyin: 'qì chōng dǒu niú' },
    { word: '牛刀割鸡', pinyin: 'niú dāo gē jī' },
    { word: '鸡犬不宁', pinyin: 'jī quǎn bù níng' },
    { word: '宁死不屈', pinyin: 'nìng sǐ bù qū' },
    { word: '屈打成招', pinyin: 'qū dǎ chéng zhāo' },
    { word: '招摇过市', pinyin: 'zhāo yáo guò shì' },
    { word: '市井之徒', pinyin: 'shì jǐng zhī tú' },
    { word: '徒有虚名', pinyin: 'tú yǒu xū míng' },
    { word: '名垂青史', pinyin: 'míng chuí qīng shǐ' },
    { word: '史无前例', pinyin: 'shǐ wú qián lì' },
    { word: '历历在目', pinyin: 'lì lì zài mù' },
    { word: '目不转睛', pinyin: 'mù bù zhuǎn jīng' },
    { word: '睛天霹雳', pinyin: 'jīng tiān pī lì' },
    { word: '雳声大作', pinyin: 'lì shēng dà zuò' }
];

class GameManager {
    constructor() {
        this.currentIdiom = null;
        this.userInput = '';
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.hintsRemaining = 3;
        this.difficulty = 'easy';
        this.gameActive = false;
        this.usedIdioms = [];
        this.isUserTurn = true; // 是否是用户回合
        this.init();
    }
    
    init() {
        this.bindGameControls();
        this.bindCollectionTabs();
    }
    
    bindGameControls() {
        const startBtn = document.getElementById('startGameBtn');
        const submitBtn = document.getElementById('submitAnswerBtn');
        const hintBtn = document.getElementById('useHintBtn');
        const restartBtn = document.getElementById('restartGameBtn');
        const backBtn = document.getElementById('backToMenuBtn');
        const gameInput = document.getElementById('gameInput');
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.useHint());
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.startGame());
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showMenu());
        }
        
        if (gameInput) {
            gameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });
        }
        
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.dataset.difficulty;
            });
        });
    }
    
    bindCollectionTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                uiManager.renderCollection(btn.dataset.tab);
            });
        });
        
        const exportBtn = document.getElementById('exportCollection');
        const clearBtn = document.getElementById('clearCollection');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCollection());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCollection());
        }
    }
    
    startGame() {
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.hintsRemaining = CONFIG.game.maxHints;
        this.gameActive = true;
        this.usedIdioms = [];
        this.isUserTurn = true;
        
        document.getElementById('gameStart').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gamePlaying').style.display = 'block';
        
        this.updateStats();
        this.updateGameUI();
        
        const gameInput = document.getElementById('gameInput');
        if (gameInput) {
            gameInput.value = '';
            gameInput.focus();
        }
        
        // 从本地词库随机选择起始成语
        this.setRandomStartIdiom();
    }
    
    // 从本地词库随机选择起始成语
    setRandomStartIdiom() {
        const availableIdioms = IDIOM_LIBRARY.filter(idiom => !this.usedIdioms.includes(idiom.word));
        if (availableIdioms.length === 0) {
            this.endGame();
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableIdioms.length);
        this.currentIdiom = availableIdioms[randomIndex];
        this.usedIdioms.push(this.currentIdiom.word);
        this.displayCurrentIdiom();
        
        // 显示提示
        this.showFeedback(`游戏开始！请接"${this.getLastChar(this.currentIdiom.word)}"开头的成语`, 'default', document.getElementById('gameFeedback'));
    }
    
    displayCurrentIdiom() {
        const wordEl = document.getElementById('idiomWord');
        const pinyinEl = document.getElementById('idiomPinyin');
        const chainEl = document.getElementById('gameChain');
        
        if (wordEl) wordEl.textContent = this.currentIdiom.word;
        if (pinyinEl) pinyinEl.textContent = this.currentIdiom.pinyin;
        
        const newIdiom = document.createElement('div');
        newIdiom.className = 'current-idiom';
        newIdiom.innerHTML = `
            <div class="idiom-display glass-card">
                <p class="idiom-word">${uiManager.escapeHtml(this.currentIdiom.word)}</p>
                <p class="idiom-pinyin">${uiManager.escapeHtml(this.currentIdiom.pinyin)}</p>
            </div>
        `;
        
        if (chainEl) {
            chainEl.innerHTML = '';
            chainEl.appendChild(newIdiom);
        }
    }
    
    // 电脑自动接龙
    async computerPlay() {
        if (!this.gameActive) return;
        
        this.isUserTurn = false;
        const feedbackEl = document.getElementById('gameFeedback');
        
        // 显示电脑思考中
        this.showFeedback('电脑思考中...', 'default', feedbackEl);
        
        // 禁用输入
        const gameInput = document.getElementById('gameInput');
        const submitBtn = document.getElementById('submitAnswerBtn');
        if (gameInput) gameInput.disabled = true;
        if (submitBtn) submitBtn.disabled = true;
        
        // 模拟思考时间
        await this.delay(1500);
        
        const lastChar = this.getLastChar(this.currentIdiom.word);
        const computerIdiom = this.findComputerIdiom(lastChar);
        
        if (computerIdiom) {
            // 电脑成功接龙
            this.currentIdiom = computerIdiom;
            this.usedIdioms.push(computerIdiom.word);
            this.displayCurrentIdiom();
            
            this.showFeedback(`电脑接龙：${computerIdiom.word}，请接"${this.getLastChar(computerIdiom.word)}"开头的成语`, 'default', feedbackEl);
            
            // 恢复用户输入
            this.isUserTurn = true;
            if (gameInput) {
                gameInput.disabled = false;
                gameInput.value = '';
                gameInput.focus();
            }
            if (submitBtn) submitBtn.disabled = false;
        } else {
            // 电脑无法接龙，用户获胜
            this.showFeedback('电脑无法接龙，你赢了！', 'success', feedbackEl);
            this.score += 50; // 获胜奖励
            this.updateStats();
            
            setTimeout(() => {
                this.endGame(true);
            }, 2000);
        }
    }
    
    // 为电脑寻找可接的成语
    findComputerIdiom(lastChar) {
        // 根据难度选择
        const availableIdioms = IDIOM_LIBRARY.filter(idiom => {
            const firstChar = this.getFirstChar(idiom.word);
            return firstChar === lastChar && !this.usedIdioms.includes(idiom.word);
        });
        
        if (availableIdioms.length === 0) return null;
        
        // 随机选择一个
        const randomIndex = Math.floor(Math.random() * availableIdioms.length);
        return availableIdioms[randomIndex];
    }
    
    async submitAnswer() {
        if (!this.gameActive || !this.isUserTurn) return;
        
        const gameInput = document.getElementById('gameInput');
        const feedbackEl = document.getElementById('gameFeedback');
        
        if (!gameInput) return;
        
        const userAnswer = gameInput.value.trim();
        
        if (!userAnswer) {
            this.showFeedback('请输入成语', 'error', feedbackEl);
            return;
        }

        if (userAnswer.length < 2) {
            this.showFeedback('请输入完整的成语（至少2个字）', 'error', feedbackEl);
            return;
        }
        
        if (this.usedIdioms.includes(userAnswer)) {
            this.showFeedback('这个成语已经用过了，请换一个', 'error', feedbackEl);
            return;
        }
        
        const lastChar = this.getLastChar(this.currentIdiom.word);
        const firstChar = this.getFirstChar(userAnswer);
        
        if (lastChar !== firstChar) {
            this.streak = 0;
            this.score = Math.max(0, this.score - CONFIG.game.wrongPenalty);
            this.updateStats();
            this.showFeedback(`接龙失败！应该以"${lastChar}"开头`, 'error', feedbackEl);
            gameInput.value = '';
            return;
        }
        
        // 验证成语是否存在（检查本地词库）
        const validIdiom = IDIOM_LIBRARY.find(idiom => idiom.word === userAnswer);
        
        if (validIdiom) {
            // 用户回答正确
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            
            const basePoints = CONFIG.game.baseScore;
            const streakBonus = Math.floor(basePoints * (this.streak - 1) * CONFIG.game.streakMultiplier * 0.1);
            const points = basePoints + streakBonus;
            
            this.score += points;
            this.updateStats();
            
            this.showFeedback(`回答正确！+${points}分`, 'success', feedbackEl);
            
            this.currentIdiom = validIdiom;
            this.usedIdioms.push(validIdiom.word);
            
            setTimeout(() => {
                this.displayCurrentIdiom();
                // 轮到电脑
                this.computerPlay();
            }, 800);
        } else {
            // 成语不在本地词库中，尝试通过API验证
            try {
                const result = await idiomAPI.query(userAnswer);
                
                if (result && result.word) {
                    this.streak++;
                    this.maxStreak = Math.max(this.maxStreak, this.streak);
                    
                    const basePoints = CONFIG.game.baseScore;
                    const streakBonus = Math.floor(basePoints * (this.streak - 1) * CONFIG.game.streakMultiplier * 0.1);
                    const points = basePoints + streakBonus;
                    
                    this.score += points;
                    this.updateStats();
                    
                    this.showFeedback(`回答正确！+${points}分`, 'success', feedbackEl);
                    
                    this.currentIdiom = result;
                    this.usedIdioms.push(result.word);
                    
                    setTimeout(() => {
                        this.displayCurrentIdiom();
                        // 轮到电脑
                        this.computerPlay();
                    }, 800);
                } else {
                    this.streak = 0;
                    this.score = Math.max(0, this.score - CONFIG.game.wrongPenalty);
                    this.updateStats();
                    this.showFeedback('这个成语不存在，请重新输入', 'error', feedbackEl);
                }
            } catch (error) {
                // API验证失败，但如果是本地词库中的成语也接受
                this.streak = 0;
                this.score = Math.max(0, this.score - CONFIG.game.wrongPenalty);
                this.updateStats();
                this.showFeedback('验证失败，请检查网络后重试', 'error', feedbackEl);
            }
        }
    }
    
    useHint() {
        if (!this.gameActive || !this.isUserTurn || this.hintsRemaining <= 0) return;
        
        const feedbackEl = document.getElementById('gameFeedback');
        const lastChar = this.getLastChar(this.currentIdiom.word);
        
        // 从本地词库找提示
        const hintIdioms = IDIOM_LIBRARY.filter(idiom => {
            const firstChar = this.getFirstChar(idiom.word);
            return firstChar === lastChar && !this.usedIdioms.includes(idiom.word);
        });
        
        if (hintIdioms.length > 0) {
            this.hintsRemaining--;
            this.score = Math.max(0, this.score - 5);
            this.updateStats();
            
            const randomHint = hintIdioms[Math.floor(Math.random() * hintIdioms.length)];
            this.showFeedback(`提示：可以试试"${randomHint.word}"，-5分`, 'default', feedbackEl);
        } else {
            this.showFeedback('暂无可用的提示', 'error', feedbackEl);
        }
    }
    
    getLastChar(str) {
        if (!str) return '';
        return str[str.length - 1];
    }
    
    getFirstChar(str) {
        if (!str) return '';
        return str[0];
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    updateStats() {
        const streakEl = document.getElementById('streakCount');
        const scoreEl = document.getElementById('currentScore');
        const hintEl = document.getElementById('hintCount');
        
        if (streakEl) streakEl.textContent = this.streak;
        if (scoreEl) scoreEl.textContent = this.score;
        if (hintEl) hintEl.textContent = this.hintsRemaining;
    }
    
    updateGameUI() {
        this.updateStats();
    }
    
    showFeedback(message, type, element) {
        if (!element) return;
        
        element.textContent = message;
        element.className = 'game-feedback';
        
        if (type === 'success') {
            element.classList.add('success');
        } else if (type === 'error') {
            element.classList.add('error');
        }
    }
    
    endGame(userWon = false) {
        this.gameActive = false;
        
        document.getElementById('gamePlaying').style.display = 'none';
        document.getElementById('gameOver').style.display = 'block';
        
        const finalScoreEl = document.getElementById('finalScore');
        const maxStreakEl = document.getElementById('maxStreak');
        const gameResultEl = document.getElementById('gameResult');
        
        if (finalScoreEl) finalScoreEl.textContent = this.score;
        if (maxStreakEl) maxStreakEl.textContent = this.maxStreak;
        
        if (gameResultEl) {
            if (userWon) {
                gameResultEl.innerHTML = `<p>🎉 恭喜你赢了！</p><p>最终得分：<span>${this.score}</span></p>`;
            } else {
                gameResultEl.innerHTML = `<p>游戏结束</p><p>最终得分：<span>${this.score}</span></p>`;
            }
        }
        
        storageManager.saveGameRecord({
            score: this.score,
            maxStreak: this.maxStreak,
            difficulty: this.difficulty,
            usedIdioms: this.usedIdioms.length,
            userWon: userWon
        });
    }
    
    showMenu() {
        this.gameActive = false;
        
        document.getElementById('gameStart').style.display = 'block';
        document.getElementById('gamePlaying').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
    }
    
    exportCollection() {
        const collection = storageManager.getCollection();
        
        if (collection.length === 0) {
            uiManager.showToast('暂无收藏可导出', 'error');
            return;
        }
        
        let content = '成语智慧阁 - 我的收藏\n';
        content += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
        content += `收藏数量: ${collection.length}\n`;
        content += '================================\n\n';
        
        collection.forEach((item, index) => {
            content += `${index + 1}. ${item.word}\n`;
            content += `   拼音: ${item.pinyin}\n`;
            content += `   解释: ${item.explanation}\n`;
            if (item.derivation) {
                content += `   出处: ${item.derivation}\n`;
            }
            if (item.example) {
                content += `   例句: ${item.example}\n`;
            }
            content += `   状态: ${item.status === 'learned' ? '已学习' : '学习中'}\n`;
            content += '\n';
        });
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '成语收藏.txt';
        a.click();
        URL.revokeObjectURL(url);
        
        uiManager.showToast('收藏已导出', 'success');
    }
    
    clearCollection() {
        const collection = storageManager.getCollection();
        
        if (collection.length === 0) {
            uiManager.showToast('暂无收藏', 'error');
            return;
        }
        
        if (confirm('确定要清空所有收藏吗？此操作不可恢复。')) {
            storageManager.set('collection', []);
            uiManager.updateCollectionPage();
            uiManager.showToast('收藏已清空', 'success');
        }
    }
}

// 创建全局实例
window.gameManager = new GameManager();
