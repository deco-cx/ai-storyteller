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
                        <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-8">
                            <h3 class="text-2xl font-semibold text-[#00B7EA] mb-6">{{ example.title }}</h3>
                            
                            <!-- Story Settings -->
                            <div class="space-y-6 mb-12">
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#005B79]">{{ $t('create.nameLabel') }}:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                        {{ example.childName }}
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#005B79]">{{ $t('create.interestsLabel') }}:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-lg text-gray-600">
                                        {{ example.themes }}
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-sm font-medium text-[#005B79]">{{ $t('create.voiceLabel') }}:</label>
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
                                <span class="text-lg font-semibold text-[#0284C7]">{{ $t('home.result') }}</span>
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
                                            <div class="h-2 bg-[#0EA5E9] rounded-full" :style="{ width: example.progress }"></div>
                                        </div>
                                    </div>
                                </div>
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
            isPreviewEnvironment: false
        }
    },
    async mounted() {
        try {
            this.user = await sdk.getUser();
        } catch (error) {
            console.error("Error getting user:", error);
            this.user = null;
        }
        
        // Get examples from translations for the current language
        try {
            const currentLang = window.i18n.getLanguage();
            
            if (window.i18n.translations && window.i18n.translations[currentLang] && window.i18n.translations[currentLang].examples) {
                this.examples = window.i18n.translations[currentLang].examples;
            } else if (window.i18n.translations && window.i18n.translations.en && window.i18n.translations.en.examples) {
                // Fallback to English if current language doesn't have examples
                this.examples = window.i18n.translations.en.examples;
            } else {
                console.error("No examples found in translations");
                this.examples = [];
            }
        } catch (error) {
            console.error("Error setting up examples:", error);
            this.examples = [];
        }
        
        // Check if we're in the preview environment
        this.isPreviewEnvironment = window.location.origin.includes('preview.webdraw.app');
    },
    methods: {
        handleLogin() {
            sdk.redirectToLogin({ appReturnUrl: '?goToCreate=true' });
        }
    }
}; 