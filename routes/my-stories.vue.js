import { SDK } from "https://webdraw.com/webdraw-sdk@v1";

// Initialize the SDK
const sdk = SDK;

window.MyStoriesPage = {
    template: `
        <div class="min-h-screen bg-white">
            <!-- Navigation -->
            <nav class="flex items-center px-6 py-4">
                <div class="flex items-center gap-3">
                    <button @click="goBack" class="text-[#006D95]">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <img src="https://webdraw.com/image-optimize?src=https%3A%2F%2Fai-storyteller.webdraw.app%2F.webdraw%2Fassets%2Ficon-b8a9e1bd-cf34-46f5-8f72-a98c365e9b09.png&width=80&height=80&fit=cover" 
                         alt="AI Storyteller Logo" 
                         class="w-8 h-8 rounded-xl object-cover" />
                    <h1 class="text-lg font-medium text-[#006D95]">AI Storyteller</h1>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="px-6 py-6">
                <!-- Search Bar -->
                <div class="mb-8">
                    <div class="relative max-w-xl mx-auto">
                        <input 
                            v-model="searchQuery"
                            type="text" 
                            placeholder="Search"
                            class="w-full px-5 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] pl-12 bg-white"
                        />
                        <i class="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <button 
                            v-if="searchQuery" 
                            @click="searchQuery = ''" 
                            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="flex justify-center items-center py-20">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B7EA]"></div>
                </div>

                <!-- Stories Grid -->
                <div v-else class="grid grid-cols-3 lg:grid-cols-4 gap-6">
                    <div v-for="(story, index) in filteredGenerations" :key="index" @click="viewStory(story)" class="cursor-pointer">
                        <!-- Cover Image with Book Texture -->
                        <div 
                            class="relative mb-3 overflow-hidden rounded-r md:rounded-r-lg lg:rounded-r-xl aspect-[98/111.1] w-full shadow-[0_10px_3px_rgba(22,109,149,0),0_6px_3px_rgba(22,109,149,0.03),0_4px_2px_rgba(22,109,149,0.1),0_2px_2px_rgba(22,109,149,0.17),0_1px_1px_rgba(22,109,149,0.2)]"
                        >
                            <img 
                                :src="story.coverUrl" 
                                :alt="story.title" 
                                class="w-full h-full object-cover absolute inset-0"
                            >
                            <div class="absolute inset-0 bg-[url('/assets/book-texture.svg')] bg-cover bg-no-repeat opacity-30 mix-blend-multiply pointer-events-none"></div>
                        </div>
                        
                        <!-- Title -->
                        <h3 class="text-[#006D95] text-xs md:text-sm font-medium">{{ story.title }}</h3>
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
                noSearchResults: "No stories found matching your search.",
            },
            // Fallback data when SDK.fs is not available
            fallbackGenerations: {
                generations: [
                    {
                        "title":
                            "João Paulo and the Time-Traveling Antique Car",
                        "coverUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/carros_antigos_disney_pixar_illustration.webp",
                        "excerpt":
                            "Once upon a time, in a small town in Brazil, lived a bright and curious boy named João Paulo. João P...",
                        "story":
                            "Once upon a time, in a small town in Brazil, lived a bright and curious boy named João Paulo. João Paulo had a deep love for antique cars. He spent hours reading about them, drawing them, and dreaming about them. One day, while exploring his grandfather's old garage, he discovered a dusty, old car covered with a tarp. To his surprise, it was a 1920 Ford Model T, a car he had only seen in his books!\n\nJoão Paulo spent days and nights fixing the old car, using the knowledge he had gained from his countless hours of reading. One night, as he turned the key in the ignition, the car started with a loud rumble, and suddenly, everything around him started to blur. When he opened his eyes, he found himself in a bustling city with people dressed in old-fashioned clothes. He had traveled back in time to the 1920s!\n\nIn this new world, João Paulo had many adventures. He met Henry Ford, the creator of his beloved Model T, and even got a chance to visit the Ford factory. He learned about the assembly line production method and how it revolutionized the automobile industry. He also helped solve a mystery of a missing car part at the factory, using his knowledge of antique cars.\n\nHowever, João Paulo started to miss his home. He realized that while the past was exciting, he belonged in his own time. So, he bid farewell to his new friends and set off in his Model T. As he turned the key in the ignition, he was transported back to his grandfather's garage.\n\nBack home, João Paulo had a newfound appreciation for his love of antique cars. He had not only read and dreamt about them, but he had also lived an adventure in one. He continued to learn and dream, knowing that knowledge could take him on the most incredible journeys. And every time he missed his adventure, he would sit in his Model T, close his eyes, and let his imagination take him back to the 1920s.",
                        "audioUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/JoaoPauloTimeTravelingAntiqueCarStory.mp3",
                        "createdAt": 1740086746,
                    },
                    {
                        "title": "Lina e a Aventura do Respeito",
                        "coverUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/illustration_respeitar_outros_disney_pixar.webp",
                        "excerpt":
                            "Era uma vez uma menina chamada Lina que vivia em uma pequena cidade chamada Harmonia. Lina era conhe...",
                        "story":
                            "Era uma vez uma menina chamada Lina que vivia em uma pequena cidade chamada Harmonia. Lina era conhecida por todos por sua gentileza e respeito pelos outros. Ela acreditava que todos mereciam ser tratados com bondade e consideração, independentemente de quem fossem ou de onde viessem. Um dia, Lina ouviu falar de uma pedra mágica que concedia um desejo a quem a encontrasse. Ela decidiu embarcar em uma aventura para encontrar essa pedra, pois queria que todos no mundo respeitassem uns aos outros.\n\nLina começou sua jornada através de florestas densas, montanhas altas e rios largos. Em cada lugar que passava, ela encontrava criaturas de todos os tipos. Algumas eram amigáveis, outras nem tanto. Mas Lina tratava todas com o mesmo respeito e gentileza. Ela ouvia suas histórias, ajudava quando podia e sempre se despedida com um sorriso. As criaturas ficavam tão impressionadas com a bondade de Lina que decidiam ajudá-la em sua busca pela pedra mágica.\n\nDepois de muitos dias e noites, Lina finalmente chegou ao local onde a pedra mágica estava escondida. Mas para sua surpresa, a pedra estava sendo guardada por um enorme dragão. O dragão era conhecido por ser muito mal-humorado e não gostava de visitantes. Mas Lina, em vez de ter medo, se aproximou do dragão com respeito e gentileza. Ela explicou sua missão e pediu permissão para pegar a pedra.\n\nO dragão, que nunca tinha sido tratado com tanto respeito antes, ficou surpreso e comovido. Ele permitiu que Lina pegasse a pedra mágica. Quando Lina pegou a pedra, ela fez seu desejo: que todos no mundo aprendessem a importância do respeito e tratassem uns aos outros com bondade e consideração.\n\nLina voltou para casa, e a notícia de sua aventura se espalhou. As pessoas começaram a tratar umas às outras com mais respeito, assim como Lina havia desejado. E assim, Lina não apenas encontrou a pedra mágica, mas também ajudou a tornar o mundo um lugar mais respeitoso e gentil.",
                        "audioUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/lina_aventura_do_respeito.mp3",
                        "createdAt": 1740087909,
                    },
                    {
                        "title": "A Aventura de Lina no Sítio Encantado",
                        "coverUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/StoryIllustration_Sitio_DisneyPixarStyle_1.webp",
                        "excerpt":
                            "Era uma vez uma menina chamada Lina que adorava visitar o sítio de seus avós. Um dia, enquanto explo...",
                        "story":
                            "Era uma vez uma menina chamada Lina que adorava visitar o sítio de seus avós. Um dia, enquanto explorava o pomar, ela encontrou uma pequena porta escondida atrás de uma árvore. Curiosa como sempre, Lina decidiu abrir a porta e se viu em um mundo completamente diferente, um sítio encantado cheio de cores vibrantes e criaturas mágicas.\n\nNo sítio encantado, Lina conheceu uma fada chamada Luzia que precisava de ajuda para encontrar uma fruta mágica que poderia salvar sua árvore encantada de uma praga. Lina, sempre disposta a ajudar, aceitou a missão e, com um mapa nas mãos, partiu em uma aventura pelo sítio encantado.\n\nA jornada foi cheia de desafios. Lina teve que resolver enigmas, atravessar um rio de chocolate e escalar uma montanha de marshmallow. Mas com coragem e determinação, ela conseguiu superar todos os obstáculos. No topo da montanha, Lina encontrou a fruta mágica.\n\nCom a fruta mágica em mãos, Lina voltou para a árvore encantada. Luzia usou a fruta para curar a árvore, e o sítio encantado voltou a brilhar. Lina foi celebrada como a heroína do dia e aprendeu que com coragem e determinação, podemos superar qualquer desafio.\n\nQuando Lina voltou para o sítio de seus avós, ela percebeu que a aventura tinha sido um sonho. Mas o sorriso em seu rosto e a coragem em seu coração eram muito reais. Lina aprendeu que a aventura e a magia podem estar em qualquer lugar, até mesmo em um simples sítio, se apenas usarmos nossa imaginação.",
                        "audioUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/lina_aventura_sitio_encantado.mp3",
                        "createdAt": 1740096703,
                    },
                    {
                        "title": "Lina e a Aventura da Divisão",
                        "coverUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Pictures/dividir_amigos_escola_ilustracao.webp",
                        "excerpt":
                            "Era uma vez uma menina chamada Lina que adorava dividir tudo com seus amigos na escola. Ela dividia ...",
                        "story":
                            "Era uma vez uma menina chamada Lina que adorava dividir tudo com seus amigos na escola. Ela dividia seus lanches, seus brinquedos e até mesmo seus segredos. Lina acreditava que dividir era uma maneira de mostrar amor e cuidado pelos outros. Um dia, Lina encontrou uma pedra mágica que podia conceder um desejo. Ela decidiu que queria compartilhar essa magia com seus amigos.\n\nLina levou a pedra mágica para a escola no dia seguinte. Ela reuniu todos os seus amigos e contou-lhes sobre a pedra. Todos ficaram muito animados e começaram a pensar em todos os desejos que poderiam fazer. Lina, no entanto, lembrou a todos que eles só tinham um desejo e que precisavam decidir juntos o que desejariam.\n\nOs amigos de Lina começaram a discutir entre si sobre o que deveriam desejar. Alguns queriam desejos egoístas, enquanto outros queriam desejos que beneficiariam a todos. Lina ficou triste ao ver seus amigos discutindo e decidiu que precisava encontrar uma maneira de resolver a situação. Ela pensou e pensou, e finalmente teve uma ideia.\n\nLina sugeriu que todos fizessem um desejo que pudesse ser compartilhado por todos. Ela explicou que, se todos desejassem algo que pudesse ser dividido, todos se beneficiariam. Os amigos de Lina concordaram com a ideia e começaram a pensar em desejos que poderiam ser compartilhados. Depois de muita discussão, eles finalmente decidiram desejar um dia de diversão e aventura que todos pudessem desfrutar juntos.\n\nA pedra mágica concedeu o desejo e todos os amigos de Lina passaram um dia incrível juntos. Eles tiveram aventuras emocionantes, riram muito e criaram memórias que durariam a vida toda. No final do dia, todos agradeceram a Lina por compartilhar a pedra mágica com eles. Lina sorriu e disse que estava feliz por ter podido dividir algo tão especial com seus amigos. E assim, Lina aprendeu que dividir não é apenas sobre coisas materiais, mas também sobre experiências e momentos felizes.",
                        "audioUrl":
                            "https://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/lina_aventura_divisao.mp3",
                        "createdAt": 1740096782,
                    },
                ],
            },
        };
    },
    computed: {
        filteredGenerations() {
            if (!this.searchQuery.trim()) {
                return this.generations;
            }

            const query = this.searchQuery.toLowerCase().trim();
            return this.generations.filter((story) => {
                const titleMatch = story.title &&
                    story.title.toLowerCase().includes(query);
                const storyMatch = story.story &&
                    story.story.toLowerCase().includes(query);
                return titleMatch || storyMatch;
            });
        },
    },
    async mounted() {
        this.loadGenerations();
    },
    methods: {
        async loadGenerations() {
            try {
                let data;

                // Check if running on localhost
                const isLocalhost = window.location.hostname === "localhost" ||
                    window.location.hostname === "127.0.0.1";

                // Use fallback data if on localhost or if SDK.fs is not available
                if (isLocalhost) {
                    console.log("Running on localhost, using fallback data");
                    data = this.fallbackGenerations;
                } else if (sdk && typeof sdk.fs?.read === "function") {
                    const content = await sdk.fs.read(
                        "~/AI Storyteller/generations.json",
                    );
                    data = JSON.parse(content);
                } else {
                    // Fallback to local variable if SDK.fs is not available
                    console.log("SDK.fs not available, using fallback data");
                    data = this.fallbackGenerations;
                }

                this.generations = data.generations
                    .map((gen) => ({
                        ...gen,
                        story: gen.story ||
                            (gen.chapters
                                ? gen.chapters.map((ch) => ch.story).join(
                                    "\n\n",
                                )
                                : ""),
                    }))
                    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                console.log("Loaded generations:", this.generations.length);
            } catch (error) {
                console.error("Error loading generations:", error);
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
                this.generations.splice(index, 1);

                // Try to update the file if SDK.fs is available
                if (sdk && typeof sdk.fs?.write === "function") {
                    this.saveGenerations();
                } else {
                    // Update fallback data if SDK.fs is not available
                    this.fallbackGenerations.generations = [
                        ...this.generations,
                    ];
                    console.log("SDK.fs not available, updated fallback data");
                }
            }
        },
        async saveGenerations() {
            try {
                // First read the current file to get the complete structure
                const content = await sdk.fs.read(
                    "~/AI Storyteller/generations.json",
                );
                const data = JSON.parse(content);

                // Update only the generations array
                data.generations = [...this.generations];

                // Write back to the file
                await sdk.fs.write(
                    "~/AI Storyteller/generations.json",
                    JSON.stringify(data, null, 2),
                );
                console.log("Generations saved successfully");
            } catch (error) {
                console.error("Error saving generations:", error);
            }
        },
        goToNewStory() {
            // Use Vue Router to navigate to the create page
            this.$router.push("/create");
        },
        goBack() {
            window.history.back();
        },
    },
};
