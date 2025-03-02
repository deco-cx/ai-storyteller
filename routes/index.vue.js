import { sdk } from "../sdk.js";

window.IndexPage = {
    template: `
        <div class="min-h-screen bg-[#FFF9F6]">
            <!-- Navigation -->
            <nav class="bg-white shadow-md py-4 px-4 sm:px-6 flex items-center justify-between">
                <div class="flex items-center space-x-1 sm:space-x-4 overflow-x-auto whitespace-nowrap">
                    <router-link to="/" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-[#E0F2FE] text-[#0284C7] font-medium text-sm sm:text-base">
                        {{ $t('ui.home') }}
                    </router-link>
                    <router-link to="/create" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
                        {{ $t('ui.new') }}
                    </router-link>
                    <router-link to="/my-stories" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
                        {{ $t('ui.myStories') }}
                    </router-link>
                    <router-link v-if="isAdmin" to="/_admin" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
                        <i class="fa-solid fa-gear mr-1"></i>
                        {{ $t('ui.admin') }}
                    </router-link>
                </div>
                <div class="flex items-center gap-2">
                    <router-link v-if="isPreviewEnvironment" to="/_admin" class="text-[#00B7EA] hover:text-[#0284C7] text-sm sm:text-base px-2 py-1">
                        <i class="fa-solid fa-gear"></i>
                    </router-link>
                    <language-switcher></language-switcher>
                </div>
            </nav>

            <!-- Hero Section -->
            <main class="max-w-4xl mx-auto px-6 py-12 text-center">
                <h2 class="text-5xl font-semibold mb-4 text-[#00B7EA]">{{ $t('home.welcome') }}</h2>
                <p class="text-xl text-gray-600 mb-8">{{ $t('home.tagline') }}</p>
                
                <div class="flex flex-col gap-2 items-center mb-16">
                    <template v-if="user">
                        <router-link to="/create" class="text-lg bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                            <i class="fa-solid fa-book-open"></i>
                            {{ $t('home.createButton') }}
                        </router-link>
                        <router-link to="/my-stories" class="text-lg border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                            <i class="fa-solid fa-book"></i>
                            {{ $t('home.myStoriesButton') }}
                        </router-link>
                    </template>
                    <template v-else>
                        <button @click="handleLogin" class="text-lg bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                            <i class="fa-solid fa-book-open"></i>
                            {{ $t('home.signInToCreate') }}
                        </button>
                        <p class="text-lg text-[#00B7EA] font-medium mt-2">{{ $t('home.freeStories') }}</p>
                    </template>
                </div>

                <!-- Example Stories -->
                <div class="space-y-8">
                    <h2 class="text-2xl font-bold text-white bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] py-3 rounded-full shadow-lg shadow-blue-100">{{ $t('home.examples') }}</h2>
                    
                    <!-- Story Cards -->
                    <div v-for="(example, index) in examples" :key="index" class="space-y-6">
                        <div class="relative flex items-start">
                            <!-- Avatar Circle -->
                            <div class="absolute left-0 top-6 w-16 h-16 rounded-full border-2 border-[#0F766E] overflow-hidden z-10">
                                <img :src="getOptimizedImageUrl(example.voiceAvatar, 64, 64)" 
                                     :alt="example.voice" 
                                     class="w-full h-full object-cover" />
                            </div>
                            
                            <!-- Card Content -->
                            <div class="ml-8 flex-1 bg-gradient-to-b from-[#99F6E4] to-[#2DD4BF] border border-[#0D9488] rounded-xl p-6 pl-10 shadow-md">
                                <h3 class="text-[#0F766E] font-normal text-sm mb-4">{{ example.title }}</h3>
                                
                                <!-- Audio Player -->
                                <div class="flex items-center gap-2 w-full">
                                    <button @click="toggleAudio(example)" class="bg-[#0F766E] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                        <i :class="example.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i>
                                    </button>
                                    <div class="flex-1 h-2 bg-[#F1F5F9] rounded-full relative">
                                        <div class="absolute inset-0 h-2 bg-[#0F766E] rounded-full" :style="{ width: example.progress }"></div>
                                    </div>
                                </div>
                                
                                <!-- Action Button -->
                                <div class="mt-4">
                                    <button @click="toggleAudio(example)" class="w-full bg-[#5AE7D1] bg-opacity-20 border border-[#0D9488] text-[#0F766E] rounded-full py-2 px-4 flex items-center justify-center">
                                        <i class="fa-solid fa-play mr-2"></i>
                                        {{ $t('home.listenAgain') }}
                                    </button>
                                </div>
                                
                                <audio 
                                    :id="'audio-' + index" 
                                    :src="getOptimizedAudioUrl(example.audio)" 
                                    @timeupdate="updateProgress($event, example)" 
                                    @ended="audioEnded(example)" 
                                    @canplaythrough="logAudioLoaded(example.title, example.audio)"
                                    @error="logAudioError(example.title, example.audio, $event.error)"
                                    style="display: none;"></audio>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Features Section -->
                <div class="mt-16 space-y-8">
                    <h2 class="text-2xl font-bold text-white bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#0284C7] py-3 rounded-full shadow-lg shadow-blue-100">{{ $t('home.featuresTitle') }}</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6">
                            <h3 class="text-xl font-semibold text-[#00B7EA] mb-3">{{ $t('home.feature1Title') }}</h3>
                            <p class="text-gray-600">{{ $t('home.feature1Text') }}</p>
                        </div>
                        <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6">
                            <h3 class="text-xl font-semibold text-[#00B7EA] mb-3">{{ $t('home.feature2Title') }}</h3>
                            <p class="text-gray-600">{{ $t('home.feature2Text') }}</p>
                        </div>
                        <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6">
                            <h3 class="text-xl font-semibold text-[#00B7EA] mb-3">{{ $t('home.feature3Title') }}</h3>
                            <p class="text-gray-600">{{ $t('home.feature3Text') }}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `,
    data() {
        return {
            user: null,
            examples: [],
            isPreviewEnvironment: false,
            isAdmin: false,
            refreshKey: 0, // Add a refresh key to force component re-render
            _loggedImages: {}, // Track already logged images
            _loggedAudios: {} // Track already logged audios
        }
    },
    async mounted() {
        try {
            this.user = await sdk.getUser();
        } catch (error) {
            console.error("Error getting user:", error);
            this.user = null;
        }
        
        // Log the contents of translations.json on startup
        try {
            if (sdk && typeof sdk.fs?.read === 'function') {
                console.log("Current working directory:", await sdk.fs.cwd());
                const translatorPath = "~/AI Storyteller/translations.json";
                try {
                    const translationsContent = await sdk.fs.read(translatorPath);
                    console.log("Translator file content on startup:", translationsContent ? "Content loaded successfully" : "No content");
                    console.log("First 500 characters:", translationsContent ? translationsContent.substring(0, 500) : "N/A");
                } catch (readError) {
                    console.log("Translator file doesn't exist yet:", readError.message);
                }
            } else {
                console.log("SDK.fs.read is not available, cannot read translator file");
            }
        } catch (error) {
            console.error("Error reading translator file on startup:", error);
        }
        
        // Get examples from translations for the current language
        try {
            const currentLang = window.i18n.getLanguage();
            
            // Check if translations are loaded
            if (!window.i18n || !window.i18n.translations) {
                console.log("Translations not loaded yet, will wait for them");
                // Set up a listener for translations loaded event
                if (window.eventBus) {
                    window.eventBus.on('translations-loaded', this.handleTranslationsLoaded);
                }
                return;
            }
            
            if (window.i18n.translations && window.i18n.translations[currentLang] && window.i18n.translations[currentLang].examples) {
                this.examples = window.i18n.translations[currentLang].examples;
                
                // Debug: Log examples to check for missing audio properties
                console.log("Examples loaded:", this.examples.length);
                this.examples.forEach((example, index) => {
                    console.log({example});
                    console.log(`Example ${index}: "${example.title}" - Audio: ${example.audio || 'MISSING'}`);
                });
                
            } else if (window.i18n.translations && window.i18n.translations.en && window.i18n.translations.en.examples) {
                // Fallback to English if current language doesn't have examples
                this.examples = window.i18n.translations.en.examples;
                
                // Debug: Log examples to check for missing audio properties
                console.log("Examples loaded (fallback to English):", this.examples.length);
                this.examples.forEach((example, index) => {
                    console.log(`Example ${index}: "${example.title}" - Audio: ${example.audio || 'MISSING'}`);
                });
                
            } else {
                console.error("No examples found in translations");
                this.examples = [];
            }
            
            // Ensure all examples have the required properties
            this.examples = this.examples.map(example => {
                return {
                    ...example,
                    isPlaying: false,
                    progress: '0%',
                    // Ensure audio property exists
                    audio: example.audio || null
                };
            });
            
            this._loggedImages = {};
            this._loggedAudios = {};
        } catch (error) {
            console.error("Error setting up examples:", error);
            this.examples = [];
        }
        
        // Check if we're in the preview environment
        this.isPreviewEnvironment = window.location.origin.includes('preview.webdraw.app');
        
        // Check if we can access the translator.json file
        await this.checkTranslatorAccess();
        
        // Listen for translations loaded event
        if (window.eventBus) {
            window.eventBus.on('translations-loaded', this.handleTranslationsLoaded);
            window.eventBus.on('translations-updated', this.handleTranslationsLoaded);
        }
        
        // Force refresh if translations are already loaded
        if (window.translationsLoaded) {
            this.handleTranslationsLoaded();
        }
    },
    methods: {
        handleLogin() {
            sdk.redirectToLogin({ appReturnUrl: '?goToCreate=true' });
        },
        
        logImageLoaded(title, originalSrc) {
            if (!this._loggedImages[originalSrc]) {
                console.log(`Image loaded successfully: "${title}"`);
                this._loggedImages[originalSrc] = true;
            }
        },
        
        logImageError(title, originalSrc) {
            console.error(`Failed to load image: "${title}"`);
        },
        
        async checkTranslatorAccess() {
            try {
                // Check if we can read and write to the ~/AI Storyteller/translations.json file
                if (sdk && typeof sdk.fs?.read === 'function' && typeof sdk.fs?.write === 'function') {
                    const translatorPath = "~/AI Storyteller/translations.json";
                    let content;
                    
                    try {
                        // Try to read the file
                        content = await sdk.fs.read(translatorPath);
                        console.log("Translator file exists and can be read");
                        
                        // Try to write the file (write the same content back)
                        await sdk.fs.write(translatorPath, content);
                        
                        // If we get here, we have read and write access
                        this.isAdmin = true;
                        console.log("Admin access granted - ~/AI Storyteller/translations.json can be read and written");
                    } catch (readError) {
                        // File doesn't exist or can't be read
                        console.log("Translator file doesn't exist or can't be read:", readError.message);
                        this.isAdmin = false;
                    }
                }
            } catch (error) {
                console.log("Not showing admin menu - ~/AI Storyteller/translations.json cannot be accessed:", error);
                this.isAdmin = false;
            }
        },
        
        // Handle translations loaded event
        handleTranslationsLoaded() {
            console.log("Translations loaded/updated, refreshing IndexPage component");
            
            // Update examples if needed
            try {
                const currentLang = window.i18n.getLanguage();
                
                if (window.i18n.translations && window.i18n.translations[currentLang] && window.i18n.translations[currentLang].examples) {
                    this.examples = window.i18n.translations[currentLang].examples;
                    
                    // Debug: Log examples to check for missing audio properties
                    console.log("Examples updated:", this.examples.length);
                    this.examples.forEach((example, index) => {
                        console.log(`Example ${index}: "${example.title}" - Audio: ${example.audio || 'MISSING'}`);
                    });
                    
                } else if (window.i18n.translations && window.i18n.translations.en && window.i18n.translations.en.examples) {
                    // Fallback to English if current language doesn't have examples
                    this.examples = window.i18n.translations.en.examples;
                    
                    // Debug: Log examples to check for missing audio properties
                    console.log("Examples updated (fallback to English):", this.examples.length);
                    this.examples.forEach((example, index) => {
                        console.log(`Example ${index}: "${example.title}" - Audio: ${example.audio || 'MISSING'}`);
                    });
                }
                
                // Ensure all examples have the required properties
                this.examples = this.examples.map(example => {
                    return {
                        ...example,
                        isPlaying: false,
                        progress: '0%',
                        // Ensure audio property exists
                        audio: example.audio || null
                    };
                });
                
                this._loggedImages = {};
                this._loggedAudios = {};
            } catch (error) {
                console.error("Error updating examples after translations loaded:", error);
            }
            
            // Force component re-render by incrementing the refresh key
            this.refreshKey++;
            this.$forceUpdate();
        },
        getOptimizedImageUrl(url, width, height) {
            if (!url || url.startsWith('data:')) return url;
            
            // Ensure the URL has the correct format
            let processedUrl = url;
            
            // If the URL is not absolute and doesn't start with a slash, add a slash
            if (!url.startsWith('http') && !url.startsWith('/')) {
                processedUrl = '/' + url;
            }
            
            // For local development, use the image directly
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return processedUrl;
            }
            
            // Use the webdraw.com image optimization service for production
            const finalUrl = `https://webdraw.com/image-optimize?src=${encodeURIComponent(processedUrl)}&width=${width}&height=${height}&fit=cover`;
            return finalUrl;
        },
        getOptimizedAudioUrl(url) {
            if (!url || url.startsWith('data:')) return url;
            
            // Ensure the URL has the correct format
            let processedUrl = url;
            
            // If the URL is not absolute and doesn't start with a slash, add a slash
            if (!url.startsWith('http') && !url.startsWith('/')) {
                processedUrl = '/' + url;
            }
            
            // For local development, use the audio directly
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return processedUrl;
            }
            
            // For production, use the full URL
            if (!processedUrl.startsWith('http')) {
                processedUrl = `https://fs.webdraw.com${processedUrl.startsWith('/') ? '' : '/'}${processedUrl}`;
            }
            
            return processedUrl;
        },
        toggleAudio(example) {
            // Find the audio element
            const audioId = 'audio-' + this.examples.indexOf(example);
            const audioElement = document.getElementById(audioId);
            
            if (!audioElement) {
                console.error('Audio element not found:', audioId);
                return;
            }
            
            // If this example is already playing, pause it
            if (example.isPlaying) {
                audioElement.pause();
                example.isPlaying = false;
                return;
            }
            
            // Pause any other playing audio
            this.examples.forEach(ex => {
                if (ex !== example && ex.isPlaying) {
                    const otherAudioId = 'audio-' + this.examples.indexOf(ex);
                    const otherAudioElement = document.getElementById(otherAudioId);
                    if (otherAudioElement) {
                        otherAudioElement.pause();
                        ex.isPlaying = false;
                    }
                }
            });
            
            // Play this audio
            try {
                // Make sure the audio source is set correctly
                const optimizedUrl = this.getOptimizedAudioUrl(example.audio);
                if (audioElement.src !== optimizedUrl) {
                    audioElement.src = optimizedUrl;
                }
                
                // Try to play the audio
                audioElement.play()
                    .then(() => {
                        example.isPlaying = true;
                        console.log(`Playing audio: "${example.title}"`);
                    })
                    .catch(error => {
                        console.error(`Error playing audio: "${example.title}"`);
                        
                        // Try with a direct path if it fails
                        const directPath = example.audio.startsWith('/') ? example.audio : '/' + example.audio;
                        audioElement.src = directPath;
                        
                        audioElement.play()
                            .then(() => {
                                example.isPlaying = true;
                                console.log(`Playing audio (direct path): "${example.title}"`);
                            })
                            .catch(directError => {
                                // Try one more approach - use the full path
                                const fullPath = window.location.origin + directPath;
                                audioElement.src = fullPath;
                                
                                audioElement.play()
                                    .then(() => {
                                        example.isPlaying = true;
                                        console.log(`Playing audio (full path): "${example.title}"`);
                                    })
                                    .catch(fullPathError => {
                                        console.error(`Could not play audio: "${example.title}"`);
                                        alert(`Could not play audio for "${example.title}". The audio file may be missing or inaccessible.`);
                                    });
                            });
                    });
            } catch (error) {
                console.error(`Error attempting to play audio: "${example.title}"`);
            }
        },
        
        updateProgress(event, example) {
            const audioElement = event.target;
            if (audioElement && !isNaN(audioElement.duration)) {
                const percentage = (audioElement.currentTime / audioElement.duration) * 100;
                example.progress = percentage + '%';
            }
        },
        
        audioEnded(example) {
            example.isPlaying = false;
            example.progress = '0%';
        },
        logAudioLoaded(title, originalSrc) {
            // Only log once for each audio
            if (!this._loggedAudios[originalSrc]) {
                console.log(`Audio loaded successfully: "${title}"`);
                this._loggedAudios[originalSrc] = true;
            }
        },
        
        logAudioError(title, originalSrc, error) {
            console.error(`Failed to load audio: "${title}"`, {
                source: originalSrc,
                error: error ? error.message : 'Unknown error'
            });
        }
    },
    beforeUnmount() {
        // Clean up event listeners
        if (window.eventBus && window.eventBus.events) {
            if (window.eventBus.events['translations-loaded']) {
                const index = window.eventBus.events['translations-loaded'].indexOf(this.handleTranslationsLoaded);
                if (index !== -1) {
                    window.eventBus.events['translations-loaded'].splice(index, 1);
                }
            }
            
            if (window.eventBus.events['translations-updated']) {
                const index = window.eventBus.events['translations-updated'].indexOf(this.handleTranslationsLoaded);
                if (index !== -1) {
                    window.eventBus.events['translations-updated'].splice(index, 1);
                }
            }
        }
        
        // Stop any playing audio
        this.examples.forEach(example => {
            if (example.isPlaying) {
                const audioId = 'audio-' + this.examples.indexOf(example);
                const audioElement = document.getElementById(audioId);
                if (audioElement) {
                    audioElement.pause();
                    example.isPlaying = false;
                }
            }
        });
    }
}; 