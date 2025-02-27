import { SDK } from "https://webdraw.com/webdraw-sdk@v1";

// Initialize the SDK
const sdk = SDK;

window.MyStoriesPage = {
    template: `
        <div class="min-h-screen bg-[#FFF9F6]">
            <!-- Navigation -->
            <nav class="flex justify-center items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-sky-100">
                <div class="flex items-center gap-3">
                    <img src="https://webdraw.com/image-optimize?src=https%3A%2F%2Fai-storyteller.webdraw.app%2F.webdraw%2Fassets%2Ficon-b8a9e1bd-cf34-46f5-8f72-a98c365e9b09.png&width=80&height=80&fit=cover" 
                         alt="AI Storyteller Logo" 
                         class="w-10 h-10 rounded-xl object-cover" />
                    <h1 class="text-2xl font-medium text-[#006D95]">AI Storyteller</h1>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="max-w-6xl mx-auto px-6 py-12">
                <!-- Header with Title and New Story Button -->
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-3xl font-semibold text-[#00B7EA]">{{ texts.pageTitle }}</h2>
                    <button @click="goToNewStory" class="bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-5 py-2.5 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i>
                        {{ texts.newStoryButton }}
                    </button>
                </div>
                
                <!-- Search Bar (only show if there are stories) -->
                <div v-if="!loading && generations.length > 0" class="mb-6">
                    <div class="relative">
                        <input 
                            v-model="searchQuery"
                            type="text" 
                            :placeholder="texts.searchPlaceholder"
                            class="w-full px-4 py-3 rounded-lg border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] pl-10"
                        />
                        <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <button 
                            v-if="searchQuery" 
                            @click="searchQuery = ''" 
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B7EA]"></div>
                </div>

                <!-- No Stories State -->
                <div v-else-if="generations.length === 0" class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-12 text-center">
                    <div class="text-[#0284C7] text-xl mb-4">{{ texts.noStoriesText }}</div>
                    <button @click="goToNewStory" class="bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 mx-auto">
                        <i class="fa-solid fa-book-open"></i>
                        {{ texts.createFirstText }}
                    </button>
                </div>
                
                <!-- No Search Results -->
                <div v-else-if="filteredGenerations.length === 0" class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-12 text-center">
                    <div class="text-[#0284C7] text-xl mb-4">{{ texts.noSearchResults }}</div>
                    <button @click="searchQuery = ''" class="bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 mx-auto">
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                        Show All Stories
                    </button>
                </div>

                <!-- Stories Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(story, index) in filteredGenerations" :key="index" class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6 flex flex-col hover:shadow-lg transition-shadow">
                        <!-- Story Card Content -->
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="text-xl font-semibold text-[#00B7EA] line-clamp-1">{{ story.title }}</h3>
                            <button @click.stop="deleteStory(generations.indexOf(story))" class="text-gray-400 hover:text-red-500 p-1">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                        
                        <!-- Cover Image (if available) -->
                        <div v-if="story.coverUrl" class="mb-4 h-40 overflow-hidden rounded-lg cursor-pointer" @click="viewStory(story)">
                            <img :src="story.coverUrl" :alt="story.title" class="w-full h-full object-cover hover:scale-105 transition-transform">
                        </div>
                        
                        <!-- Story Excerpt -->
                        <p class="text-gray-600 mb-4 line-clamp-3 flex-grow cursor-pointer" @click="viewStory(story)">
                            {{ story.excerpt || (story.story ? story.story.substring(0, 150) + '...' : 'No preview available') }}
                        </p>
                        
                        <!-- Date and View Button -->
                        <div class="flex justify-between items-center mt-auto">
                            <span class="text-sm text-gray-500">{{ formatDate(story.createdAt) }}</span>
                            <button @click="viewStory(story)" class="text-[#0284C7] hover:text-[#0EA5E9] flex items-center gap-1">
                                <span>Listen</span>
                                <i class="fa-solid fa-arrow-right text-sm"></i>
                            </button>
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
            texts: {
                pageTitle: "My Stories",
                newStoryButton: "New Story",
                noStoriesText: "You haven't created any stories yet.",
                createFirstText: "Create your first story!",
                searchPlaceholder: "Search stories...",
                noSearchResults: "No stories found matching your search."
            },
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
        this.loadGenerations();
    },
    methods: {
        async loadGenerations() {
            try {
                this.loading = true;
                let storyFiles = [];
                let stories = [];
                
                // Check if running on localhost
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                
                // Use fallback data if on localhost or if SDK.fs is not available
                if (isLocalhost) {
                    console.log("Running on localhost, using fallback data");
                    this.generations = this.fallbackGenerations.generations
                        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                } else if (sdk && typeof sdk.fs?.read === 'function') {
                    try {
                        // First try the old way - reading from generations.json
                        console.log("Trying to read from generations.json...");
                        const content = await sdk.fs.read("~/AI Storyteller/generations.json");
                        const data = JSON.parse(content);
                        
                        if (data && data.generations && Array.isArray(data.generations)) {
                            console.log("Successfully read from generations.json");
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
                            const files = await sdk.fs.list("~/AI Storyteller");
                            console.log("Files returned by sdk.fs.list:", files);
                            
                            // Check if files is an array of strings (full paths)
                            if (Array.isArray(files) && files.length > 0 && typeof files[0] === 'string') {
                                console.log("Files are strings (full paths)");
                                
                                // Filter for JSON files (excluding generations.json)
                                storyFiles = files.filter(filePath => {
                                    // Extract the filename from the path
                                    const parts = filePath.split('/');
                                    const filename = parts[parts.length - 1];
                                    
                                    console.log("Checking file:", filename);
                                    
                                    return filename.endsWith('.json') && filename !== 'generations.json';
                                });
                            } else if (!Array.isArray(files)) {
                                console.log("Files is not an array, it's a:", typeof files);
                                // If it's not an array, try to convert it to one if possible
                                const filesArray = files && typeof files === 'object' ? 
                                    Object.values(files) : 
                                    [];
                                console.log("Converted to array:", filesArray);
                                
                                // Filter for JSON files (excluding generations.json)
                                storyFiles = filesArray.filter(file => 
                                    file && 
                                    typeof file === 'object' && 
                                    file.name && 
                                    typeof file.name === 'string' &&
                                    file.name.endsWith('.json') && 
                                    file.name !== 'generations.json'
                                );
                            } else {
                                // Filter for JSON files (excluding generations.json)
                                storyFiles = files.filter(file => 
                                    file && 
                                    typeof file === 'object' && 
                                    file.name && 
                                    typeof file.name === 'string' &&
                                    file.name.endsWith('.json') && 
                                    file.name !== 'generations.json'
                                );
                            }
                            console.log("Found individual story files:", storyFiles.length);
                            console.log("Story files:", storyFiles);
                            
                            // Read each story file
                            const individualStories = [];
                            for (const file of storyFiles) {
                                try {
                                    // Determine the file path
                                    let filePath;
                                    if (typeof file === 'string') {
                                        // If file is already a full path
                                        filePath = file;
                                    } else if (file && typeof file === 'object' && file.name) {
                                        filePath = `~/AI Storyteller/${file.name}`;
                                    } else if (file && typeof file === 'object' && file.path) {
                                        filePath = file.path;
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
                                }
                            }
                            
                            // Combine stories from both sources, avoiding duplicates
                            if (individualStories.length > 0) {
                                console.log("Successfully read individual story files");
                                
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
                            // If we couldn't read individual files but have stories from generations.json, use those
                            if (stories.length === 0) {
                                console.log("Falling back to fallback data");
                                stories = this.fallbackGenerations.generations;
                            }
                        }
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

            if (isToday) return `Today at ${timeStr}`;
            if (isYesterday) return `Yesterday at ${timeStr}`;
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        },
        viewStory(story) {
            localStorage.setItem("currentStory", JSON.stringify(story));
            window.location.href = "/?view=story";
        },
        deleteStory(index) {
            if (confirm("Are you sure you want to delete this story?")) {
                const story = this.generations[index];
                this.generations.splice(index, 1);
                
                // Try to update both storage methods if SDK.fs is available
                if (sdk && typeof sdk.fs?.read === 'function') {
                    // 1. Try to delete the individual file if it exists
                    if (typeof sdk.fs?.delete === 'function') {
                        try {
                            // First try using the stored file path if available
                            if (story._filePath) {
                                console.log("Attempting to delete file using stored path:", story._filePath);
                                
                                // Try to delete the file
                                sdk.fs.delete(story._filePath)
                                    .then(() => console.log("Individual story file deleted successfully using stored path"))
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
            sdk.fs.delete(`${baseFilename}.json`)
                .then(() => console.log("Individual story file deleted successfully by title"))
                .catch(err => {
                    console.log("Individual story file not found or could not be deleted by title:", err);
                    
                    // Try with counter suffixes if the base name doesn't work
                    this.tryDeleteWithCounters(safeName);
                });
        },
        
        // Try to delete files with counter suffixes
        async tryDeleteWithCounters(safeName) {
            try {
                // Try with counter suffixes (up to 5)
                for (let i = 1; i <= 5; i++) {
                    const filename = `~/AI Storyteller/${safeName}_${i}.json`;
                    console.log("Trying to delete with counter:", filename);
                    
                    try {
                        await sdk.fs.delete(filename);
                        console.log("Successfully deleted file with counter:", filename);
                        break; // Exit the loop if successful
                    } catch (err) {
                        console.log(`File with counter ${i} not found:`, err);
                    }
                }
            } catch (error) {
                console.log("Error in tryDeleteWithCounters:", error);
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
            // Use Vue Router to navigate to the create page
            this.$router.push('/create');
        }
    }
}; 