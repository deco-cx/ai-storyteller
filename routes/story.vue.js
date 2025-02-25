import { SDK } from "https://webdraw.com/webdraw-sdk@v1";

// Initialize the SDK
const sdk = SDK;

window.StoryPage = {
    template: `
        <div class="min-h-screen bg-[#FFF9F6]">
            <!-- Navigation -->
            <nav class="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-sky-100">
                <div class="flex items-center gap-3">
                    <img src="https://webdraw.com/image-optimize?src=https%3A%2F%2Fai-storyteller.webdraw.app%2F.webdraw%2Fassets%2Ficon-b8a9e1bd-cf34-46f5-8f72-a98c365e9b09.png&width=80&height=80&fit=cover" 
                         alt="AI Storyteller Logo" 
                         class="w-10 h-10 rounded-xl object-cover" />
                    <h1 class="text-2xl font-medium text-[#006D95]">AI Storyteller</h1>
                </div>
                <router-link to="/" class="text-[#00B7EA] hover:text-[#0284C7]">
                    <i class="fa-solid fa-arrow-left mr-2"></i>Back to Home
                </router-link>
            </nav>

            <!-- Loading State -->
            <div v-if="loading" class="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
                <div class="w-16 h-16 border-4 border-[#BAE6FD] border-t-[#0284C7] rounded-full animate-spin mb-6"></div>
                <p class="text-xl text-[#0284C7] font-medium">Loading your story...</p>
            </div>

            <!-- Story Display -->
            <main v-else class="max-w-4xl mx-auto px-6 py-12">
                <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-8">
                    <h2 class="text-3xl font-semibold text-[#00B7EA] mb-8 text-center">{{ story.title }}</h2>
                    
                    <!-- Story Content -->
                    <div class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-6 mb-8">
                        <img :src="story.image" 
                             :alt="story.title" 
                             class="w-full h-64 object-cover rounded-lg mb-6" />
                        
                        <!-- Audio Player -->
                        <div class="flex items-center gap-4 mb-6">
                            <button @click="toggleAudio" class="bg-[#0EA5E9] text-white p-3 rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#0284C7] transition-colors">
                                <i :class="story.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                            </button>
                            <div class="flex-1 h-10 bg-[#E0F2FE] rounded-full relative cursor-pointer" @click="seekAudio($event)">
                                <div class="absolute inset-0 flex items-center px-2">
                                    <div class="h-2 bg-[#7DD3FC] rounded-full" :style="{ width: story.progress }"></div>
                                </div>
                            </div>
                            <audio ref="audioPlayer" :src="story.audioUrl" @timeupdate="updateProgress" @ended="audioEnded"></audio>
                        </div>
                        
                        <!-- Story Text -->
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-[#005B79] mb-2">Story Text:</label>
                            <textarea 
                                class="w-full bg-white border border-gray-200 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]" 
                                rows="4" 
                                readonly
                                style="resize: vertical; min-height: 100px;"
                            >{{ story.story }}</textarea>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button class="bg-[#0EA5E9] text-white px-6 py-3 rounded-full hover:bg-[#0284C7] font-medium flex items-center justify-center gap-2">
                            <i class="fa-solid fa-download"></i>
                            Download Story
                        </button>
                        <button class="border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center justify-center gap-2">
                            <i class="fa-solid fa-share-nodes"></i>
                            Share Story
                        </button>
                        <router-link to="/create" class="border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center justify-center gap-2">
                            <i class="fa-solid fa-plus"></i>
                            Create New Story
                        </router-link>
                    </div>
                    
                    <!-- Story Settings (Collapsible) -->
                    <details class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
                        <summary class="text-[#0284C7] font-medium cursor-pointer hover:text-[#00B7EA] flex items-center">
                            <i class="fa-solid fa-gear mr-2"></i>
                            Story Settings
                        </summary>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-[#005B79]">Child's Name:</label>
                                <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                    {{ story.childName }}
                                </div>
                            </div>
                            
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-[#005B79]">Themes:</label>
                                <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                    {{ story.themes }}
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-[#005B79]">Voice:</label>
                                <div class="bg-white border border-gray-200 rounded-full p-2 text-lg text-gray-600 flex items-center gap-2">
                                    <img :src="story.voiceAvatar" class="w-8 h-8 rounded-full" />
                                    <span>{{ story.voice }}</span>
                                </div>
                            </div>
                        </div>
                    </details>
                </div>
            </main>
        </div>
    `,
    data() {
        return {
            loading: true,
            story: null,
            dbParam: null,
            nameParam: null
        }
    },
    async mounted() {
        // Get query parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.dbParam = urlParams.get('db');
        this.nameParam = urlParams.get('name');
        
        console.log('Story params:', this.dbParam, this.nameParam);
        
        // Simulate loading
        setTimeout(() => {
            // Set static example data
            this.story = { 
                title: "The Magic Garden Adventure", 
                childName: "Sarah", 
                themes: "Nature, Magic and Friendship", 
                voice: "Fairy Godmother", 
                voiceAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jBpfuIE2acCO8z3wKNLl", 
                image: "https://ai-storyteller.webdraw.app/joe.png", 
                isPlaying: false, 
                progress: "33%", 
                audioUrl: "http://fs.webdraw.com/users/043b6c01-d97c-47e9-9285-fc4eee62b919/Audio/LinasRocketAdventure.mp3",
                story: "Once upon a time, in a small town in Brazil, lived a bright and curious boy named João Paulo. João Paulo had a deep love for antique cars. He spent hours reading about them, drawing them, and dreaming about them. One day, while exploring his grandfather's old garage, he discovered a dusty, old car covered with a tarp. To his surprise, it was a 1920 Ford Model T, a car he had only seen in his books!\n\nJoão Paulo spent days and nights fixing the old car, using the knowledge he had gained from his countless hours of reading. One night, as he turned the key in the ignition, the car started with a loud rumble, and suddenly, everything around him started to blur. When he opened his eyes, he found himself in a bustling city with people dressed in old-fashioned clothes. He had traveled back in time to the 1920s!\n\nIn this new world, João Paulo had many adventures. He met Henry Ford, the creator of his beloved Model T, and even got a chance to visit the Ford factory. He learned about the assembly line production method and how it revolutionized the automobile industry. He also helped solve a mystery of a missing car part at the factory, using his knowledge of antique cars.\n\nHowever, João Paulo started to miss his home. He realized that while the past was exciting, he belonged in his own time. So, he bid farewell to his new friends and set off in his Model T. As he turned the key in the ignition, he was transported back to his grandfather's garage.\n\nBack home, João Paulo had a newfound appreciation for his love of antique cars. He had not only read and dreamt about them, but he had also lived an adventure in one. He continued to learn and dream, knowing that knowledge could take him on the most incredible journeys. And every time he missed his adventure, he would sit in his Model T, close his eyes, and let his imagination take him back to the 1920s."
            };
            
            this.loading = false;
            
            // Initialize audio player
            if (this.$refs.audioPlayer) {
                this.$refs.audioPlayer.load();
            }
        }, 2000); // 2 second loading simulation
    },
    methods: {
        toggleAudio() {
            if (!this.$refs.audioPlayer) return;
            
            if (this.story.isPlaying) {
                this.$refs.audioPlayer.pause();
            } else {
                this.$refs.audioPlayer.play();
            }
            
            this.story.isPlaying = !this.story.isPlaying;
        },
        updateProgress() {
            if (!this.$refs.audioPlayer) return;
            
            const player = this.$refs.audioPlayer;
            const percentage = (player.currentTime / player.duration) * 100;
            this.story.progress = percentage + '%';
        },
        audioEnded() {
            this.story.isPlaying = false;
            this.story.progress = '0%';
        },
        seekAudio(event) {
            if (!this.$refs.audioPlayer) return;
            
            const player = this.$refs.audioPlayer;
            const progressBar = event.currentTarget;
            const clickPosition = (event.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
            
            player.currentTime = clickPosition * player.duration;
            this.story.progress = (clickPosition * 100) + '%';
        }
    }
}; 