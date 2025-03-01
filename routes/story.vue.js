import { sdk } from "../sdk.js";
import i18n from "../i18n/index.js";

window.StoryPage = {
    template: `
        <div class="min-h-screen bg-[#FFF9F6]">
            <!-- Navigation -->
            <nav class="bg-white shadow-md py-4 px-4 sm:px-6 flex items-center justify-between">
                <div class="flex items-center space-x-1 sm:space-x-4 overflow-x-auto whitespace-nowrap">
                    <router-link to="/" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
                        {{ $t('ui.home') }}
                    </router-link>
                    <router-link to="/create" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
                        {{ $t('ui.new') }}
                    </router-link>
                    <router-link to="/my-stories" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
                        {{ $t('ui.myStories') }}
                    </router-link>
                </div>
                <div class="flex items-center gap-2">
                    <router-link v-if="isPreviewEnvironment" to="/_admin" class="text-[#00B7EA] hover:text-[#0284C7] text-sm sm:text-base px-2 py-1">
                        <i class="fa-solid fa-gear"></i>
                    </router-link>
                    <language-switcher></language-switcher>
                </div>
            </nav>

            <!-- Loading State -->
            <div v-if="loading" class="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
                <div class="w-16 h-16 border-4 border-[#BAE6FD] border-t-[#0284C7] rounded-full animate-spin mb-6"></div>
                <p class="text-xl text-[#0284C7] font-medium">{{ $t('story.loadingStory') }}</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[70vh]">
                <div class="bg-red-100 border border-red-300 text-red-700 px-8 py-6 rounded-xl mb-6">
                    <h3 class="text-xl font-medium mb-2">{{ $t('story.errorLoadingStory') }}</h3>
                    <p>{{ error }}</p>
                </div>
                <router-link to="/" class="bg-[#0EA5E9] text-white px-6 py-3 rounded-full hover:bg-[#0284C7] font-medium">
                    {{ $t('ui.returnHome') }}
                </router-link>
            </div>

            <!-- Story Display -->
            <main v-else class="max-w-4xl mx-auto px-6 py-12">
                <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-8">
                    <h1 class="text-3xl font-semibold text-[#00B7EA] mb-8 text-center">{{ formatTitle(story.title) }}</h1>
                    
                    <!-- Story Content -->
                    <div class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-6 mb-8">
                        <img :src="story.coverUrl" 
                             :alt="story.title" 
                             class="w-full h-64 object-cover rounded-lg mb-6" />
                        
                        <!-- Audio Player -->
                        <div class="flex items-center gap-4 mb-6">
                            <button @click="toggleAudio" class="bg-[#0EA5E9] text-white p-3 rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#0284C7] transition-colors">
                                <i :class="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                            </button>
                            <div class="flex-1 h-10 bg-[#E0F2FE] rounded-full relative cursor-pointer" @click="seekAudio($event)">
                                <div class="absolute inset-0 flex items-center px-2">
                                    <div class="h-2 bg-[#7DD3FC] rounded-full" :style="{ width: audioProgress + '%' }"></div>
                                </div>
                            </div>
                            <audio ref="audioPlayer" :src="story.audioUrl" @timeupdate="updateProgress" @ended="audioEnded"></audio>
                        </div>
                        
                        <!-- Story Text -->
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-[#005B79] mb-2">{{ $t('ui.storyText') }}</label>
                            <div class="w-full bg-white border border-gray-200 rounded-lg p-4 text-gray-700 max-h-96 overflow-y-auto">
                                <div v-if="hasHtmlContent(story.story)" v-html="story.story" class="prose prose-sky max-w-none"></div>
                                <div v-else class="whitespace-pre-wrap">{{ story.story }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <a :href="story.audioUrl" download class="bg-[#0EA5E9] text-white px-6 py-3 rounded-full hover:bg-[#0284C7] font-medium flex items-center justify-center gap-2">
                            <i class="fa-solid fa-download"></i>
                            {{ $t('ui.downloadAudio') }}
                        </a>
                        <button @click="shareStory" class="border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center justify-center gap-2">
                            <i class="fa-solid fa-share-nodes"></i>
                            {{ $t('ui.shareStory') }}
                        </button>
                        <router-link to="/create" class="border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center justify-center gap-2">
                            <i class="fa-solid fa-plus"></i>
                            {{ $t('ui.createNewStory') }}
                        </router-link>
                        <!-- Add as Example Button (Admin Only) -->
                        <button 
                            v-if="isAdmin" 
                            @click="addAsExample" 
                            class="border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center justify-center gap-2"
                            :disabled="addingAsExample"
                        >
                            <i class="fa-solid fa-bookmark"></i>
                            <span v-if="!addingAsExample">Add as Example</span>
                            <span v-else>Adding...</span>
                        </button>
                    </div>
                    
                    <!-- Example Added Message -->
                    <div v-if="exampleAddedMessage" class="mb-8 p-4 rounded-lg text-center" :class="exampleAddedMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'">
                        {{ exampleAddedMessage }}
                    </div>
                    
                    <!-- Story Settings (Collapsible) -->
                    <details class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
                        <summary class="text-[#0284C7] font-medium cursor-pointer hover:text-[#00B7EA] flex items-center">
                            <i class="fa-solid fa-gear mr-2"></i>
                            {{ $t('ui.storySettings') }}
                        </summary>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div v-if="story.childName" class="space-y-2">
                                <label class="block text-sm font-medium text-[#005B79]">{{ $t('ui.childName') }}</label>
                                <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                    {{ story.childName }}
                                </div>
                            </div>
                            
                            <div v-if="story.themes || story.interests" class="space-y-2">
                                <label class="block text-sm font-medium text-[#005B79]">{{ $t('ui.themes') }}</label>
                                <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                    {{ story.themes || story.interests }}
                                </div>
                            </div>

                            <div v-if="story.voice" class="space-y-2">
                                <label class="block text-sm font-medium text-[#005B79]">{{ $t('ui.voice') }}</label>
                                <div class="bg-white border border-gray-200 rounded-full p-2 text-lg text-gray-600 flex items-center gap-2">
                                    <img v-if="story.voice.avatar" :src="story.voice.avatar" class="w-8 h-8 rounded-full" />
                                    <span>{{ typeof story.voice === 'object' ? story.voice.name : story.voice }}</span>
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
            error: null,
            story: null,
            isPlaying: false,
            audioProgress: 0,
            fileUrl: null,
            storyIndex: null,
            BASE_FS_URL: "https://fs.webdraw.com",
            isPreviewEnvironment: false,
            isAdmin: false,
            addingAsExample: false,
            exampleAddedMessage: '',
            adminCheckInterval: null
        }
    },
    watch: {
        // Watch for route changes to reload the story when navigating between stories
        '$route.query': {
            handler(newQuery) {
                if (newQuery.file !== this.fileUrl || newQuery.index !== this.storyIndex) {
                    this.fileUrl = newQuery.file;
                    this.storyIndex = newQuery.index;
                    this.loadStory();
                }
            },
            immediate: false,
            deep: true
        }
    },
    async mounted() {
        // Get query parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.fileUrl = urlParams.get('file');
        this.storyIndex = urlParams.get('index');
        
        // Check if we're in the preview environment
        this.isPreviewEnvironment = window.location.origin.includes('preview.webdraw.app');
        
        // Check if the user is an admin (can access admin page)
        this.isAdmin = this.isPreviewEnvironment || await this.checkIfAdmin();
        
        // Periodically check admin status
        this.adminCheckInterval = setInterval(async () => {
            this.isAdmin = this.isPreviewEnvironment || await this.checkIfAdmin();
        }, 30000); // Check every 30 seconds
        
        await this.loadStory();
    },
    beforeDestroy() {
        // Clear the interval when the component is destroyed
        if (this.adminCheckInterval) {
            clearInterval(this.adminCheckInterval);
        }
    },
    methods: {
        // Check if the user is an admin
        async checkIfAdmin() {
            // First check if AdminPage is defined
            if (typeof window.AdminPage !== 'undefined') {
                return true;
            }
            
            // Then check if the user has file system access
            if (sdk && typeof sdk.fs?.read === 'function') {
                try {
                    // Try to read the translations file - only admins should have access to this
                    const translatorPath = "~/AI Storyteller/translations.json";
                    const content = await sdk.fs.read(translatorPath);
                    return !!content; // Return true if we can read the file
                } catch (error) {
                    console.warn("User doesn't have admin access:", error);
                    return false;
                }
            }
            
            return false;
        },
        async loadStory() {
            this.loading = true;
            this.error = null;
            this.story = null;
            this.isPlaying = false;
            this.audioProgress = 0;
            
            if (!this.fileUrl) {
                this.error = this.$t('story.noStorySpecified');
                this.loading = false;
                return;
            }
            
            try {
                console.log("Loading story from:", this.fileUrl);
                
                let storyData;
                
                // Check if the file path starts with ~ (indicating it's a local file path)
                if (this.fileUrl.startsWith('~') && sdk && typeof sdk.fs?.read === 'function') {
                    console.log("Loading story from local file system");
                    
                    // Read the file using the SDK
                    const content = await sdk.fs.read(this.fileUrl);
                    
                    if (!content) {
                        throw new Error(`Empty content from file: ${this.fileUrl}`);
                    }
                    
                    try {
                        const data = JSON.parse(content);
                        
                        // Check if this is a generations.json file with an index parameter
                        if (this.storyIndex !== null && data.generations && Array.isArray(data.generations)) {
                            console.log("Loading story from generations.json with index:", this.storyIndex);
                            const index = parseInt(this.storyIndex, 10);
                            if (isNaN(index) || index < 0 || index >= data.generations.length) {
                                throw new Error(this.$t('story.invalidIndex'));
                            }
                            storyData = data.generations[index];
                        } else {
                            // Direct story JSON file
                            console.log("Loading story from individual JSON file");
                            storyData = data;
                        }
                    } catch (parseError) {
                        console.error("Error parsing JSON:", parseError);
                        throw new Error(`Failed to parse story data: ${parseError.message}`);
                    }
                } else {
                    // It's a URL, fetch it
                    console.log("Loading story from URL");
                    
                    // If the URL doesn't start with http, add the base FS URL
                    let fetchUrl = this.fileUrl;
                    if (!fetchUrl.startsWith('http')) {
                        fetchUrl = `${this.BASE_FS_URL}${fetchUrl.startsWith('/') ? '' : '/'}${fetchUrl}`;
                    }
                    
                    console.log("Fetching from URL:", fetchUrl);
                    const response = await fetch(fetchUrl);
                    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch story: ${response.status} ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    
                    // Check if this is a generations.json file with an index parameter
                    if (this.storyIndex !== null && data.generations && Array.isArray(data.generations)) {
                        console.log("Loading story from generations.json with index:", this.storyIndex);
                        const index = parseInt(this.storyIndex, 10);
                        if (isNaN(index) || index < 0 || index >= data.generations.length) {
                            throw new Error(this.$t('story.invalidIndex'));
                        }
                        storyData = data.generations[index];
                    } else {
                        // Direct story JSON file
                        console.log("Loading story from individual JSON file");
                        storyData = data;
                    }
                }
                
                // Process the story data
                this.story = {
                    ...storyData,
                    // Ensure all required fields exist
                    title: storyData.title || this.$t('story.untitledStory'),
                    story: this.formatStoryText(storyData.story || (storyData.chapters ? storyData.chapters.map(ch => ch.story).join("\n\n") : this.$t('story.noStoryContent'))),
                    coverUrl: storyData.coverUrl || "https://webdraw.com/image-optimize?src=https%3A%2F%2Fai-storyteller.webdraw.app%2F.webdraw%2Fassets%2Ficon-b8a9e1bd-cf34-46f5-8f72-a98c365e9b09.png&width=200&height=200&fit=cover",
                    audioUrl: storyData.audioUrl || null
                };
                
                // Fix URLs for coverUrl and audioUrl if they're relative paths
                if (this.story.coverUrl && !this.story.coverUrl.startsWith('http') && !this.story.coverUrl.startsWith('data:')) {
                    this.story.coverUrl = `${this.BASE_FS_URL}${this.story.coverUrl.startsWith('/') ? '' : '/'}${this.story.coverUrl}`;
                }
                
                if (this.story.audioUrl && !this.story.audioUrl.startsWith('http') && !this.story.audioUrl.startsWith('data:')) {
                    this.story.audioUrl = `${this.BASE_FS_URL}${this.story.audioUrl.startsWith('/') ? '' : '/'}${this.story.audioUrl}`;
                }
                
                // Fix permissions for media files
                await this.fixMediaPermissions();
                
                this.loading = false;
                
                // Initialize audio player
                this.$nextTick(() => {
                    if (this.$refs.audioPlayer) {
                        this.$refs.audioPlayer.load();
                    }
                });
            } catch (error) {
                console.error("Error loading story:", error);
                this.error = `${this.$t('story.errorLoading')}: ${error.message}`;
                this.loading = false;
            }
        },
        
        // Fix permissions for media files
        async fixMediaPermissions() {
            try {
                // Fix permissions for cover image
                if (this.story.coverUrl) {
                    await this.fixFilePermissions(this.story.coverUrl);
                }
                
                // Fix permissions for audio file
                if (this.story.audioUrl) {
                    await this.fixFilePermissions(this.story.audioUrl);
                }
            } catch (error) {
                console.warn("Error fixing media permissions:", error);
            }
        },
        
        // Helper method to fix permissions for a file
        async fixFilePermissions(fileUrl) {
            if (!fileUrl || fileUrl.startsWith('data:')) return;
            
            try {
                // Extract the file path from the URL
                let filePath = fileUrl;
                
                // If it's a full URL, extract the path
                if (filePath.startsWith('http')) {
                    try {
                        const url = new URL(fileUrl);
                        filePath = url.pathname;
                    } catch (e) {
                        console.warn("Could not parse URL:", fileUrl);
                        return;
                    }
                }
                
                // Remove the leading ~ if present
                if (filePath.startsWith('~')) {
                    filePath = filePath.substring(1);
                }
                
                // Ensure the path doesn't start with double slashes
                while (filePath.startsWith('//')) {
                    filePath = filePath.substring(1);
                }
                
                console.log(`Setting permissions for media file: ${filePath}`);
                
                // Use 0o644 (rw-r--r--) to ensure web server can access the files
                if (sdk && typeof sdk.fs?.chmod === 'function') {
                    await sdk.fs.chmod(filePath, 0o644);
                    console.log(`Successfully set permissions (0o644) for media file: ${filePath}`);
                } else {
                    console.warn("No permission setting method available");
                }
            } catch (error) {
                console.warn(`Could not set file permissions for ${fileUrl}:`, error);
            }
        },
        toggleAudio() {
            if (!this.$refs.audioPlayer) return;
            
            if (this.isPlaying) {
                this.$refs.audioPlayer.pause();
            } else {
                this.$refs.audioPlayer.play();
            }
            
            this.isPlaying = !this.isPlaying;
        },
        updateProgress() {
            if (!this.$refs.audioPlayer) return;
            
            const player = this.$refs.audioPlayer;
            const percentage = (player.currentTime / player.duration) * 100;
            this.audioProgress = percentage;
        },
        audioEnded() {
            this.isPlaying = false;
            this.audioProgress = 0;
        },
        seekAudio(event) {
            if (!this.$refs.audioPlayer) return;
            
            const player = this.$refs.audioPlayer;
            const progressBar = event.currentTarget;
            const clickPosition = (event.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
            
            player.currentTime = clickPosition * player.duration;
            this.audioProgress = clickPosition * 100;
        },
        shareStory() {
            // Create a shareable link to this story
            const currentUrl = window.location.href;
            
            // Try to use the Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: this.story.title,
                    text: `Check out this story: ${this.story.title}`,
                    url: currentUrl
                }).catch(err => {
                    console.error('Error sharing:', err);
                    this.fallbackShare(currentUrl);
                });
            } else {
                this.fallbackShare(currentUrl);
            }
        },
        fallbackShare(url) {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(url).then(() => {
                alert(this.$t('ui.copied'));
            }).catch(err => {
                console.error('Failed to copy:', err);
                // Final fallback - show the URL to manually copy
                prompt('Copy this link to share the story:', url);
            });
        },
        formatStoryText(text) {
            if (!text) return "";
            
            // Check if the text already contains HTML formatting
            if (this.hasHtmlContent(text)) {
                return text; // Return as-is if it contains HTML
            }
            
            // Ensure proper paragraph breaks
            let formattedText = text
                // Replace single newlines with spaces (if they're not part of a paragraph break)
                .replace(/([^\n])\n([^\n])/g, '$1 $2')
                // Ensure paragraphs have proper spacing
                .replace(/\n\n+/g, '\n\n')
                // Trim extra whitespace
                .trim();
                
            return formattedText;
        },
        
        hasHtmlContent(text) {
            // Simple check for HTML tags
            return /<[a-z][\s\S]*>/i.test(text);
        },
        formatTitle(title) {
            if (!title) return this.$t('story.untitledStory');
            
            // Remove any HTML tags if present
            return title.replace(/<[^>]*>/g, '');
        },
        
        // Add current story as an example in translations.json
        async addAsExample() {
            if (!this.isAdmin || !this.story) {
                return;
            }
            
            this.addingAsExample = true;
            this.exampleAddedMessage = '';
            
            try {
                // Create example object from current story
                const newExample = {
                    title: this.story.title || "Untitled Story",
                    childName: this.story.childName || "",
                    themes: this.story.themes || this.story.interests || "",
                    voice: typeof this.story.voice === 'object' ? this.story.voice.name : (this.story.voice || ""),
                    voiceAvatar: typeof this.story.voice === 'object' ? (this.story.voice.avatar || "") : "",
                    image: this.story.coverUrl || "",
                    isPlaying: false,
                    progress: "0%"
                };
                
                // Load translations.json
                const translatorPath = "~/AI Storyteller/translations.json";
                let translations;
                
                try {
                    const content = await sdk.fs.read(translatorPath);
                    if (content) {
                        translations = JSON.parse(content);
                    } else {
                        throw new Error("Empty translations file");
                    }
                } catch (error) {
                    console.error("Error reading translations file:", error);
                    throw new Error("Failed to read translations file");
                }
                
                // Get current language
                const currentLanguage = i18n.getLanguage();
                
                // Add example to current language
                if (!translations[currentLanguage].examples) {
                    translations[currentLanguage].examples = [];
                }
                
                translations[currentLanguage].examples.push(newExample);
                
                // If adding to English, add to all other languages too
                if (currentLanguage === 'en') {
                    Object.keys(translations).forEach(langCode => {
                        if (langCode !== 'en') {
                            if (!translations[langCode].examples) {
                                translations[langCode].examples = [];
                            }
                            
                            // Add a copy of the new example to this language
                            const exampleCopy = { ...newExample };
                            translations[langCode].examples.push(exampleCopy);
                        }
                    });
                }
                
                // Save updated translations
                const jsonContent = JSON.stringify(translations, null, 2);
                await sdk.fs.write(translatorPath, jsonContent);
                
                // Update global translations
                window.i18n.translations = JSON.parse(JSON.stringify(translations));
                
                // Notify components that translations have been updated
                if (window.eventBus) {
                    window.eventBus.emit('translations-updated');
                }
                
                this.exampleAddedMessage = 'Story added as example successfully!';
                
                // Clear message after 3 seconds
                setTimeout(() => {
                    this.exampleAddedMessage = '';
                }, 3000);
                
            } catch (error) {
                console.error("Error adding story as example:", error);
                this.exampleAddedMessage = `Error: ${error.message}`;
            } finally {
                this.addingAsExample = false;
            }
        }
    }
}; 