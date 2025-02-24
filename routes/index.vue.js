import { SDK } from "https://webdraw.com/webdraw-sdk@v1";

// Initialize the SDK
const sdk = SDK;

window.IndexPage = {
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

            <!-- Hero Section -->
            <main class="max-w-4xl mx-auto px-6 py-12 text-center">
                <h2 class="text-5xl font-semibold mb-4 text-[#00B7EA]">Create bedtime stories for your kids with one click!</h2>
                <p class="text-xl text-gray-600 mb-8">Transform your ideas into captivating stories with the power of artificial intelligence.</p>
                
                <div class="flex flex-col gap-2 items-center mb-16">
                    <template v-if="user">
                        <router-link to="/create" class="text-lg bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                            <i class="fa-solid fa-book-open"></i>
                            Create new story!
                        </router-link>
                        <router-link to="/stories" class="text-lg border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                            <i class="fa-solid fa-book"></i>
                            My stories
                        </router-link>
                    </template>
                    <template v-else>
                        <button @click="handleLogin" class="text-lg bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                            <i class="fa-solid fa-book-open"></i>
                            Sign in to create a story
                        </button>
                        <p class="text-lg text-[#00B7EA] font-medium mt-2">3 stories for free</p>
                    </template>
                </div>

                <!-- Example Stories -->
                <div class="space-y-8">
                    <h2 class="text-2xl font-bold text-white bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] py-3 rounded-full shadow-lg shadow-blue-100">Examples</h2>
                    
                    <!-- Story Cards -->
                    <div v-for="(example, index) in examples" :key="index" class="space-y-6">
                        <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-8">
                            <h3 class="text-2xl font-semibold text-[#00B7EA] mb-6">{{ example.title }}</h3>
                            
                            <!-- Story Settings -->
                            <div class="space-y-6 mb-12">
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#005B79]">Child's Name:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                        {{ example.childName }}
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#005B79]">Themes:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                        {{ example.themes }}
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#005B79]">Voice:</label>
                                    <div class="bg-white border border-gray-200 rounded-full p-2 text-lg text-gray-600 flex items-center gap-2">
                                        <img :src="example.voiceAvatar" class="w-8 h-8 rounded-full" />
                                        <span>{{ example.voice }}</span>
                                        <button class="ml-auto bg-blue-600 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center">
                                            <i class="fa-solid fa-play text-sm"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Separator -->
                            <div class="flex items-center gap-4 mb-12">
                                <div class="h-px bg-[#BAE6FD] flex-1"></div>
                                <span class="text-lg font-semibold text-[#0284C7]">Result</span>
                                <div class="h-px bg-[#BAE6FD] flex-1"></div>
                            </div>

                            <!-- Generated Content -->
                            <div class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
                                <img :src="example.image" 
                                     :alt="example.title" 
                                     class="w-full h-48 object-cover rounded-lg mb-4" />
                                
                                <!-- Audio Player -->
                                <div class="flex items-center gap-4">
                                    <button class="bg-[#0EA5E9] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                                        <i :class="example.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                                    </button>
                                    <div class="flex-1 h-8 bg-[#E0F2FE] rounded-full relative">
                                        <div class="absolute inset-0 flex items-center px-2">
                                            <div class="h-1 bg-[#7DD3FC] rounded-full" :style="{ width: example.progress }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-if="user">
                            <router-link to="/create" class="bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm mx-auto justify-center">
                                <i class="fa-solid fa-book-open"></i>
                                Create new story!
                            </router-link>
                        </template>
                        <template v-else>
                            <button @click="handleLogin" class="bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm mx-auto justify-center">
                                <i class="fa-solid fa-book-open"></i>
                                Sign in to create a story
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Pricing Section -->
                <div class="mt-24">
                    <h2 class="text-2xl font-bold text-white bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] py-3 rounded-full shadow-lg shadow-blue-100 mb-12">Pricing</h2>
                    
                    <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-8 max-w-2xl mx-auto">
                        <div class="space-y-6">
                            <div class="flex items-center justify-between pb-4 border-b border-[#BAE6FD]">
                                <div>
                                    <h3 class="text-xl font-semibold text-[#00B7EA] mb-1">Story Generation</h3>
                                    <p class="text-gray-600">Per story (including image and audio)</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-2xl font-bold text-[#0284C7]">$0.50</p>
                                    <p class="text-sm text-gray-500">in Webdraw Credits</p>
                                </div>
                            </div>

                            <div class="bg-[#F0F9FF] rounded-xl p-6">
                                <h4 class="text-lg font-medium text-[#0284C7] mb-4">What's included:</h4>
                                <ul class="space-y-3">
                                    <li class="flex items-center gap-3 text-gray-600">
                                        <i class="fa-solid fa-check text-[#0EA5E9]"></i>
                                        Custom story based on your inputs
                                    </li>
                                    <li class="flex items-center gap-3 text-gray-600">
                                        <i class="fa-solid fa-check text-[#0EA5E9]"></i>
                                        AI-generated illustration
                                    </li>
                                    <li class="flex items-center gap-3 text-gray-600">
                                        <i class="fa-solid fa-check text-[#0EA5E9]"></i>
                                        Professional voice narration
                                    </li>
                                </ul>
                            </div>

                            <div class="text-center text-gray-600">
                                <p>Powered by <span class="text-[#0284C7] font-medium">Webdraw Credits</span></p>
                                <p class="text-sm mt-1">Add credits to your account anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `,
    data() {
        return {
            user: null,
            examples: [
                {
                    title: "Pablo the Knight and the Desert Oasis",
                    childName: "Pablo",
                    themes: "Knights, Desert and Telling the Truth",
                    voice: "Granny Mabel",
                    voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
                    image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
                    isPlaying: true,
                    progress: "100%"
                },
                {
                    title: "The Magic Garden Adventure",
                    childName: "Sarah",
                    themes: "Nature, Magic and Friendship",
                    voice: "Fairy Godmother",
                    voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
                    image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
                    isPlaying: false,
                    progress: "33%"
                },
                {
                    title: "The Space Explorer's Journey",
                    childName: "Alex",
                    themes: "Space, Discovery and Courage",
                    voice: "Space Captain",
                    voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
                    image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
                    isPlaying: false,
                    progress: "66%"
                }
            ]
        }
    },
    async mounted() {
        // this.user = await sdk.getUser();
        this.user = { }
    },
    methods: {
        handleLogin() {
            sdk.redirectToLogin({ appReturnUrl: '?goToCreate=true' });
        }
    }
}; 