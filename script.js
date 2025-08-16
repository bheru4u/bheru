document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const textToTypeEl = document.getElementById('text-to-type');
    const inputField = document.getElementById('input-field');
    const timeEl = document.getElementById('time');
    const wpmEl = document.getElementById('wpm');
    const accuracyEl = document.getElementById('accuracy');
    const levelSelector = document.getElementById('level');
    const categorySelector = document.getElementById('category');
    const keyboardEl = document.getElementById('keyboard');
    const resultModal = document.getElementById('result-modal');
    const resultWpmEl = document.getElementById('result-wpm');
    const resultAccuracyEl = document.getElementById('result-accuracy');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const countdownEl = document.getElementById('countdown');

    // Game Data & State
    let countdownTimer = null;
    const levelsData = [
        { "The Basics": "asdf jkl;", "Common Words": "asdfg hjkl;", "Getting Longer": "qwer yuio", "Tricky Letters": "zxcv m,./", "Punctuation Practice": "the quick brown fox" },
        { "The Basics": "jumps over the lazy dog", "Common Words": "pack my box with five dozen liquor jugs", "Getting Longer": "How quickly daft jumping zebras vex.", "Tricky Letters": "Mr. Jock, TV quiz PhD, bags few lynx.", "Punctuation Practice": "Sphinx of black quartz, judge my vow." },
        { "The Basics": "asdf asdf jkl; jkl;", "Common Words": "qaz wsx edc rfv", "Getting Longer": "the five boxing wizards jump quickly", "Tricky Letters": "Cwm fjord bank glyphs vext quiz.", "Punctuation Practice": "Jackdaws love my big sphinx of quartz." },
        { "The Basics": "tyui ghjk", "Common Words": "poiu lkjn", "Getting Longer": "Quick zephyrs blow, vexing daft Jim.", "Tricky Letters": "Waltz nymph for quick jigs vex Bud.", "Punctuation Practice": "Grumpy wizards make toxic brew for the evil queen." },
        { "The Basics": "asdf qwer", "Common Words": "yuio hjkl", "Getting Longer": "Two driven jocks help fax my big quiz.", "Tricky Letters": "Bright vixens jump; dozy fowl quack.", "Punctuation Practice": "The jay, pig, fox, zebra, and wolf quack!" },
        { "The Basics": "poiuy lkjh", "Common Words": "mnbv cxz.", "Getting Longer": "Foxy diva Jennifer gives back my quick waltz.", "Tricky Letters": "Blowzy night-frumps vex'd Jack Q.", "Punctuation Practice": "Fred’s quiz solved by lucky magic hand." },
        { "The Basics": "asdf asdf", "Common Words": "jkl; jkl;", "Getting Longer": "Jump dogs vex Fritz by quick whaling.", "Tricky Letters": "Quizzical twins proved my hijack-bug fix.", "Punctuation Practice": "Wow! Does Jack love my flying zebra quiz?" },
        { "The Basics": "zzzz xxxx", "Common Words": "cccc vvvv", "Getting Longer": "All questions asked by five watched experts.", "Tricky Letters": "Jumping foxes vex hard quiz wizard.", "Punctuation Practice": "Big jackdaws quickly blew over zephyr fog." },
        { "The Basics": "asdfg hjkl;", "Common Words": "qwert yuiop", "Getting Longer": "How vexingly quick daft zebras jump!", "Tricky Letters": "Fred’s job requires quick waltz, vexing nymph.", "Punctuation Practice": "Silly Jack’s quick quiz blew my mind!" },
        { "The Basics": "asdf ghjk", "Common Words": "qwer tyui", "Getting Longer": "Puzzling wizard John quickly vexed the frog.", "Tricky Letters": "Mr. Q and Jack love very big zyx waltz.", "Punctuation Practice": "“Quick!”, said Jack, “bring my zebra”." },
        { "The Basics": "asdfg zxcvb", "Common Words": "qwert hjkl;", "Getting Longer": "Jived fox nymph grabs quick waltz.", "Tricky Letters": "Fritz’s jaw quack vexed major block.", "Punctuation Practice": "Stop! Do you enjoy my big zebra quiz?" },
        { "The Basics": "tyuiu opop", "Common Words": "mnbvc asdf", "Getting Longer": "Jump quickly over water, big daft waltz.", "Tricky Letters": "Zyra Fox quickly vex’d John Q.", "Punctuation Practice": "I can’t believe Jack’s flying zebra!" },
        { "The Basics": "alal sasl", "Common Words": "didi kiki", "Getting Longer": "Quick jumpy frogs vex bad wizard Jill.", "Tricky Letters": "Gwyneth packs fjord qua zym blitz.", "Punctuation Practice": "What’s Jack’s quiz prize?—a zebra." },
        { "The Basics": "sdsd jkjk", "Common Words": "uiui koko", "Getting Longer": "Rowdy wizards vex quick javelin fox.", "Tricky Letters": "Jilted wizard quickly vex boards.", "Punctuation Practice": "“Jack’s?”, said Wolf, “quiz prize?”." },
        { "The Basics": "aaaa ssss", "Common Words": "dddd ffff", "Getting Longer": "Vexing waltzers jump quick bad frog.", "Tricky Letters": "Fix quizzed nymph juggling dark jowls.", "Punctuation Practice": "Jill’s crazy fox jumped over Jack’s wing." },
        { "The Basics": "lloo ppqq", "Common Words": "kkjj hhgg", "Getting Longer": "Bold quick wizard vexed jumping frog.", "Tricky Letters": "Zyx jumped vex squirrel quick frog.", "Punctuation Practice": "O’Jack quickly blew my zebra quiz." },
        { "The Basics": "zx zx zx", "Common Words": "cx cv cv", "Getting Longer": "Jack quickly vex frogs with waltz.", "Tricky Letters": "Mixed-up junk quickly vex’d wizard fox.", "Punctuation Practice": "“Stop!”, said Jill. Jack vex’d zebra." },
        { "The Basics": "asdf qaz wsx", "Common Words": "edc rfv tgb", "Getting Longer": "Jumping quick frogs vex bad wizard.", "Tricky Letters": "Foxy quiz wizard vex’d jumpy Jack.", "Punctuation Practice": "Hello, Jack! Do zebras quickly vex?" },
        { "The Basics": "qwer poi lkj", "Common Words": "zxc mnb hgf", "Getting Longer": "Vex frogs quickly in damp waltz.", "Tricky Letters": "Jack’s quiz vex’d big wizard fox.", "Punctuation Practice": "Fred’s job? Quick wizard loves zebra!" },
        { "The Basics": "asdf qwer zxcv", "Common Words": "tyui opkl mnbv", "Getting Longer": "Quick wizard vex’d frogs in jump.", "Tricky Letters": "Fritz quickly vexes job wizard Jack.", "Punctuation Practice": "Wow! Zebras quickly vex Jack’s quiz." },
        { "The Basics": "qaz wsx edc", "Common Words": "rfc vtg byh", "Getting Longer": "Jack quickly gave frogs wizard jolt", "Tricky Letters": "Zyra’s jump vex’d quick bold wizard.", "Punctuation Practice": "“Quick!”, cried Jill, “Jack vexed frogs?”." },
        { "The Basics": "zxc asdf qwer", "Common Words": "tyui hjkl mnop", "Getting Longer": "Jump quickly vex Fritz’s bold wizard dog.", "Tricky Letters": "Fjord nymph blitz vex quick Jack.", "Punctuation Practice": "Jack’s quiz prize—a flying zebra!" },
        { "The Basics": "mnb vcx zas qwe", "Common Words": "rty fgh vbn mko", "Getting Longer": "Bright wizard foxes quickly vex jumpy Jack.", "Tricky Letters": "Glyphs from fjord vex puzzling quiz Jack.", "Punctuation Practice": "“Wait—Jack’s fox quiz?”, Jill asked." },
        { "The Basics": "io io io io", "Common Words": "kl kl kl kl", "Getting Longer": "Vexed wizard quickly jumps bold frog.", "Tricky Letters": "Fix quiz job waltz gym nymph bard.", "Punctuation Practice": "Jack’s flying zebra: wow!!!" },
        { "The Basics": "asdf jkl; qaz wsx", "Common Words": "edc rfv tgb yhn", "Getting Longer": "Quickly vexed jocks jump frog wizard.", "Tricky Letters": "Bad nymph Jack vex’d quirky frog waltz.", "Punctuation Practice": "Hello? Jack’s zebra won quick quiz." },
        { "The Basics": "tyu ghj bn m,.", "Common Words": "qaz wsx rfv edc", "Getting Longer": "Waltzing wizards vex jumpy quick fox.", "Tricky Letters": "Fritz’s Jack quickly moved bold waltz.", "Punctuation Practice": "“Jack’s froggy quiz?”, asked Jill." },
        { "The Basics": "asdf gfdsa", "Common Words": "poiuy trewq", "Getting Longer": "Six big wizened jocks quickly vex frogs.", "Tricky Letters": "Jack, Fritz, and Quiz vex bold nymph.", "Punctuation Practice": "Jack’s fox—yes, the quiz winner!" },
        { "The Basics": "qaz xsw edc", "Common Words": "rfv tgb yhn", "Getting Longer": "Nymphs vex Fritz’s jumping Jack wizard.", "Tricky Letters": "Blitz fog vex’d quick jumping wizard fox.", "Punctuation Practice": "“Frogs?” cried Jill; “Quick Jack!”" },
        { "The Basics": "poi lkj mnb", "Common Words": "zxc asd qwe", "Getting Longer": "Quick big frog wizard vex’d jolt Jack.", "Tricky Letters": "Zyra’s quiz vex’d jumpy fox wizard.", "Punctuation Practice": "Jack’s quick frog flew! Amazing." },
        { "The Basics": "zas xdc rfv", "Common Words": "tgb yhn ujm", "Getting Longer": "Fritz vex’d quick wizard frog jumps.", "Tricky Letters": "Jack quickly vex’d frog nymph blitz.", "Punctuation Practice": "Jack—Quiz—Zebra! Vexed frog." },
        { "The Basics": "asdf hjkl qwer", "Common Words": "tyui opas dfg", "Getting Longer": "Bold frog vexes quick wizard jump.", "Tricky Letters": "Quick Jack zab nymph vex’d wizard.", "Punctuation Practice": "“Ho!”, cried Jack, “Zebra flew”." },
        { "The Basics": "wsx edc rfv tgb", "Common Words": "yhn ujm ik, ol.", "Getting Longer": "Jumpy Jack vex’d frogs with bold wizard.", "Tricky Letters": "Waltzing vex’d frog quickly joined quiz.", "Punctuation Practice": "Zebra quiz—Jack wins! Bravo." },
        { "The Basics": "qaz edc rfv", "Common Words": "wsx mlk poi", "Getting Longer": "Foxes quickly vex Jack’s bold wizard.", "Tricky Letters": "Fritz jam quickly vex’d frog nymphs.", "Punctuation Practice": "“Jack’s quiz?,” Jill smiled." },
        { "The Basics": "ooo ppp lll kkk", "Common Words": "xxx ccc vvv zzz", "Getting Longer": "Nymph frog vexed quick bold Jack waltz.", "Tricky Letters": "Quiz vex’d Jack’s froggy wizard blitz.", "Punctuation Practice": "Jack—quickly vex zebra quiz." },
        { "The Basics": "qaz wsx edc rfv", "Common Words": "tgb yhn ujm ik,", "Getting Longer": "Wizards vex quick jumpy frog jackals.", "Tricky Letters": "Fritz vex’d nymph Jack’s quick quiz.", "Punctuation Practice": "Jack yelled: “Frogs quizzed me”." },
        { "The Basics": "red blue green", "Common Words": "yellow black white", "Getting Longer": "Fast jumpers vex big crazy wizard.", "Tricky Letters": "Fritz jinx quack vex bold gym nymph.", "Punctuation Practice": "“Jack’s prize?”, Jill asked calmly." },
        { "The Basics": "1234 5678", "Common Words": "91011 121314 1516", "Getting Longer": "Bold wizard Fritz vex’d quick jump frog.", "Tricky Letters": "Nymph Jack froze quick vex’d quiz frog.", "Punctuation Practice": "Jack’s “quiz” prize—flying zebra." },
        { "The Basics": "asdfg hjkl;zxcv", "Common Words": "oiuyt rewq plmk", "Getting Longer": "Fritz’s nymph baffled quick vex job.", "Tricky Letters": "Waltz job nymph vex’d quiz Jack quick.", "Punctuation Practice": "Jack, Jill, and zebra—wow!!!" },
        { "The Basics": "a s d f g", "Common Words": "h j k l ;", "Getting Longer": "Quick jump frog vex bad wizard Fitz.", "Tricky Letters": "Fjord vex’d quiz Jack, nymph blow.", "Punctuation Practice": "Jack twirled—“frog quizzed me!”" },
        { "The Basics": "qaz wsx dce frv", "Common Words": "tgb yhn ujm ik,", "Getting Longer": "Quick Jacks vex’d frog with wizard job.", "Tricky Letters": "Nymph job Fritz vex quizzed bold Jack.", "Punctuation Practice": "“Ha!”, cried Jack, “Frog vexed zebra”." },
        { "The Basics": "asdf zxcv qwer", "Common Words": "tyui hjkl mnop", "Getting Longer": "Fritz quickly vex’d bold jumpy Jack", "Tricky Letters": "Nymph blitz quizzed quick frog wizard", "Punctuation Practice": "Jack shouted: “Quiz vex’d frog!”" },
        { "The Basics": "poiuy trewq", "Common Words": "mnbvc xzasd", "Getting Longer": "Jumpy wizard vexed quick frog nymphs", "Tricky Letters": "Fritz Jack quiz vex’d bold wizard", "Punctuation Practice": "“Vex frogs?”, Jill asked Jack." },
        { "The Basics": "dfgh jkl; qwer", "Common Words": "tyui aszx cvbn", "Getting Longer": "Quick frog vexed big wild wizard", "Tricky Letters": "Blitz job quizzed Jack’s nymph vex", "Punctuation Practice": "Jack yelled, “Fritz’s quiz vex’d!”" },
        { "The Basics": "red blue yellow", "Common Words": "green white black", "Getting Longer": "Quick jumpy wizard vexes bold fox", "Tricky Letters": "Fritz quizzed nymph vex Jack’s job", "Punctuation Practice": "Jack’s job? Quizzing frogs—amazing." },
        { "The Basics": "1234 5678 91011", "Common Words": "121314 151617 1819", "Getting Longer": "Quickly vex’d wizard jumps bold frog", "Tricky Letters": "Jack’s nymph Fritz vex quiz job", "Punctuation Practice": "“Job vex?”, cried Jack." },
        { "The Basics": "asdfg hjkl; zxcvb", "Common Words": "poiuytrewq", "Getting Longer": "Fritz vexed Jack’s bold quick wizard job", "Tricky Letters": "Zyra’s quiz vex’d froggy nymph", "Punctuation Practice": "Jack’s quick job—frog quiz!" },
        { "The Basics": "wsx edc rfv tgb", "Common Words": "yhn ujm ik, ol.", "Getting Longer": "Waltzing Jack vexed frog with job quiz", "Tricky Letters": "Bold Fritz quizzed nymph vex Jack", "Punctuation Practice": "“Frog?”, Jill laughed, “Quiz Jack”." },
        { "The Basics": "qaz wsx edc rfv tgb", "Common Words": "yhn ujm ik, olp", "Getting Longer": "Quick frog vex wizard jump with zest", "Tricky Letters": "Jack’s quizzed frog vex nymph bold", "Punctuation Practice": "Jack shouted—“Frog vex’d quiz!”" },
        { "The Basics": "asd sdf dfg fgh", "Common Words": "hjk jkl kl;", "Getting Longer": "Jumpy Fritz vex’d wizard job bold frog", "Tricky Letters": "Nymph Jack quizzed frog vex job", "Punctuation Practice": "Jack’s bold quiz?—frogs vexed." },
        { "The Basics": "zxc vbn m,./", "Common Words": "qwe rty uio p[]", "Getting Longer": "Quick wizard vex’d Jack’s big frog jump", "Tricky Letters": "Bold Fritz job vex nymph quiz Jack", "Punctuation Practice": "“Stop!”, cried Jack, “Frog quiz vex!”" },
        { "The Basics": "asdf jkl; qaz wsx edc", "Common Words": "rfv tgb yhn ujm ik", "Getting Longer": "Fritz vex’d quick wizard with jungle frogs", "Tricky Letters": "Jack’s quiz vex bold frog job wizard", "Punctuation Practice": "Hello Jack! Did frog vex quiz?" },
        { "The Basics": "qwer tyui opas dfg", "Common Words": "hjkl mnbv cxz", "Getting Longer": "Quick frog vex wizard jumpy blitz job", "Tricky Letters": "Nymph Fritz’s quiz vex Jack bold", "Punctuation Practice": "Jack—Fritz—quiz—frog! Amazing." },
        { "The Basics": "1111 2222 3333", "Common Words": "4444 5555 6666", "Getting Longer": "Frogs vexed Jack’s quick wizard job", "Tricky Letters": "Quiz vex Fritz nymph bold Jack frog", "Punctuation Practice": "Jack quizzed: “Frogs vex boldly?”" },
        { "The Basics": "qwe asd zxc", "Common Words": "rty fgh vbn", "Getting Longer": "Quick wizard vex’d job with frog quiz", "Tricky Letters": "Nymph blitz vex bold Jack’s frog quiz", "Punctuation Practice": "“Wow!”, shouted Jill, “Jack vexed frog”." },
        { "The Basics": "asdfg hjkl; qwert", "Common Words": "yuiop zxcvb", "Getting Longer": "Fritz’s quick job vex’d bold jumpy frog", "Tricky Letters": "Jack’s frog vexed nymph wizard blitz", "Punctuation Practice": "Jack yelled: “Quiz? Frog’s vex”." },
        { "The Basics": "poiuy lkjh mnbv", "Common Words": "cxz zaq wsx edc", "Getting Longer": "Wizard job vex’d Jack with quick frogs", "Tricky Letters": "Nymph Fritz vex quiz Jack’s bold frog", "Punctuation Practice": "Jack’s quiz frogs—big vex today!" },
        { "The Basics": "asdf asdf qwer qwer", "Common Words": "zxcv hjkl hjkl", "Getting Longer": "Quick Jack vexed frogs with blitz job", "Tricky Letters": "Fritz job vex bold wizard frog quick", "Punctuation Practice": "“Jack?”, Jill shouted, “Quiz frog?”" },
        { "The Basics": "asa sas lkl jkj", "Common Words": "uiui oioi popi", "Getting Longer": "Frogs vex quick Jack’s bold wizard", "Tricky Letters": "Blitz nymph fred job vex quick Jack", "Punctuation Practice": "Jack asked: “Did frogs vex quiz?”" },
        { "The Basics": "zxcv asdf hjkl", "Common Words": "qwer tyui opop", "Getting Longer": "Quick wizard frog vex’d Fritz’s job", "Tricky Letters": "Jack’s nymph bold vex frog quiz", "Punctuation Practice": "Frogs vex Jack? Quiz bold." },
        { "The Basics": "qaz wsx edc rfv tgb", "Common Words": "yhn ujm ik olp", "Getting Longer": "Fritz quickly gave bold Jack a frog quiz", "Tricky Letters": "Nymph frogs vex’d bold Jack’s wizard quiz", "Punctuation Practice": "Jack exclaimed, “Frogs vex me now!”" },
        { "The Basics": "asdf jkl; qaz wsx edc", "Common Words": "rfv tgb yhn ujm ik", "Getting Longer": "Jumping frogs vex quick wizard boldly", "Tricky Letters": "Jack quizzed bold nymph with vex’d frog", "Punctuation Practice": "Jack’s quick frogs—vex bold Jill!" },
        { "The Basics": "qwert asdfg zxcvb", "Common Words": "yuio hjkl mno", "Getting Longer": "Quick wizard frogs vex bold Fritz Jack", "Tricky Letters": "Nymph vex’d Jack’s job with quick quiz", "Punctuation Practice": "Jack said: “Frogs quickly vexed me”." },
        { "The Basics": "poiu yt re wq as", "Common Words": "dfg hjk lmn", "Getting Longer": "Fritz jumped quickly, vexing bold wizard frog", "Tricky Letters": "Jack’s bold quiz vex’d frog job nymph", "Punctuation Practice": "“Vex job?”, Jill asked Jack quizzically." },
        { "The Basics": "aaa sss ddd fff", "Common Words": "ggg hhh jjj kkk", "Getting Longer": "Frogs vex fast Jack with quiz jobs", "Tricky Letters": "Nymph quizzed Jack’s bold frog vex job", "Punctuation Practice": "Jack wrote: “Frogs vex quiz fast!”" },
        { "The Basics": "qaz wsx edc rfv tgb yhn", "Common Words": "ujm ik ol p", "Getting Longer": "Bold wizard quickly vexed Jack’s froggy job", "Tricky Letters": "Fritz nymph vex bold Jack quiz jump", "Punctuation Practice": "Jack’s frog quiz—amazing! Bold vex." },
        { "The Basics": "mnb vcx zas xdc", "Common Words": "rfv tgb yhn ujm", "Getting Longer": "Frog wizard vex’d Jack with jumpy job", "Tricky Letters": "Nymph Fritz bold quiz vex Jack frogs", "Punctuation Practice": "Jack shouted: “Nymph frogs vex boldly”." },
        { "The Basics": "zxc asd qwe rty", "Common Words": "uio pkl mnb vcc", "Getting Longer": "Jumpy frogs vex Jack’s bold quick wizard", "Tricky Letters": "Bold quizzed frog vex Jack’s Fritz job", "Punctuation Practice": "Jack said, “Quiz vex frogs quick.”" },
        { "The Basics": "asdf hjkl qwerty", "Common Words": "zxcvb mnop", "Getting Longer": "Vex frogs bold Jack’s quiz quick wizard", "Tricky Letters": "Fritz’s job vex bold frog nymph quick", "Punctuation Practice": "“Frogs?”, Jill asked. Jack vex quickly." },
        { "The Basics": "111 222 333 444", "Common Words": "555 666 777", "Getting Longer": "Bold Jack vex quick frog wizard job", "Tricky Letters": "Nymph vexed Fritz with job quiz frog", "Punctuation Practice": "Jack laughed: “Frogs vex quick”." },
        { "The Basics": "poi lkj asd zxc", "Common Words": "qwe rty uio", "Getting Longer": "Quick frogs vex bold Jack wizard fast", "Tricky Letters": "Jack’s Fritz quizzed bold frog vex", "Punctuation Practice": "Jack’s frog quiz—fast bold vexed." },
        { "The Basics": "qaz wsx edc rfv tgb", "Common Words": "yhn ujm ik olp", "Getting Longer": "Jumpers vexed Jack’s bold frog quick quiz", "Tricky Letters": "Fritz nymph quick job vex bold Jack", "Punctuation Practice": "Jack exclaimed: “Quiz frog vex’d!”" },
        { "The Basics": "tyui opas dfgh", "Common Words": "jklz xcvb mnb", "Getting Longer": "Quick frogs vex Jack’s job boldly fast", "Tricky Letters": "Nymph Fritz blitzed quick quiz, vex Jack", "Punctuation Practice": "“Wow!”, cried Jill, “Jack’s frog vexed”." },
        { "The Basics": "aaa ddd fff jjj", "Common Words": "kkk lll zzz", "Getting Longer": "Frogs quickly vex Jack bold wizard job", "Tricky Letters": "Fritz nymph big quick quiz vexed Jack", "Punctuation Practice": "Jack whispered: “frogs vex boldly”." },
        { "The Basics": "qwert hjkl asdf", "Common Words": "zxcv nmop", "Getting Longer": "Jumpy Jack vex’d bold frogs quickly", "Tricky Letters": "Fritz quiz vex bold job nymph Jack", "Punctuation Practice": "Jack said—“Frogs vex wizard job”." },
        { "The Basics": "poiuy qwerty asdfg", "Common Words": "zxcvb hjkl", "Getting Longer": "Bold quick frog vex’d Jack’s wizard job", "Tricky Letters": "Jack’s quizzed frog vex Fritz bold nymph", "Punctuation Practice": "“Zebra frogs?”, Jill laughed at Jack." },
        { "The Basics": "mnbv cxza sdfg", "Common Words": "hjkl qwer", "Getting Longer": "Fritz’s wizard frog vex Jack big bold", "Tricky Letters": "Nymph job vexed quick frog wizard Jack", "Punctuation Practice": "Jack shouted: “Frog vex wizard!”" },
        { "The Basics": "qaz wsx rfv edc", "Common Words": "tgb yhn ujm", "Getting Longer": "Frogs jumped boldly, vex quick Jack", "Tricky Letters": "Fritz nymph quizzed frog vex bold Jack", "Punctuation Practice": "Jack announced: “Bold frogs vex”." },
        { "The Basics": "asa sds dfd fgf", "Common Words": "hgh jhj kjk", "Getting Longer": "Jumpy wizard frogs vex Jack’s quiz", "Tricky Letters": "Quick nymph Fritz vex job frog Jack", "Punctuation Practice": "Jack wondered: “Did frog quiz vex?”" },
        { "The Basics": "zxc hjk qwe rty", "Common Words": "uio plm nas", "Getting Longer": "Fritz’s frog vex Jack’s quick wizard job", "Tricky Letters": "Nymph quizzed bold frog job vex Jack", "Punctuation Practice": "Jack shouted loudly: “Frogs vexed me!”" },
        { "The Basics": "asdf vbnm qwer tyui", "Common Words": "zxcv hjkl opas", "Getting Longer": "Quick bold wizard frog vex’d Jack’s job", "Tricky Letters": "Nymph Fritz blitzed quick Jack frog vex", "Punctuation Practice": "“Jack’s frog quiz?”, Jill asked." },
        { "The Basics": "qaz wsx edc rfv tgb yhn ujm", "Common Words": "ik olp ;' mnbv cxz", "Getting Longer": "Frogs quickly vex bold Jack’s wizard quiz", "Tricky Letters": "Nymph Fritz blitz quiz vex job Jack", "Punctuation Practice": "Jack yelled: “Quick frog vex!”" },
        { "The Basics": "asdf jkl; uiop qwer", "Common Words": "zxcv nm hjkl", "Getting Longer": "Jumpy frog vex’d quick Jack bold wizard", "Tricky Letters": "Fritz quizzed frog nymph vex’s Jack", "Punctuation Practice": "Jack asked Jill: “Did quiz vex frog?”" },
        { "The Basics": "poiuy trewq asdfg", "Common Words": "hjkl zxcvb", "Getting Longer": "Quick Jack vex’d frogs with bold wizard job", "Tricky Letters": "Nymph Fritz bold quiz vex job Jack", "Punctuation Practice": "Jack muttered: “Frog quiz vexed boldly”." },
        { "The Basics": "mnb vcx zas xdc rfv", "Common Words": "tgb yhn ujm ik", "Getting Longer": "Fritz frog quiz vex’d Jack’s bold wizard", "Tricky Letters": "Quizzed Jack’s frog vex bold nymph job", "Punctuation Practice": "Jack exclaimed, “Frogs boldly vex!”" },
        { "The Basics": "qwer tyui opas dfgh", "Common Words": "jklz xcvb nm", "Getting Longer": "Bold frog wizards vex Jack’s quick job", "Tricky Letters": "Fritz quiz vex frogs bold nymph Jack", "Punctuation Practice": "Jack’s frog quiz—bold! Amazing." },
        { "The Basics": "111 222 333 444 555", "Common Words": "666 777 888 999", "Getting Longer": "Jack quickly vex’d jobs with bold frog wizard", "Tricky Letters": "Nymph quizzed frog Jack vex bold Fritz", "Punctuation Practice": "Jill asked Jack: “Quiz frog vex?”" },
        { "The Basics": "qaz wsx edc rfv tgb", "Common Words": "yhn ujm ik olp", "Getting Longer": "Frogs vexed Jack’s wizard bold quick quiz", "Tricky Letters": "Fritz nymph Jack quick frog vex quiz", "Punctuation Practice": "Jack’s frog yelled: “Vex job!”" },
        { "The Basics": "poi lkj mnb qaz wsx", "Common Words": "edc rfv tgb yhn", "Getting Longer": "Bold Jack vex’d quick frog wizard job", "Tricky Letters": "Fritz’s job vex bold quiz frog nymph", "Punctuation Practice": "Jack screamed—“Quick frog vex me”." },
        { "The Basics": "asa sas dad faf", "Common Words": "gag hah jaj kak", "Getting Longer": "Frogs vexed Jack boldly with wizard quiz", "Tricky Letters": "Nymph Fritz bold frog quizzed Jack’s job", "Punctuation Practice": "Jack whispered: “quiz vex frog boldly”." },
        { "The Basics": "qaz wsx dce rfv tgb yhn", "Common Words": "ujm ik olp mn bvg", "Getting Longer": "Jack’s bold frog vex quick wizard nymph", "Tricky Letters": "Fritz quizzed frog Jack’s job vex", "Punctuation Practice": "“Frogs vex boldly!”, Jack exclaimed." },
        { "The Basics": "asdf hjkl qwert zxcv", "Common Words": "tyui opas dfgh", "Getting Longer": "Quick job vex bold frog wizard Jack", "Tricky Letters": "Nymph Fritz Jack’s quiz vex bold frog", "Punctuation Practice": "Jack told Jill: “Bold frogs vex quiz”." },
        { "The Basics": "mnb vcx zas xdc rfv tgb", "Common Words": "yhn ujm ik olp qaz", "Getting Longer": "Fritz frog wizard vex’d bold Jack quickly", "Tricky Letters": "Jack’s quiz vex nymph frog bold Fritz", "Punctuation Practice": "Jack sighed: “Frog vex quiz quickly”." },
        { "The Basics": "ooo uuu iii yyy", "Common Words": "ppp lll kkk jjj", "Getting Longer": "Bold Jack vex’d wizard frog quiz fast", "Tricky Letters": "Quiz nymph frog vex’d Jack Fritz bold", "Punctuation Practice": "“Quiz frog Jack?” Jill smiled." },
        { "The Basics": "qaz wsx plu ikj", "Common Words": "mnb vfr cde xza", "Getting Longer": "Quick wizard frogs vex’d Jack’s bold job", "Tricky Letters": "Nymph quizzed frog bold vex Jack’s Fritz", "Punctuation Practice": "Jack typed: “Frogs vex quiz bold”." },
        { "The Basics": "asdfg hjkl; qwerty", "Common Words": "zxcvb nm poiuy", "Getting Longer": "Frogs quickly vex big Jack wizard job", "Tricky Letters": "Fritz nymph quiz frog bold vex Jack", "Punctuation Practice": "“Jack’s frogs vex?”, Jill queried." },
        { "The Basics": "qaz wsx edc rfv tgb yhn", "Common Words": "ujm ik olp adr", "Getting Longer": "Quick frogs boldly vex Jack’s wizard job", "Tricky Letters": "Jack’s nymph quizzed frog vex Fritz bold", "Punctuation Practice": "Jack laughed: “Frog quiz boldly vex”." },
        { "The Basics": "1111 2222 3333 4444", "Common Words": "5555 6666 7777 8888", "Getting Longer": "Bold frog vex Jack quickly with wizard quiz", "Tricky Letters": "Job Fritz nymph bold quizzed Jack’s frog", "Punctuation Practice": "Jack declared: “Frogs vex’d quickly”." },
        { "The Basics": "qwer asdf zxcv hjkl", "Common Words": "tyui opas nm bvc", "Getting Longer": "Quick bold wizard frog vex Jack nymph job", "Tricky Letters": "Fritz quizzed frog Jack’s bold vex nymph", "Punctuation Practice": "“Quick Jack frog quiz?”, Jill winked." },
        { "The Basics": "poiu qwer asdf hjkl", "Common Words": "zxcv nm tyui opas", "Getting Longer": "Frogs vex’d bold Jack’s wizard quiz quickly", "Tricky Letters": "Nymph quizzed Jack’s frog bold vex Fritz", "Punctuation Practice": "Jack wrote again: “Bold frog quiz”." },
        { "The Basics": "asdf jkl; qaz wsx edc rfv", "Common Words": "tgb yhn ujm ik olp", "Getting Longer": "Jack’s bold wizard frog vex quiz quickly", "Tricky Letters": "Fritz nymph quizzed bold frog Jack vex", "Punctuation Practice": "Jack exclaimed loudly: “Quiz frog vex final!”" }
    ];

    const keyboardLayout = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
        ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
        [' ', ' ', ' ', 'Space', ' ', ' ', ' ']
    ];

    const fingerMapping = {
        '`': { hand: 'left', finger: 'pinky' }, '1': { hand: 'left', finger: 'pinky' }, 'q': { hand: 'left', finger: 'pinky' }, 'a': { hand: 'left', finger: 'pinky' }, 'z': { hand: 'left', finger: 'pinky' },
        '~': { hand: 'left', finger: 'pinky' }, '!': { hand: 'left', finger: 'pinky' }, 'Q': { hand: 'left', finger: 'pinky' }, 'A': { hand: 'left', finger: 'pinky' }, 'Z': { hand: 'left', finger: 'pinky' },
        '2': { hand: 'left', finger: 'ring' }, 'w': { hand: 'left', finger: 'ring' }, 's': { hand: 'left', finger: 'ring' }, 'x': { hand: 'left', finger: 'ring' },
        '@': { hand: 'left', finger: 'ring' }, 'W': { hand: 'left', finger: 'ring' }, 'S': { hand: 'left', finger: 'ring' }, 'X': { hand: 'left', finger: 'ring' },
        '3': { hand: 'left', finger: 'middle' }, 'e': { hand: 'left', finger: 'middle' }, 'd': { hand: 'left', finger: 'middle' }, 'c': { hand: 'left', finger: 'middle' },
        '#': { hand: 'left', finger: 'middle' }, 'E': { hand: 'left', finger: 'middle' }, 'D': { hand: 'left', finger: 'middle' }, 'C': { hand: 'left', finger: 'middle' },
        '4': { hand: 'left', finger: 'index' }, 'r': { hand: 'left', finger: 'index' }, 'f': { hand: 'left', finger: 'index' }, 'v': { hand: 'left', finger: 'index' },
        '$': { hand: 'left', finger: 'index' }, 'R': { hand: 'left', finger: 'index' }, 'F': { hand: 'left', finger: 'index' }, 'V': { hand: 'left', finger: 'index' },
        '5': { hand: 'left', finger: 'index' }, 't': { hand: 'left', finger: 'index' }, 'g': { hand: 'left', finger: 'index' }, 'b': { hand: 'left', finger: 'index' },
        '%': { hand: 'left', finger: 'index' }, 'T': { hand: 'left', finger: 'index' }, 'G': { hand: 'left', finger: 'index' }, 'B': { hand: 'left', finger: 'index' },
        '6': { hand: 'right', finger: 'index' }, 'y': { hand: 'right', finger: 'index' }, 'h': { hand: 'right', finger: 'index' }, 'n': { hand: 'right', finger: 'index' },
        '^': { hand: 'right', finger: 'index' }, 'Y': { hand: 'right', finger: 'index' }, 'H': { hand: 'right', finger: 'index' }, 'N': { hand: 'right', finger: 'index' },
        '7': { hand: 'right', finger: 'index' }, 'u': { hand: 'right', finger: 'index' }, 'j': { hand: 'right', finger: 'index' }, 'm': { hand: 'right', finger: 'index' },
        '&': { hand: 'right', finger: 'index' }, 'U': { hand: 'right', finger: 'index' }, 'J': { hand: 'right', finger: 'index' }, 'M': { hand: 'right', finger: 'index' },
        '8': { hand: 'right', finger: 'middle' }, 'i': { hand: 'right', finger: 'middle' }, 'k': { hand: 'right', finger: 'middle' }, ',': { hand: 'right', finger: 'middle' },
        '*': { hand: 'right', finger: 'middle' }, 'I': { hand: 'right', finger: 'middle' }, 'K': { hand: 'right', finger: 'middle' }, '<': { hand: 'right', finger: 'middle' },
        '9': { hand: 'right', finger: 'ring' }, 'o': { hand: 'right', finger: 'ring' }, 'l': { hand: 'right', finger: 'ring' }, '.': { hand: 'right', finger: 'ring' },
        '(': { hand: 'right', finger: 'ring' }, 'O': { hand: 'right', finger: 'ring' }, 'L': { hand: 'right', finger: 'ring' }, '>': { hand: 'right', finger: 'ring' },
        '0': { hand: 'right', finger: 'pinky' }, 'p': { hand: 'right', finger: 'pinky' }, ';': { hand: 'right', finger: 'pinky' }, '/': { hand: 'right', finger: 'pinky' },
        ')': { hand: 'right', finger: 'pinky' }, 'P': { hand: 'right', finger: 'pinky' }, ':': { hand: 'right', finger: 'pinky' }, '?': { hand: 'right', finger: 'pinky' },
        '-': { hand: 'right', finger: 'pinky' }, '[': { hand: 'right', finger: 'pinky' }, "'": { hand: 'right', finger: 'pinky' },
        '_': { hand: 'right', finger: 'pinky' }, '{': { hand: 'right', finger: 'pinky' }, '"': { hand: 'right', finger: 'pinky' },
        '=': { hand: 'right', finger: 'pinky' }, ']': { hand: 'right', finger: 'pinky' }, '\\': { hand: 'right', finger: 'pinky' },
        '+': { hand: 'right', finger: 'pinky' }, '}': { hand: 'right', finger: 'pinky' }, '|': { hand: 'right', finger: 'pinky' },
        ' ': { hand: 'right', finger: 'thumb' }
    };

    let state = {
        currentLevel: 0,
        currentCategory: 'The Basics',
        text: '',
        spans: null,
        timer: null,
        time: 60,
        typedIndex: 0,
        mistakes: 0,
        totalTyped: 0,
        isTyping: false,
        startTime: null
    };

    function init() {
        createKeyboard();
        populateLevels();
        populateCategories(0);
        loadChallenge(0, Object.keys(levelsData[0])[0]); // Load Level 1, first category

        levelSelector.addEventListener('change', (e) => {
            const levelIndex = parseInt(e.target.value);
            populateCategories(levelIndex);
            const firstCategory = Object.keys(levelsData[levelIndex])[0];
            loadChallenge(levelIndex, firstCategory);
        });

        categorySelector.addEventListener('change', (e) => {
            const levelIndex = parseInt(levelSelector.value);
            const categoryName = e.target.value;
            loadChallenge(levelIndex, categoryName);
        });

        nextLevelBtn.addEventListener('click', () => {
            if (countdownTimer) clearInterval(countdownTimer);
            loadNextChallenge();
        });

        document.body.addEventListener('click', (e) => {
            console.log('[DEBUG] Body clicked. Target:', e.target);
            // If the click is inside the header or modal, don't hijack it.
            if (e.target.closest('header') || e.target.closest('.modal-container')) {
                console.log('[DEBUG] Click ignored, inside UI element.');
                return;
            }
            console.log('[DEBUG] Focusing input field.');
            inputField.focus();
        });
    }

    function loadNextChallenge() {
        resultModal.style.display = 'none';
        let currentLevelIndex = state.currentLevel;
        let currentCategoryName = state.currentCategory;

        const categories = Object.keys(levelsData[currentLevelIndex]);
        const currentCategoryIndex = categories.indexOf(currentCategoryName);

        if (currentCategoryIndex < categories.length - 1) {
            // Go to next category in the same level
            const nextCategoryName = categories[currentCategoryIndex + 1];
            loadChallenge(currentLevelIndex, nextCategoryName);
        } else {
            // Go to the first category of the next level
            const nextLevelIndex = currentLevelIndex + 1 < levelsData.length ? currentLevelIndex + 1 : 0; // Loop back to level 1
            const nextCategoryName = Object.keys(levelsData[nextLevelIndex])[0];
            populateCategories(nextLevelIndex);
            loadChallenge(nextLevelIndex, nextCategoryName);
        }
    }

    function loadChallenge(levelIndex, categoryName) {
        if (state.timer) clearInterval(state.timer);
        if (countdownTimer) clearInterval(countdownTimer);

        state.currentLevel = levelIndex;
        state.currentCategory = categoryName;
        state.text = levelsData[levelIndex][categoryName];
        state.spans = null;
        state.timer = null;
        state.time = 60;
        state.typedIndex = 0;
        state.mistakes = 0;
        state.totalTyped = 0;
        state.isTyping = false;
        state.startTime = null;

        levelSelector.value = state.currentLevel;
        categorySelector.value = state.currentCategory;

        textToTypeEl.innerHTML = '';
        state.text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            textToTypeEl.appendChild(span);
        });
        state.spans = textToTypeEl.children;

        resetGame();
    }

    function handleKeyDown(e) {
        console.log('[DEBUG] handleKeyDown fired. Key:', e.key);
        e.preventDefault();
        const { key } = e;

        if (!state.isTyping && key.length === 1) {
            state.isTyping = true;
            state.startTime = new Date();
            startTimer();
        }

        if (key === 'Backspace') {
            if (state.typedIndex > 0) {
                state.typedIndex--;
                const span = state.spans[state.typedIndex];
                if (span.classList.contains('incorrect')) {
                    state.mistakes--;
                }
                span.classList.remove('correct', 'incorrect');
                updateHighlights();
            }
        } else if (key.length === 1 && state.typedIndex < state.text.length) {
            const targetChar = state.text[state.typedIndex];
            const currentSpan = state.spans[state.typedIndex];

            if (key === targetChar) {
                currentSpan.classList.add('correct');
            } else {
                currentSpan.classList.add('incorrect');
                state.mistakes++;
            }
            state.typedIndex++;
            state.totalTyped++;
            updateHighlights();
        }

        updateStats();

        if (state.typedIndex === state.text.length) {
            endGame();
        }
    }

    function startTimer() {
        state.time = 60;
        timeEl.textContent = state.time;
        state.timer = setInterval(() => {
            state.time--;
            timeEl.textContent = state.time;
            if (state.time <= 0) {
                endGame();
            }
            updateStats();
        }, 1000);
    }

    function resetGame() {
        inputField.value = '';
        timeEl.textContent = state.time;
        wpmEl.textContent = 0;
        accuracyEl.textContent = '100%';
        resultModal.style.display = 'none';
        updateHighlights();
        inputField.focus();
    }

    function endGame() {
        clearInterval(state.timer);
        state.isTyping = false;
        const finalWPM = calculateWPM();
        const finalAccuracy = calculateAccuracy();

        resultWpmEl.textContent = finalWPM;
        resultAccuracyEl.textContent = `${finalAccuracy}%`;
        resultModal.style.display = 'flex';

        let countdownValue = 5;
        countdownEl.textContent = countdownValue;

        countdownTimer = setInterval(() => {
            countdownValue--;
            countdownEl.textContent = countdownValue;
            if (countdownValue === 0) {
                clearInterval(countdownTimer);
                loadNextChallenge();
            }
        }, 1000);
    }

    function updateStats() {
        if (state.isTyping) {
            wpmEl.textContent = calculateWPM();
            accuracyEl.textContent = `${calculateAccuracy()}%`;
        }
    }

    function calculateWPM() {
        const grossTyped = state.typedIndex;
        const netTyped = grossTyped - state.mistakes;
        const minutes = (new Date() - state.startTime) / 60000;
        return minutes > 0 ? Math.round((netTyped / 5) / minutes) : 0;
    }

    function calculateAccuracy() {
        return state.totalTyped > 0 ? Math.round(((state.totalTyped - state.mistakes) / state.totalTyped) * 100) : 100;
    }

    function updateHighlights() {
        document.querySelectorAll('.current').forEach(el => el.classList.remove('current'));
        if (state.typedIndex < state.text.length) {
            state.spans[state.typedIndex].classList.add('current');
        }
        const nextChar = state.typedIndex < state.text.length ? state.text[state.typedIndex] : null;
        highlightKey(nextChar);
    }

    function highlightKey(char) {
        document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
        if (char) {
            const keyEl = document.querySelector(`.key[data-key="${char.toLowerCase() === ' ' ? 'space' : char.toLowerCase()}"]`);
            if (keyEl) {
                keyEl.classList.add('active');
            }
        }
    }

    function createKeyboard() {
        keyboardEl.innerHTML = '';
        keyboardLayout.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.classList.add('keyboard-row');
            row.forEach(key => {
                const keyEl = document.createElement('div');
                keyEl.classList.add('key');
                const dataKey = key.toLowerCase();
                keyEl.setAttribute('data-key', dataKey);
                const fingerInfo = fingerMapping[key] || fingerMapping[key.toLowerCase()];
                const hintText = fingerInfo ? fingerInfo.finger : '';
                keyEl.innerHTML = `<span class="key-char">${key}</span><span class="finger-hint">${hintText}</span>`;
                if (dataKey === 'space') keyEl.classList.add('space');
                if (key.length > 1 && key !== ' ') keyEl.style.flexGrow = '1.5';
                rowEl.appendChild(keyEl);
            });
            keyboardEl.appendChild(rowEl);
        });
    }

    function populateLevels() {
        levelSelector.innerHTML = '';
        levelsData.forEach((_, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Level ${index + 1}`;
            levelSelector.appendChild(option);
        });
    }

    function populateCategories(levelIndex) {
        categorySelector.innerHTML = '';
        const categories = Object.keys(levelsData[levelIndex]);
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelector.appendChild(option);
        });
    }

    init();
});
