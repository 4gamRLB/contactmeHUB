import { FAQItem } from '../types';

export const FAQ_DATA: FAQItem[] = [
  // QUICK FIXES
  {
    id: 'force-reload',
    category: 'quick-fixes',
    question: 'How do I do a "force reload" to fix blank pages or displays?',
    answer: 'This is the #1 fix for most display problems, blank screens, or buttons that refuse to respond. It tells your browser to ignore its saved files and download a completely fresh copy of the app.\n\n* **On Windows:** Press `Ctrl` + `Shift` + `R` (or `Ctrl` + `F5`)\n* **On Mac:** Press `Cmd` + `Shift` + `R` (or hold `Shift` and click the refresh button)\n* **On Mobile (iPhone/Android):** Swipe down on the page, or close your browser tab entirely and re-open the link in a new tab.',
    keywords: ['force', 'reload', 'refresh', 'page', 'update', 'cache', 'blank', 'screen', 'frozen', 'stuck']
  },
  {
    id: 'incognito-mode',
    category: 'quick-fixes',
    question: 'How do I try private or "Incognito" mode?',
    answer: 'Sometimes browser add-ons (like ad-blockers, tracking blockers, or password managers) accidentally block parts of the app. Opening the app in a private tab temporarily disables those add-ons so we can see if they are the issue.\n\n* **Chrome:** Click the three dots at the top right → select **New Incognito Window** (or press `Ctrl` + `Shift` + `N` / `Cmd` + `Shift` + `N`)\n* **Firefox:** Click the menu lines → select **New Private Window** (or press `Ctrl` + `Shift` + `P`)\n* **Safari (Mac):** Click **File** at the top → select **New Private Window**\n\nIf the app works perfectly in Private mode, one of your browser add-ons is likely causing the problem!',
    keywords: ['incognito', 'private', 'mode', 'extensions', 'ad', 'blocker', 'add-on', 'browser']
  },
  {
    id: 'clear-cache',
    category: 'quick-fixes',
    question: 'How do I clear my browser cache?',
    answer: 'If force-reloading didn\'t help, a thorough browser clean usually does the trick. Please note: doing this might sign you out of other sites and may clear locally saved app data, so save your work first!\n\n* **Chrome / Edge / Firefox:** Press `Ctrl` + `Shift` + `Delete` (Windows) or `Cmd` + `Shift` + `Delete` (Mac) to open the cleanup panel. Choose "Cached images and files" and click **Clear Data**.\n* **Safari (Mac):** Go to Safari menu → **Settings** → **Privacy** → **Manage Website Data** → click **Remove All**.',
    keywords: ['clear', 'cache', 'cookies', 'storage', 'reset', 'browser', 'data', 'clean']
  },
  {
    id: 'try-another-browser',
    category: 'quick-fixes',
    question: 'What browsers work best with these apps?',
    answer: 'Most modern web browsers work perfectly, but some handle apps better than others. If you are experiencing unexpected behavior, we highly recommend trying the app in:\n\n1. **Google Chrome** (usually has the absolute best compatibility for interactive forms and features)\n2. **Apple Safari** (best on iPhones, iPads, and Macs)\n3. **Mozilla Firefox**\n4. **Microsoft Edge**\n\nIf the app works in one browser but not another, please report it! That helps us fix it for everyone.',
    keywords: ['different', 'browser', 'chrome', 'firefox', 'safari', 'edge', 'try', 'another', 'explorer', 'compatible']
  },

  // COMMON APP PROBLEMS
  {
    id: 'unresponsive-buttons',
    category: 'app-issues',
    question: 'Buttons aren\'t responding when I click them. What should I do?',
    answer: 'This is usually caused by a frozen background script or a blocker. Try these simple checks:\n\n1. **Try Private/Incognito Mode:** (See our guide above) to ensure an ad blocker isn\'t stopping the app.\n2. **Double check required fields:** Make sure you haven\'t missed any fields with red asterisks (*). The button won\'t send until those are complete.\n3. **Quick refresh:** Press `Ctrl` + `Shift` + `R` (Windows) or `Cmd` + `Shift` + `R` (Mac) to reset the app safely.',
    keywords: ['buttons', 'not', 'working', 'clicking', 'nothing', 'happens', 'unresponsive', 'stuck', 'frozen']
  },
  {
    id: 'blank-page',
    category: 'app-issues',
    question: 'The app won\'t load — it is just a blank white screen or loading spinner',
    answer: 'If the app seems stuck loading:\n\n1. **Check your internet connection:** Try loading a different website (like Google) to make sure you are online.\n2. **Do a Force-Reload:** Press `Ctrl` + `Shift` + `R` (Windows) or `Cmd` + `Shift` + `R` (Mac) to fetch fresh files.\n3. **Network limits:** Some school, library, or office Wi-Fi networks block active web apps. Try switching off Wi-Fi on your phone to test on cellular data.\n\nIf it still won\'t load, please use the "App Issue" form on this hub to report it, and Rachel will investigate right away!',
    keywords: ['app', "won't", 'load', 'blank', 'white', 'page', 'not', 'loading', 'spinning', 'wheel', 'stuck']
  },
  {
    id: 'disappearing-data',
    category: 'app-issues',
    question: 'My saved journal entries or reading list disappeared!',
    answer: 'Most of our interactive apps (like the Reading Journal) store your entries directly inside your own browser\'s private storage. This keeps your data **100% private** because it never travels to a public server.\n\nHowever, this means:\n* Your list is **only** on that specific device and browser (e.g., if you wrote it on Chrome on your laptop, it won\'t show up on Safari on your phone).\n* Cleansers or "cookie clearers" will erase your saved books.\n* Private or Incognito tabs delete your progress as soon as you close them.\n\n**Best Practice:** Always use the "Share" or "Export" buttons in our journal apps to save a backup link or file to your computer. That way, you never lose your hard work!',
    keywords: ['saved', 'data', 'disappeared', 'lost', 'journal', 'books', 'gone', 'cleared', 'deleted', 'backup']
  },
  {
    id: 'form-fails',
    category: 'app-issues',
    question: 'The form won\'t submit when I click Send!',
    answer: 'If the form isn\'t sending, look for these common reasons:\n\n* **Required fields:** Scroll up and look for fields with red borders or warning text. A field marked with `*` might have been missed.\n* **Email format:** Make sure your email has an `@` and a ending like `.com` or `.net` (e.g., `jane@example.com`).\n* **Slow Connection:** Sometimes sending takes a few moments over slow internet. If the button says "Sending...", wait a moment to see if a success message pops up.\n\nIf all else fails, you can email Rachel directly at `ogrlbdesigns@gmail.com` with your question!',
    keywords: ['form', "won't", 'submit', 'send', 'button', 'submit', 'not', 'working', 'failed']
  },
  {
    id: 'layout-broken',
    category: 'app-issues',
    question: 'The page looks scrambled, weirdly formatted, or has overlapping text',
    answer: 'This happens when your browser tries to use an old visual layout file with a newer version of our app. \n\n**To fix it instantly:** Force-reload by pressing `Ctrl` + `Shift` + `R` (Windows) or `Cmd` + `Shift` + `R` (Mac). This forces the browser to align the visual layouts correctly. \n\nIf you are on an older browser (like Internet Explorer), some modern features might look simplified. We recommend using Google Chrome or Apple Safari for the best experience.',
    keywords: ['page', 'looks', 'broken', 'unstyled', 'weird', 'layout', 'fonts', 'missing', 'overlap', 'scrambled']
  },

  // BOOKS & SERIES
  {
    id: 'next-book',
    category: 'books',
    question: 'When is the next book in my favorite series coming out?',
    answer: 'Rachel is always writing! She has over 50 titles published and love sharing upcoming book news. \n\nTo find out about release dates:\n1. Check the **Recent Updates** on her main website [rlbdesigns.com](https://www.rlbdesigns.com).\n2. Follow her [Amazon Author Page](https://www.amazon.com/stores/Rachel-Baldwin/author/B0FGJZ6FRF) to get automatic notifications from Amazon when a new book is pre-released.\n3. Send a question in our **Book / Series** tab right here, and Rachel will give you a sneak peek on her current progress!',
    keywords: ['next', 'book', 'coming', 'out', 'release', 'date', 'series', 'update', 'rachel', 'baldwin', 'writing']
  },
  {
    id: 'buy-books',
    category: 'books',
    question: 'Where can I buy Rachel\'s books, cookbooks, or journals?',
    answer: 'All of Rachel\'s books are available worldwide in paperback, hardcover, and Kindle format!\n\n* **Amazon:** You can browse her full catalog on her [Amazon Author Store Page](https://www.amazon.com/stores/Rachel-Baldwin/author/B0FGJZ6FRF).\n* **Local Bookstores & Libraries:** Any physical bookshop or public library can order copies of her books through the Ingram Spark network. Just give them the title or ISBN of the book you want!\n* **Main Website:** Visit [rlbdesigns.com](https://www.rlbdesigns.com) for direct store links and a full illustrated catalog.',
    keywords: ['buy', 'purchase', 'where', 'amazon', 'order', 'book', 'shop', 'store', 'kindle', 'paperback']
  },
  {
    id: 'alpha-gal-safe',
    category: 'books',
    question: 'Are the recipes in the cookbooks safe for Alpha-Gal Syndrome?',
    answer: 'Yes, 100%! Rachel Baldwin was diagnosed with Alpha-Gal Syndrome (the mammal allergy triggered by tick bites) herself, so she understands exactly how difficult it is to find safe, delicious foods.\n\nAll recipes in her cookbooks are:\n* **100% Mammal-Free:** No beef, pork, lamb, venison, or other mammal meats.\n* **100% Mammal-Dairy Free:** No cow\'s milk, butter, cheese, or cream (safely utilizing delicious plant-based alternatives).\n* **Gelatin-Free:** Absolutely no hidden mammal ingredients or derivatives.\n\nIf you have a question about a specific recipe or need a substitute idea, feel free to drop a message in the **Book / Series** tab!',
    keywords: ['alpha', 'gal', 'ags', 'safe', 'mammal', 'free', 'dairy', 'free', 'recipe', 'ingredients', 'allergy', 'baking']
  },
  {
    id: 'reading-order',
    category: 'books',
    question: 'What is the reading order for Rachel\'s children\'s series?',
    answer: 'Most of her children\'s books (such as *The Wobbly Wonder Series* or *Pantry Pals Adventures*) are designed as stand-alone stories! \n\nThis means you can jump in and read **any book, in any order** without feeling lost. Each story is self-contained and focuses on lovable, friendly characters and simple life lessons. For sequential series recommendations, you can check her book list at [rlbdesigns.com](https://www.rlbdesigns.com).',
    keywords: ['reading', 'order', 'series', 'order', 'first', 'book', 'start', 'which', 'sequel']
  },
  {
    id: 'signed-copies',
    category: 'books',
    question: 'Can I request a personalized or autographed copy of a book?',
    answer: 'Rachel loves signing books for her readers! While books ordered through Amazon are shipped directly from their warehouses, Rachel occasionally does special signings, direct orders, or giveaways. \n\nPlease send us a request through our **Book / Series** tab here on this Hub with what you are looking for, or join our **Courage Guardians** Facebook Group where Rachel announces signed copy opportunities!',
    keywords: ['signed', 'copy', 'autograph', 'personalized', 'order', 'direct', 'buy', 'rachel', 'special']
  },
  {
    id: 'bulk-discounts',
    category: 'books',
    question: 'Do you offer bulk discounts for schools, homeschooling groups, or libraries?',
    answer: 'Yes, absolutely! Rachel is passionate about supporting classrooms, local libraries, and homeschool co-ops. We can coordinate bulk paperbacks or hardcover orders at special print discounts.\n\nTo arrange this, head over to our **Work Together** tab on this Hub, choose the "Classroom, school, or library bulk purchase" option, and share your details. We will reach back out to organize it for you!',
    keywords: ['bulk', 'school', 'library', 'homeschool', 'discount', 'purchase', 'classroom', 'order', 'co-op', 'printed']
  },
  {
    id: 'stay-updated',
    category: 'quick-fixes',
    question: 'How do I keep up-to-date with Rachel\'s new books and coloring apps?',
    answer: 'The best ways to keep up with all the exciting things happening at RLB Designs are:\n\n1. **Bookmark the Blog:** Check [rlbdesigns.com](https://www.rlbdesigns.com) for regular recipe posts, allergy guides, and homestead stories.\n2. **Join the Community:** Come join our **Courage Guardians** Facebook Group where readers and allergen-safe bakers share encouragement and pictures!\n3. **Follow on Amazon:** Click "Follow" on [Rachel Baldwin\'s Amazon Author Page](https://www.amazon.com/stores/Rachel-Baldwin/author/B0FGJZ6FRF) to get email alerts the moment a pre-release goes live.',
    keywords: ['update', 'news', 'stay', 'connected', 'facebook', 'follow', 'blog', 'release', 'newsletter', 'latest']
  }
];
