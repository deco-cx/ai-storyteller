import { sdk } from "../sdk.js";

window.MyStoriesPage = {
    template: `
        <div class="min-h-screen bg-gradient-to-b from-[#E1F5FE] to-[#BBDEFB] pb-16">
            <!-- Navigation -->
            <div>
                <!-- Navigation Menu -->
                <nav class="bg-white shadow-md py-3 px-4 sm:px-6">
                    <div class="flex justify-center sm:justify-start flex-wrap gap-2">
                        <router-link to="/" class="px-3 py-2 rounded-lg text-[#4A90E2] hover:bg-[#F0F9FF] text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.home') }}
                        </router-link>
                        <router-link to="/create" class="px-3 py-2 rounded-lg text-[#4A90E2] hover:bg-[#F0F9FF] text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.new') }}
                        </router-link>
                        <router-link to="/my-stories" class="px-3 py-2 rounded-lg bg-[#4A90E2] text-white font-medium text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.myStories') }}
                        </router-link>
                    </div>
                </nav>
            </div>

            <!-- Main Content -->
            <main class="max-w-3xl mx-auto w-full px-4 pt-6 pb-16">
                <!-- Header with Title -->
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold mb-8 text-center relative w-full">
                        <span class="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#2871CC] via-[#4A90E2] to-[#81D4FA] mb-3">
                            {{ $t('myStories.pageTitle') }}
                        </span>
                        <div class="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#2871CC] via-[#4A90E2] to-[#81D4FA] rounded-full"></div>
                    </h2>
                </div>
                
                <!-- Search Bar (only show if there are stories) -->
                <div v-if="!loading && generations.length > 0" class="mb-6">
                    <div class="relative">
                        <input 
                            v-model="searchQuery"
                            type="text" 
                            :placeholder="$t('myStories.searchPlaceholder')"
                            class="w-full px-4 py-3 rounded-lg border border-[#BBDEFB] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] pl-10 shadow-sm"
                        />
                        <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[#81D4FA]"></i>
                        <button 
                            v-if="searchQuery" 
                            @click="searchQuery = ''" 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4A90E2]"
                        >
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#BBDEFB] border-t-[#4A90E2]"></div>
                </div>

                <!-- No Stories State -->
                <div v-else-if="generations.length === 0" class="bg-white rounded-3xl shadow-lg overflow-hidden border-4 border-[#4A90E2] p-12 text-center transform transition-all duration-300 hover:shadow-xl">
                    <div class="text-[#4A90E2] text-xl mb-4 font-medium">{{ $t('myStories.noStoriesText') }}</div>
                    <button @click="goToNewStory" class="bg-gradient-to-b from-[#4A90E2] to-[#2871CC] text-white px-6 py-3 rounded-full hover:from-[#5FA0E9] hover:to-[#4A90E2] border border-[#2871CC] font-medium flex items-center gap-2 mx-auto shadow-md transition-all duration-200">
                        <i class="fa-solid fa-book-open"></i>
                        {{ $t('myStories.createFirstText') }}
                    </button>
                </div>

                <!-- Stories Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(story, index) in filteredGenerations" :key="index" 
                         class="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-4 border-[#4A90E2]"
                         :class="[
                            index % 4 === 0 ? 'border-[#2871CC]' : '',
                            index % 4 === 1 ? 'border-[#4A90E2]' : '',
                            index % 4 === 2 ? 'border-[#64B5F6]' : '',
                            index % 4 === 3 ? 'border-[#81D4FA]' : ''
                         ]"
                         @click="viewStory(story)">
                        <!-- Story Card Content -->
                        <div class="p-6 flex flex-col">
                            <div class="flex justify-between items-start mb-3">
                                <h3 class="text-xl font-semibold text-[#4A90E2] line-clamp-1">{{ story.title }}</h3>
                                <button @click.stop="deleteStory(generations.indexOf(story))" class="text-gray-400 hover:text-red-500 p-1">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                            
                            <!-- Cover Image (if available) -->
                            <div v-if="story.coverUrl" class="relative mb-4 h-40 overflow-hidden rounded-xl">
                                <img :src="getOptimizedImageUrl(story.coverUrl, 400, 200)" :alt="story.title" class="w-full h-full object-cover transition-transform duration-500 hover:scale-110">
                                <!-- Decorative Elements -->
                                <div class="absolute top-2 left-2 w-10 h-10 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
                                     :class="[
                                        index % 4 === 0 ? 'text-[#2871CC]' : '',
                                        index % 4 === 1 ? 'text-[#4A90E2]' : '',
                                        index % 4 === 2 ? 'text-[#64B5F6]' : '',
                                        index % 4 === 3 ? 'text-[#81D4FA]' : ''
                                     ]">
                                   <i class="fa-solid fa-book-open text-lg"></i>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 opacity-60"></div>
                            </div>
                            
                            <!-- Story Excerpt -->
                            <p class="text-gray-600 mb-4 line-clamp-3 flex-grow">
                                {{ story.excerpt || (story.story ? story.story.substring(0, 150) + '...' : 'No preview available') }}
                            </p>
                            
                            <!-- Date and View Button -->
                            <div class="flex justify-between items-center mt-auto">
                                <span class="text-sm text-gray-500">{{ formatDate(story.createdAt) }}</span>
                                <div class="text-[#4A90E2] hover:text-[#5FA0E9] flex items-center gap-1 font-medium">
                                    <span>{{ $t('myStories.listen') }}</span>
                                    <i class="fa-solid fa-arrow-right text-sm transition-transform group-hover:translate-x-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `,
    data() {
        return {
            generations: [],
            loading: true,
            searchQuery: "",
            BASE_FS_URL: "https://fs.webdraw.com",
            // Fallback data when SDK.fs is not available
            fallbackGenerations: {
                generations: [
                    {
                      "title": "João Paulo and the Time-Traveling Antique Car",
                      "coverUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/carros_antigos_disney_pixar_illustration.webp",
                      "excerpt": "Once upon a time, in a small town in Brazil, lived a bright and curious boy named João Paulo. João P...",
                      "story": "Once upon a time, in a small town in Brazil, lived a bright and curious boy named João Paulo. João Paulo had a deep love for antique cars. He spent hours reading about them, drawing them, and dreaming about them. One day, while exploring his grandfather's old garage, he discovered a dusty, old car covered with a tarp. To his surprise, it was a 1920 Ford Model T, a car he had only seen in his books!\n\nJoão Paulo spent days and nights fixing the old car, using the knowledge he had gained from his countless hours of reading. One night, as he turned the key in the ignition, the car started with a loud rumble, and suddenly, everything around him started to blur. When he opened his eyes, he found himself in a bustling city with people dressed in old-fashioned clothes. He had traveled back in time to the 1920s!\n\nIn this new world, João Paulo had many adventures. He met Henry Ford, the creator of his beloved Model T, and even got a chance to visit the Ford factory. He learned about the assembly line production method and how it revolutionized the automobile industry. He also helped solve a mystery of a missing car part at the factory, using his knowledge of antique cars.\n\nHowever, João Paulo started to miss his home. He realized that while the past was exciting, he belonged in his own time. So, he bid farewell to his new friends and set off in his Model T. As he turned the key in the ignition, he was transported back to his grandfather's garage.\n\nBack home, João Paulo had a newfound appreciation for his love of antique cars. He had not only read and dreamt about them, but he had also lived an adventure in one. He continued to learn and dream, knowing that knowledge could take him on the most incredible journeys. And every time he missed his adventure, he would sit in his Model T, close his eyes, and let his imagination take him back to the 1920s.",
                      "audioUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/JoaoPauloTimeTravelingAntiqueCarStory.mp3",
                      "createdAt": 1740086746
                    },
                    {
                      "title": "Lina e a Aventura do Respeito",
                      "coverUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/illustration_respeitar_outros_disney_pixar.webp",
                      "excerpt": "Era uma vez uma menina chamada Lina que vivia em uma pequena cidade chamada Harmonia. Lina era conhe...",
                      "story": "Era uma vez uma menina chamada Lina que vivia em uma pequena cidade chamada Harmonia. Lina era conhecida por todos por sua gentileza e respeito pelos outros. Ela acreditava que todos mereciam ser tratados com bondade e consideração, independentemente de quem fossem ou de onde viessem. Um dia, Lina ouviu falar de uma pedra mágica que concedia um desejo a quem a encontrasse. Ela decidiu embarcar em uma aventura para encontrar essa pedra, pois queria que todos no mundo respeitassem uns aos outros.\n\nLina começou sua jornada através de florestas densas, montanhas altas e rios largos. Em cada lugar que passava, ela encontrava criaturas de todos os tipos. Algumas eram amigáveis, outras nem tanto. Mas Lina tratava todas com o mesmo respeito e gentileza. Ela ouvia suas histórias, ajudava quando podia e sempre se despedida com um sorriso. As criaturas ficavam tão impressionadas com a bondade de Lina que decidiam ajudá-la em sua busca pela pedra mágica.\n\nDepois de muitos dias e noites, Lina finalmente chegou ao local onde a pedra mágica estava escondida. Mas para sua surpresa, a pedra estava sendo guardada por um enorme dragão. O dragão era conhecido por ser muito mal-humorado e não gostava de visitantes. Mas Lina, em vez de ter medo, se aproximou do dragão com respeito e gentileza. Ela explicou sua missão e pediu permissão para pegar a pedra.\n\nO dragão, que nunca tinha sido tratado com tanto respeito antes, ficou surpreso e comovido. Ele permitiu que Lina pegasse a pedra mágica. Quando Lina pegou a pedra, ela fez seu desejo: que todos no mundo aprendessem a importância do respeito e tratassem uns aos outros com bondade e consideração.\n\nLina voltou para casa, e a notícia de sua aventura se espalhou. As pessoas começaram a tratar umas às outras com mais respeito, assim como Lina havia desejado. E assim, Lina não apenas encontrou a pedra mágica, mas também ajudou a tornar o mundo um lugar mais respeitoso e gentil.",
                      "audioUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/lina_aventura_do_respeito.mp3",
                      "createdAt": 1740087909
                    },
                    {
                      "title": "A Aventura de Lina no Sítio Encantado",
                      "coverUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/StoryIllustration_Sitio_DisneyPixarStyle_1.webp",
                      "excerpt": "Era uma vez uma menina chamada Lina que adorava visitar o sítio de seus avós. Um dia, enquanto explo...",
                      "story": "Era uma vez uma menina chamada Lina que adorava visitar o sítio de seus avós. Um dia, enquanto explorava o pomar, ela encontrou uma pequena porta escondida atrás de uma árvore. Curiosa como sempre, Lina decidiu abrir a porta e se viu em um mundo completamente diferente, um sítio encantado cheio de cores vibrantes e criaturas mágicas.\n\nNo sítio encantado, Lina conheceu uma fada chamada Luzia que precisava de ajuda para encontrar uma fruta mágica que poderia salvar sua árvore encantada de uma praga. Lina, sempre disposta a ajudar, aceitou a missão e, com um mapa nas mãos, partiu em uma aventura pelo sítio encantado.\n\nA jornada foi cheia de desafios. Lina teve que resolver enigmas, atravessar um rio de chocolate e escalar uma montanha de marshmallow. Mas com coragem e determinação, ela conseguiu superar todos os obstáculos. No topo da montanha, Lina encontrou a fruta mágica.\n\nCom a fruta mágica em mãos, Lina voltou para a árvore encantada. Luzia usou a fruta para curar a árvore, e o sítio encantado voltou a brilhar. Lina foi celebrada como a heroína do dia e aprendeu que com coragem e determinação, podemos superar qualquer desafio.\n\nQuando Lina voltou para o sítio de seus avós, ela percebeu que a aventura tinha sido um sonho. Mas o sorriso em seu rosto e a coragem em seu coração eram muito reais. Lina aprendeu que a aventura e a magia podem estar em qualquer lugar, até mesmo em um simples sítio, se apenas usarmos nossa imaginação.",
                      "audioUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/lina_aventura_sitio_encantado.mp3",
                      "createdAt": 1740096703
                    },
                    {
                      "title": "Lina e a Aventura da Divisão",
                      "coverUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/dividir_amigos_escola_ilustracao.webp",
                      "excerpt": "Era uma vez uma menina chamada Lina que adorava dividir tudo com seus amigos na escola. Ela dividia ...",
                      "story": "Era uma vez uma menina chamada Lina que adorava dividir tudo com seus amigos na escola. Ela dividia seus lanches, seus brinquedos e até mesmo seus segredos. Lina acreditava que dividir era uma maneira de mostrar amor e cuidado pelos outros. Um dia, Lina encontrou uma pedra mágica que podia conceder um desejo. Ela decidiu que queria compartilhar essa magia com seus amigos.\n\nLina levou a pedra mágica para a escola no dia seguinte. Ela reuniu todos os seus amigos e contou-lhes sobre a pedra. Todos ficaram muito animados e começaram a pensar em todos os desejos que poderiam fazer. Lina, no entanto, lembrou a todos que eles só tinham um desejo e que precisavam decidir juntos o que desejariam.\n\nOs amigos de Lina começaram a discutir entre si sobre o que deveriam desejar. Alguns queriam desejos egoístas, enquanto outros queriam desejos que beneficiariam a todos. Lina ficou triste ao ver seus amigos discutindo e decidiu que precisava encontrar uma maneira de resolver a situação. Ela pensou e pensou, e finalmente teve uma ideia.\n\nLina sugeriu que todos fizessem um desejo que pudesse ser compartilhado por todos. Ela explicou que, se todos desejassem algo que pudesse ser dividido, todos se beneficiariam. Os amigos de Lina concordaram com a ideia e começaram a pensar em desejos que poderiam ser compartilhados. Depois de muita discussão, eles finalmente decidiram desejar um dia de diversão e aventura que todos pudessem desfrutar juntos.\n\nA pedra mágica concedeu o desejo e todos os amigos de Lina passaram um dia incrível juntos. Eles tiveram aventuras emocionantes, riram muito e criaram memórias que durariam a vida toda. No final do dia, todos agradeceram a Lina por compartilhar a pedra mágica com eles. Lina sorriu e disse que estava feliz por ter podido dividir algo tão especial com seus amigos. E assim, Lina aprendeu que dividir não é apenas sobre coisas materiais, mas também sobre experiências e momentos felizes.",
                      "audioUrl": "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/lina_aventura_divisao.mp3",
                      "createdAt": 1740096782
                    }
                  ]
            }
        }
    },
    computed: {
        filteredGenerations() {
            if (!this.searchQuery.trim()) {
                return this.generations;
            }
            
            const query = this.searchQuery.toLowerCase().trim();
            return this.generations.filter(story => {
                const titleMatch = story.title && story.title.toLowerCase().includes(query);
                const storyMatch = story.story && story.story.toLowerCase().includes(query);
                return titleMatch || storyMatch;
            });
        }
    },
    async mounted() {
        console.log("MyStoriesPage mounted");
        
        // Ensure all necessary translation keys exist
        this.ensureTranslationKeys();
        
        await this.loadGenerations();
        
        // Fix permissions for existing story files
        await this.fixStoryPermissions();
    },
    methods: {
        // Ensure all necessary translation keys exist
        ensureTranslationKeys() {
            // Define default translations for new UI elements
            const requiredTranslations = {
                'myStories.listen': 'Listen',
                'myStories.today': 'Today at',
                'myStories.yesterday': 'Yesterday at'
            };
            
            // Portuguese translations for the new keys
            const ptTranslations = {
                'myStories.listen': 'Ouvir',
                'myStories.today': 'Hoje às',
                'myStories.yesterday': 'Ontem às'
            };
            
            // Add translations if they don't exist
            if (window.i18n && window.i18n.translations) {
                // For each language
                Object.keys(window.i18n.translations).forEach(lang => {
                    // For each required translation
                    Object.entries(requiredTranslations).forEach(([key, defaultValue]) => {
                        // Get the key parts (e.g., ['myStories', 'listen'])
                        const keyParts = key.split('.');
                        
                        // Navigate to the parent object
                        let target = window.i18n.translations[lang];
                        for (let i = 0; i < keyParts.length - 1; i++) {
                            if (!target[keyParts[i]]) {
                                target[keyParts[i]] = {};
                            }
                            target = target[keyParts[i]];
                        }
                        
                        // Set the value if it doesn't exist
                        const lastKey = keyParts[keyParts.length - 1];
                        if (!target[lastKey]) {
                            // Use Portuguese translations for PT language
                            if (lang === 'pt' && ptTranslations[key]) {
                                target[lastKey] = ptTranslations[key];
                            } else {
                                target[lastKey] = defaultValue;
                            }
                            console.log(`Added missing translation for ${lang}.${key}`);
                        }
                    });
                });
            }
        },
        // Fix permissions for existing story files
        async fixStoryPermissions() {
            try {
                console.log("Fixing permissions for existing story files...");
                
                // Get all story files in the AI Storyteller directory
                let storyFiles = [];
                try {
                    const files = await sdk.fs.list("~/AI Storyteller");
                    console.log("Found files in AI Storyteller directory:", files);
                    
                    // Process the files based on the format returned
                    if (Array.isArray(files)) {
                        // Filter for JSON files
                        storyFiles = files.filter(file => {
                            if (typeof file === 'string') {
                                // If file is a string (full path)
                                const parts = file.split('/');
                                const filename = parts[parts.length - 1];
                                return filename.endsWith('.json');
                            } else if (file && typeof file === 'object') {
                                // If file is an object with name property
                                if (file.name && typeof file.name === 'string') {
                                    return file.name.endsWith('.json');
                                }
                                // If file is an object with path property
                                if (file.path && typeof file.path === 'string') {
                                    const parts = file.path.split('/');
                                    const filename = parts[parts.length - 1];
                                    return filename.endsWith('.json');
                                }
                            }
                            return false;
                        });
                    } else if (files && typeof files === 'object') {
                        // If it's not an array but an object, try to convert it
                        const filesArray = Object.values(files);
                        
                        // Filter for JSON files
                        storyFiles = filesArray.filter(file => {
                            if (typeof file === 'string') {
                                // If file is a string (full path)
                                const parts = file.split('/');
                                const filename = parts[parts.length - 1];
                                return filename.endsWith('.json');
                            } else if (file && typeof file === 'object') {
                                // If file is an object with name property
                                if (file.name && typeof file.name === 'string') {
                                    return file.name.endsWith('.json');
                                }
                                // If file is an object with path property
                                if (file.path && typeof file.path === 'string') {
                                    const parts = file.path.split('/');
                                    const filename = parts[parts.length - 1];
                                    return filename.endsWith('.json');
                                }
                            }
                            return false;
                        });
                    }
                } catch (listError) {
                    console.warn("Could not list files in AI Storyteller directory:", listError);
                    storyFiles = [];
                }
                
                console.log("Found story files:", storyFiles);
                
                // Track all media files that need permission fixes
                const mediaFiles = new Set();
                
                // Update permissions for each file and collect media references
                for (const file of storyFiles) {
                    try {
                        // Determine the file path
                        let filePath;
                        if (typeof file === 'string') {
                            // If file is already a full path
                            filePath = file;
                        } else if (file && typeof file === 'object') {
                            if (file.name) {
                                filePath = `~/AI Storyteller/${file.name}`;
                            } else if (file.path) {
                                filePath = file.path;
                            } else {
                                console.log("Skipping file with invalid format:", file);
                                continue;
                            }
                        } else {
                            console.log("Skipping file with invalid format:", file);
                            continue;
                        }
                        
                        console.log(`Setting permissions for: ${filePath}`);
                        
                        // Use 0o644 (rw-r--r--) to ensure web server can access the files
                        if (typeof sdk.fs.chmod === 'function') {
                            await sdk.fs.chmod(filePath, 0o644);
                            console.log(`Successfully set permissions (0o644) for: ${filePath}`);
                        } else {
                            console.log("chmod function not available, skipping permission setting");
                        }
                        
                        // Read the story file to find media references
                        try {
                            const content = await sdk.fs.read(filePath);
                            const storyData = JSON.parse(content);
                            
                            // Check if it's a single story or a collection
                            if (storyData.generations && Array.isArray(storyData.generations)) {
                                // It's a collection of stories
                                for (const story of storyData.generations) {
                                    this.collectMediaFiles(story, mediaFiles);
                                }
                            } else {
                                // It's a single story
                                this.collectMediaFiles(storyData, mediaFiles);
                            }
                        } catch (readError) {
                            console.warn(`Could not read story file ${filePath} to find media references:`, readError);
                        }
                    } catch (error) {
                        console.warn(`Could not set file permissions for ${file}:`, error);
                        
                        // Try alternative approach if chmod fails
                        try {
                            if (typeof sdk.fs.chmod === 'function') {
                                console.log("Trying alternative chmod approach");
                                await sdk.fs.chmod(file, 0o644);
                                console.log(`Successfully set permissions using alternative method for: ${file}`);
                            }
                        } catch (altError) {
                            console.warn("Alternative permission setting also failed:", altError);
                        }
                    }
                }
                
                // Now fix permissions for all the media files
                console.log(`Found ${mediaFiles.size} media files to fix permissions for`);
                for (const mediaFile of mediaFiles) {
                    try {
                        // Skip URLs that are not local files
                        if (mediaFile.startsWith('http') || mediaFile.startsWith('data:')) {
                            continue;
                        }
                        
                        // Clean up the file path
                        let cleanPath = mediaFile;
                        
                        // Remove the leading ~ if present
                        if (cleanPath.startsWith('~')) {
                            cleanPath = cleanPath.substring(1);
                        }
                        
                        // Ensure the path doesn't start with double slashes
                        while (cleanPath.startsWith('//')) {
                            cleanPath = cleanPath.substring(1);
                        }
                        
                        console.log(`Setting permissions for media file: ${cleanPath}`);
                        
                        // Use 0o644 (rw-r--r--) to ensure web server can access the files
                        if (typeof sdk.fs.chmod === 'function') {
                            await sdk.fs.chmod(cleanPath, 0o644);
                            console.log(`Successfully set permissions (0o644) for media file: ${cleanPath}`);
                        } else {
                            console.log("chmod function not available, skipping permission setting for media file");
                        }
                    } catch (error) {
                        console.warn(`Could not set file permissions for media file ${mediaFile}:`, error);
                        
                        // Try alternative approach if chmod fails
                        try {
                            if (typeof sdk.fs.chmod === 'function') {
                                let cleanPath = mediaFile;
                                if (cleanPath.startsWith('~')) {
                                    cleanPath = cleanPath.substring(1);
                                }
                                while (cleanPath.startsWith('//')) {
                                    cleanPath = cleanPath.substring(1);
                                }
                                
                                console.log("Trying alternative chmod method for media file");
                                await sdk.fs.chmod(cleanPath, 0o644);
                                console.log(`Successfully set permissions using alternative method for media file: ${cleanPath}`);
                            }
                        } catch (altError) {
                            console.warn("Alternative permission setting also failed for media file:", altError);
                        }
                    }
                }
                
                console.log("Finished fixing permissions for all files");
            } catch (error) {
                console.error("Error fixing story permissions:", error);
            }
        },
        
        // Helper method to collect media files from a story
        collectMediaFiles(story, mediaFiles) {
            if (!story) return;
            
            // Check for cover image URL
            if (story.coverUrl) {
                // If it's a full URL to fs.webdraw.com, extract the path
                if (story.coverUrl.includes('fs.webdraw.com')) {
                    try {
                        const url = new URL(story.coverUrl);
                        mediaFiles.add(url.pathname);
                    } catch (e) {
                        mediaFiles.add(story.coverUrl);
                    }
                } else {
                    mediaFiles.add(story.coverUrl);
                }
            }
            
            // Check for audio URL
            if (story.audioUrl) {
                // If it's a full URL to fs.webdraw.com, extract the path
                if (story.audioUrl.includes('fs.webdraw.com')) {
                    try {
                        const url = new URL(story.audioUrl);
                        mediaFiles.add(url.pathname);
                    } catch (e) {
                        mediaFiles.add(story.audioUrl);
                    }
                } else {
                    mediaFiles.add(story.audioUrl);
                }
            }
        },
        async loadGenerations() {
            try {
                this.loading = true;
                let storyFiles = [];
                let stories = [];
                
                // Remove the localhost check
                console.log("DEBUG: Starting loadGenerations method");
                console.log("DEBUG: SDK available?", !!sdk);
                console.log("DEBUG: SDK.fs available?", !!(sdk && sdk.fs));
                console.log("DEBUG: SDK.fs.read available?", !!(sdk && sdk.fs && typeof sdk.fs.read === 'function'));
                console.log("DEBUG: SDK.fs.list available?", !!(sdk && sdk.fs && typeof sdk.fs.list === 'function'));
                
                if (sdk && typeof sdk.fs?.read === 'function') {
                    try {
                        // First try the old way - reading from generations.json
                        console.log("Trying to read from generations.json...");
                        const content = await sdk.fs.read("~/AI Storyteller/generations.json");
                        console.log("DEBUG: Content from generations.json:", content ? "Content exists" : "No content");
                        const data = JSON.parse(content);
                        
                        if (data && data.generations && Array.isArray(data.generations)) {
                            console.log("Successfully read from generations.json");
                            console.log("DEBUG: Number of stories in generations.json:", data.generations.length);
                            stories = data.generations.map((gen) => ({
                                ...gen,
                                story: gen.story || (gen.chapters ? gen.chapters.map(ch => ch.story).join("\n\n") : ""),
                            }));
                        }
                    } catch (error) {
                        console.log("Could not read from generations.json, will try individual files:", error);
                    }
                    
                    // Then try the new way - reading individual files
                    if (typeof sdk.fs?.list === 'function') {
                        try {
                            console.log("Trying to read individual story files...");
                            // List all files in the AI Storyteller directory
                            console.log("DEBUG: About to call sdk.fs.list");
                            const files = await sdk.fs.list("~/AI Storyteller");
                            console.log("DEBUG: Files returned by sdk.fs.list:", files);
                            
                            // Process the files based on the format returned
                            if (Array.isArray(files)) {
                                console.log("Files is an array with length:", files.length);
                                
                                // Filter for JSON files (excluding generations.json)
                                storyFiles = files.filter(file => {
                                    if (typeof file === 'string') {
                                        // If file is a string (full path)
                                        const parts = file.split('/');
                                        const filename = parts[parts.length - 1];
                                        return filename.endsWith('.json') && filename !== 'generations.json';
                                    } else if (file && typeof file === 'object') {
                                        // If file is an object with name property
                                        if (file.name && typeof file.name === 'string') {
                                            return file.name.endsWith('.json') && file.name !== 'generations.json';
                                        }
                                        // If file is an object with path property
                                        if (file.path && typeof file.path === 'string') {
                                            const parts = file.path.split('/');
                                            const filename = parts[parts.length - 1];
                                            return filename.endsWith('.json') && filename !== 'generations.json';
                                        }
                                    }
                                    return false;
                                });
                            } else if (files && typeof files === 'object') {
                                console.log("Files is an object, trying to convert to array");
                                // If it's not an array but an object, try to convert it
                                const filesArray = Object.values(files);
                                console.log("Converted to array with length:", filesArray.length);
                                
                                // Filter for JSON files (excluding generations.json)
                                storyFiles = filesArray.filter(file => {
                                    if (typeof file === 'string') {
                                        // If file is a string (full path)
                                        const parts = file.split('/');
                                        const filename = parts[parts.length - 1];
                                        return filename.endsWith('.json') && filename !== 'generations.json';
                                    } else if (file && typeof file === 'object') {
                                        // If file is an object with name property
                                        if (file.name && typeof file.name === 'string') {
                                            return file.name.endsWith('.json') && file.name !== 'generations.json';
                                        }
                                        // If file is an object with path property
                                        if (file.path && typeof file.path === 'string') {
                                            const parts = file.path.split('/');
                                            const filename = parts[parts.length - 1];
                                            return filename.endsWith('.json') && filename !== 'generations.json';
                                        }
                                    }
                                    return false;
                                });
                            }
                            
                            console.log("Found individual story files:", storyFiles.length);
                            console.log("DEBUG: Story files:", JSON.stringify(storyFiles));
                            
                            // Read each story file
                            const individualStories = [];
                            for (const file of storyFiles) {
                                try {
                                    // Determine the file path
                                    let filePath;
                                    if (typeof file === 'string') {
                                        // If file is already a full path
                                        filePath = file;
                                    } else if (file && typeof file === 'object') {
                                        if (file.name) {
                                            filePath = `~/AI Storyteller/${file.name}`;
                                        } else if (file.path) {
                                            filePath = file.path;
                                        } else {
                                            console.log("Skipping file with invalid format:", file);
                                            continue;
                                        }
                                    } else {
                                        console.log("Skipping file with invalid format:", file);
                                        continue;
                                    }
                                    
                                    console.log("Reading file:", filePath);
                                    const content = await sdk.fs.read(filePath);
                                    
                                    // Validate content
                                    if (!content) {
                                        console.log("Empty content for file:", filePath);
                                        continue;
                                    }
                                    
                                    // Parse JSON
                                    let storyData;
                                    try {
                                        storyData = JSON.parse(content);
                                        console.log("DEBUG: Successfully parsed JSON for file:", filePath);
                                        console.log("DEBUG: Story title:", storyData.title);
                                    } catch (parseError) {
                                        console.error(`Error parsing JSON for file ${filePath}:`, parseError);
                                        continue;
                                    }
                                    
                                    // Validate story data
                                    if (!storyData || typeof storyData !== 'object') {
                                        console.log("Invalid story data for file:", filePath);
                                        continue;
                                    }
                                    
                                    // Extract filename for logging
                                    const parts = filePath.split('/');
                                    const filename = parts[parts.length - 1];
                                    console.log("Successfully read story from:", filename);
                                    
                                    // Add the story to our array
                                    individualStories.push({
                                        ...storyData,
                                        // Ensure story field exists
                                        story: storyData.story || (storyData.chapters ? storyData.chapters.map(ch => ch.story).join("\n\n") : ""),
                                        // Convert ISO string to timestamp if needed
                                        createdAt: storyData.createdAt ? 
                                            (typeof storyData.createdAt === 'string' ? new Date(storyData.createdAt).getTime() / 1000 : storyData.createdAt) : 
                                            (Date.now() / 1000),
                                        // Store the original file path for deletion
                                        _filePath: filePath
                                    });
                                } catch (error) {
                                    console.error(`Error reading story file:`, error);
                                    console.log("DEBUG: Error details:", error.message, error.stack);
                                }
                            }
                            
                            // Combine stories from both sources, avoiding duplicates
                            if (individualStories.length > 0) {
                                console.log("Successfully read individual story files");
                                console.log("DEBUG: Number of individual stories found:", individualStories.length);
                                
                                // If we have stories from both sources, merge them
                                if (stories.length > 0) {
                                    console.log("Merging stories from both sources");
                                    
                                    // Use title as a unique identifier to avoid duplicates
                                    const titleMap = new Map();
                                    
                                    // Add stories from generations.json first
                                    stories.forEach(story => {
                                        if (story.title) {
                                            titleMap.set(story.title, story);
                                        }
                                    });
                                    
                                    // Add individual stories, overriding duplicates
                                    individualStories.forEach(story => {
                                        if (story.title) {
                                            titleMap.set(story.title, story);
                                        }
                                    });
                                    
                                    // Convert map back to array
                                    stories = Array.from(titleMap.values());
                                } else {
                                    // If we only have individual stories, use those
                                    stories = individualStories;
                                }
                            }
                        } catch (error) {
                            console.error("Error reading individual story files:", error);
                            console.log("DEBUG: Error details:", error.message, error.stack);
                            // If we couldn't read individual files but have stories from generations.json, use those
                            if (stories.length === 0) {
                                console.log("Falling back to fallback data");
                                stories = this.fallbackGenerations.generations;
                            }
                        }
                    } else {
                        console.log("DEBUG: sdk.fs.list is not a function");
                    }
                    
                    // If we still have no stories, use fallback data
                    if (stories.length === 0) {
                        console.log("No stories found, using fallback data");
                        stories = this.fallbackGenerations.generations;
                    }
                    
                    // Sort stories by creation date (newest first)
                    this.generations = stories.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    console.log("Total loaded stories:", this.generations.length);
                } else {
                    // Fallback to local variable if SDK.fs is not available
                    console.log("SDK.fs not available, using fallback data");
                    this.generations = this.fallbackGenerations.generations
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                }
            } catch (error) {
                console.error("Error loading stories:", error);
                console.log("DEBUG: Error details:", error.message, error.stack);
                this.generations = [];
            } finally {
                this.loading = false;
            }
        },
        formatDate(timestamp) {
            if (!timestamp) return "";
            const date = new Date(timestamp * 1000);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            const isYesterday =
                new Date(now - 86400000).toDateString() === date.toDateString();

            const timeStr = date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });

            if (isToday) return `${this.$t('myStories.today')} ${timeStr}`;
            if (isYesterday) return `${this.$t('myStories.yesterday')} ${timeStr}`;
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        },
        viewStory(story) {
            // Check if the story has a direct file path
            if (story._filePath) {
                console.log("Story has a direct file path:", story._filePath);
                
                // Navigate to the story page with the file parameter using Vue Router
                this.$router.push({
                    path: '/story',
                    query: { file: story._filePath }
                });
            } else {
                console.log("Story does not have a direct file path, using index approach");
                
                // For legacy stories stored in generations.json, use the index approach
                // Store the index in localStorage for backward compatibility
                localStorage.setItem("currentStory", JSON.stringify(story));
                
                // Find the index of the story in the generations array
                const index = this.generations.indexOf(story);
                console.log("Story index in generations array:", index);
                
                // Navigate to the story page with generations.json and index parameter using Vue Router
                this.$router.push({
                    path: '/story',
                    query: { 
                        file: "~/AI Storyteller/generations.json",
                        index: index 
                    }
                });
            }
        },
        deleteStory(index) {
            if (confirm("Are you sure you want to delete this story?")) {
                const story = this.generations[index];
                this.generations.splice(index, 1);
                
                // Try to update both storage methods if SDK.fs is available
                if (sdk && typeof sdk.fs?.read === 'function') {
                    // 1. Try to delete the individual file if it exists
                    if (typeof sdk.fs?.remove === 'function') {
                        try {
                            // First try using the stored file path if available
                            if (story._filePath) {
                                console.log("Attempting to delete file using stored path:", story._filePath);
                                
                                // Try to delete the story JSON file
                                sdk.fs.remove(story._filePath)
                                    .then(() => {
                                        console.log("Individual story file deleted successfully using stored path");
                                        // After deleting the JSON file, delete the associated media files
                                        this.deleteAssociatedMediaFiles(story);
                                    })
                                    .catch(err => {
                                        console.log("Could not delete using stored path:", err);
                                        // Fall back to title-based deletion
                                        this.deleteByTitle(story);
                                    });
                            } else if (story.title) {
                                // Fall back to title-based deletion
                                this.deleteByTitle(story);
                            }
                        } catch (error) {
                            console.log("Error during individual story deletion:", error);
                        }
                    }
                    
                    // 2. Try to update the generations.json file if it exists
                    this.updateGenerationsFile();
                } else {
                    // Update fallback data if SDK.fs is not available
                    this.fallbackGenerations.generations = [...this.generations];
                    console.log("SDK.fs not available, updated fallback data");
                }
            }
        },
        
        // Method to delete a story by its title
        deleteByTitle(story) {
            if (!story.title) return;
            
            // Find the filename based on the story title
            const safeName = this.safeFolderName(story.title);
            const baseFilename = `~/AI Storyteller/${safeName}`;
            
            console.log("Attempting to delete file by title:", `${baseFilename}.json`);
            
            // Try to delete the file
            sdk.fs.remove(`${baseFilename}.json`)
                .then(() => {
                    console.log("Individual story file deleted successfully by title");
                    // After deleting the JSON file, delete the associated media files
                    this.deleteAssociatedMediaFiles(story);
                })
                .catch(err => {
                    console.log("Individual story file not found or could not be deleted by title:", err);
                    
                    // Try with counter suffixes if the base name doesn't work
                    this.tryDeleteWithCounters(safeName, story);
                });
        },
        
        // Try to delete files with counter suffixes
        async tryDeleteWithCounters(safeName, story) {
            try {
                let deleted = false;
                // Try with counter suffixes (up to 5)
                for (let i = 1; i <= 5; i++) {
                    const filename = `~/AI Storyteller/${safeName}_${i}.json`;
                    console.log("Trying to delete with counter:", filename);
                    
                    try {
                        await sdk.fs.remove(filename);
                        console.log("Successfully deleted file with counter:", filename);
                        deleted = true;
                        break; // Exit the loop if successful
                    } catch (err) {
                        console.log(`File with counter ${i} not found:`, err);
                    }
                }
                
                if (deleted && story) {
                    this.deleteAssociatedMediaFiles(story);
                }
            } catch (error) {
                console.log("Error in tryDeleteWithCounters:", error);
            }
        },
        
        async deleteAssociatedMediaFiles(story) {
            if (!story || !story.title) return;
            
            try {
                const safeName = this.safeFolderName(story.title);
                console.log("Deleting associated media files for story:", story.title);
                
                const attemptedPaths = new Set();
                
                if (story.audioUrl) {
                    await this.deleteFileFromUrl(story.audioUrl);
                    try {
                        const audioUrl = new URL(story.audioUrl);
                        const audioPath = audioUrl.pathname;
                        const audioFilename = audioPath.split('/').pop();
                        if (audioFilename) {
                            attemptedPaths.add(`~/Audio/${audioFilename}`);
                            try {
                                await sdk.fs.remove(`~/Audio/${audioFilename}`);
                                console.log(`Deleted audio file using extracted filename: ~/Audio/${audioFilename}`);
                            } catch (err) {
                                console.log(`Could not delete audio file using extracted filename: ~/Audio/${audioFilename}`, err);
                            }
                        }
                    } catch (err) {
                        console.log("Error extracting audio filename from URL:", err);
                    }
                }
                
                if (story.coverUrl) {
                    await this.deleteFileFromUrl(story.coverUrl);
                    try {
                        const imageUrl = new URL(story.coverUrl);
                        const imagePath = imageUrl.pathname;
                        const imageFilename = imagePath.split('/').pop();
                        if (imageFilename) {
                            attemptedPaths.add(`~/Pictures/${imageFilename}`);
                            try {
                                await sdk.fs.remove(`~/Pictures/${imageFilename}`);
                                console.log(`Deleted image file using extracted filename: ~/Pictures/${imageFilename}`);
                            } catch (err) {
                                console.log(`Could not delete image file using extracted filename: ~/Pictures/${imageFilename}`, err);
                            }
                        }
                    } catch (err) {
                        console.log("Error extracting image filename from URL:", err);
                    }
                }
                
                if (story.story) {
                    const textFileRegex = /historia_([a-zA-Z0-9_]+)\.txt/g;
                    const matches = [...story.story.matchAll(textFileRegex)];
                    for (const match of matches) {
                        if (match[1]) {
                            const textFilename = `historia_${match[1]}.txt`;
                            const textFilePath = `~/Documents/${textFilename}`;
                            if (!attemptedPaths.has(textFilePath)) {
                                attemptedPaths.add(textFilePath);
                                try {
                                    await sdk.fs.remove(textFilePath);
                                    console.log(`Deleted text file found in story content: ${textFilePath}`);
                                } catch (err) {
                                    console.log(`Could not delete text file from story content: ${textFilePath}`, err);
                                }
                            }
                        }
                    }
                }
                
                const textFileName = `~/Documents/historia_${safeName}.txt`;
                if (!attemptedPaths.has(textFileName)) {
                    try {
                        await sdk.fs.remove(textFileName);
                        console.log("Deleted text file:", textFileName);
                    } catch (err) {
                        console.log("Could not delete text file or not found:", textFileName, err);
                    }
                }
                
                const altTextFileName = `~/Documents/${safeName}.txt`;
                if (!attemptedPaths.has(altTextFileName)) {
                    try {
                        await sdk.fs.remove(altTextFileName);
                        console.log("Deleted alternative text file:", altTextFileName);
                    } catch (err) {
                        console.log("Could not delete alternative text file or not found:", altTextFileName, err);
                    }
                }
                
                const audioFileName = `~/Audio/${safeName}.mp3`;
                if (!attemptedPaths.has(audioFileName)) {
                    try {
                        await sdk.fs.remove(audioFileName);
                        console.log("Deleted audio file:", audioFileName);
                    } catch (err) {
                        console.log("Could not delete audio file or not found:", audioFileName, err);
                    }
                }
                
                const imageFileName = `~/Pictures/${safeName}.webp`;
                if (!attemptedPaths.has(imageFileName)) {
                    try {
                        await sdk.fs.remove(imageFileName);
                        console.log("Deleted image file:", imageFileName);
                    } catch (err) {
                        console.log("Could not delete image file or not found:", imageFileName, err);
                    }
                }
                
                console.log("Completed media file deletion process for story:", story.title);
            } catch (error) {
                console.error("Error deleting associated media files:", error);
            }
        },
        
        async deleteFileFromUrl(url) {
            if (!url) return;
            
            try {
                if (url.includes('fs.webdraw.com')) {
                    try {
                        const parsedUrl = new URL(url);
                        const filePath = parsedUrl.pathname;
                        
                        if (filePath.startsWith('/users/')) {
                            const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
                            
                            try {
                                await sdk.fs.remove(`~/${relativePath}`);
                                console.log("Deleted file from URL path:", relativePath);
                                return true;
                            } catch (err) {
                                console.log("Could not delete using full path, trying alternative approaches:", err);
                            }
                            
                            const parts = filePath.split('/');
                            const filename = parts[parts.length - 1];
                            const directory = parts[parts.length - 2];
                            
                            if (filename) {
                                let altPath = null;
                                if (directory === 'Audio') {
                                    altPath = `~/Audio/${filename}`;
                                } else if (directory === 'Pictures') {
                                    altPath = `~/Pictures/${filename}`;
                                } else if (directory === 'Documents') {
                                    altPath = `~/Documents/${filename}`;
                                }
                                
                                if (altPath) {
                                    try {
                                        await sdk.fs.remove(altPath);
                                        console.log("Deleted file using directory-based path:", altPath);
                                        return true;
                                    } catch (dirErr) {
                                        console.log("Could not delete using directory-based path:", altPath, dirErr);
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.log("Could not parse or delete URL:", url, e);
                    }
                }
                return false;
            } catch (error) {
                console.error("Error in deleteFileFromUrl:", error);
                return false;
            }
        },
        
        // Method to update the generations.json file
        async updateGenerationsFile() {
            try {
                // First try to read the current file to get the complete structure
                const content = await sdk.fs.read("~/AI Storyteller/generations.json");
                const data = JSON.parse(content);
                
                // Update only the generations array
                data.generations = [...this.generations];
                
                // Write back to the file
                await sdk.fs.write("~/AI Storyteller/generations.json", JSON.stringify(data, null, 2));
                
                // Set file permissions to read-only (0444 in octal)
                try {
                    await sdk.fs.chmod("~/AI Storyteller/generations.json", 0o444);
                    console.log("Set read-only permissions for generations.json");
                } catch (permError) {
                    console.warn("Could not set file permissions for generations.json:", permError);
                    // Continue even if setting permissions fails
                }
                
                console.log("generations.json updated successfully");
            } catch (error) {
                console.log("Could not update generations.json:", error);
            }
        },
        
        // Helper method to create safe folder names (copied from create.vue.js)
        safeFolderName(name) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '');
        },
        goToNewStory() {
            // Navigate to the create page using Vue Router
            this.$router.push('/create');
        },
        getOptimizedImageUrl(url, width, height) {
            if (!url || url.startsWith('data:')) return url;
            
            // Use the webdraw.com image optimization service
            return `https://webdraw.com/image-optimize?src=${encodeURIComponent(url)}&width=${width}&height=${height}&fit=cover`;
        }
    }
}; 