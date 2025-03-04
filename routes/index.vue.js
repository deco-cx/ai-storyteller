import { sdk } from "../sdk.js";

window.IndexPage = {
    template: `
        <div class="min-h-screen bg-gradient-to-b from-[#E1F5FE] to-[#BBDEFB] pb-16 relative">
            <!-- Background image for mobile only -->
            <div class="absolute inset-0 z-0 md:hidden">
                <img src="/assets/image/bg.png" alt="Background" class="w-full h-full object-cover fixed" />
            </div>
            
            <!-- Navigation -->
            <div class="relative z-10">
                <!-- Navigation Menu -->
                <nav class="bg-white shadow-md py-3 px-4 sm:px-6">
                    <div class="flex justify-center sm:justify-start flex-wrap gap-2">
                        <router-link to="/" class="px-3 py-2 rounded-lg bg-[#4A90E2] text-white font-medium text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.home') }}
                        </router-link>
                        <router-link v-if="user" to="/create" class="px-3 py-2 rounded-lg text-[#4A90E2] hover:bg-[#F0F9FF] text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.create') }}
                        </router-link>
                        <router-link v-if="user" to="/my-stories" class="px-3 py-2 rounded-lg text-[#4A90E2] hover:bg-[#F0F9FF] text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.myStories') }}
                        </router-link>
                        <router-link v-if="isAdmin" to="/_admin" class="px-3 py-2 rounded-lg text-[#4A90E2] hover:bg-[#F0F9FF] text-sm sm:text-base flex-grow-0">
                            {{ $t('ui.admin') }}
                        </router-link>
                    </div>
                </nav>
            </div>
            
            <main class="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
                <!-- Language Selector - Centered above the title -->
                <div class="flex justify-center mb-4">
                    <language-switcher></language-switcher>
                </div>
                
                <!-- Hero Section -->
                <div class="relative rounded-3xl shadow-lg overflow-hidden mb-12 border border-[#4A90E2]">
                    <!-- Decorative Elements -->
                    <div class="absolute top-0 left-0 w-24 h-24 bg-[#4A90E2] opacity-10 rounded-full -translate-x-12 -translate-y-12"></div>
                    <div class="absolute bottom-0 right-0 w-32 h-32 bg-[#81D4FA] opacity-10 rounded-full translate-x-16 translate-y-16"></div>
                    <div class="absolute top-1/2 right-24 w-16 h-16 bg-[#64B5F6] opacity-10 rounded-full"></div>
                    
                    <div class="relative z-10 flex flex-col md:flex-row items-center p-6 md:p-10 bg-white shadow-lg rounded-xl">
                        <div class="md:w-full mb-8 md:mb-0 md:pr-8">
                            <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-tight">
                                <span class="text-[#4A90E2]">
                                    {{ $t('home.welcome') }}
                                </span>
                            </h1>
                            <p class="text-gray-600 mb-6 text-lg">{{ $t('home.tagline') }}</p>
                            
                            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                <router-link v-if="user" to="/create" class="bg-[#4A90E2] hover:bg-[#5FA0E9] text-white py-3 px-6 rounded-full font-medium transition-colors duration-200 shadow-md flex items-center justify-center">
                                    <i class="fa-solid fa-wand-magic-sparkles mr-2"></i>
                                    {{ $t('home.createButton') }}
                                </router-link>
                                
                                <button v-if="!user" @click="handleLogin" class="bg-white text-[#4A90E2] hover:bg-[#EEF6FD] border-[#4A90E2] border-2 py-3 px-6 rounded-full font-medium transition-colors duration-200 shadow-md flex items-center justify-center">
                                    <i class="fa-solid fa-user mr-2"></i>
                                    {{ $t('home.signInToCreate') }}
                                </button>
                                
                                <router-link v-else to="/my-stories" class="bg-white text-[#4A90E2] hover:bg-[#EEF6FD] border-[#4A90E2] border-2 py-3 px-6 rounded-full font-medium transition-colors duration-200 shadow-md flex items-center justify-center">
                                    <i class="fa-solid fa-book-open mr-2"></i>
                                    {{ $t('home.myStoriesButton') }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Example Stories Section -->
                <div class="mb-16">
                    <!-- Título com background estendido -->
                    <div v-if="examples && examples.length > 0" class="relative mb-12">
                        <!-- Background estendido do título - vai até metade do primeiro exemplo (apenas mobile) -->
                        <div class="absolute top-0 left-0 right-0 h-[170px] bg-[#F0F9FF] shadow-md border border-[#BBDEFB] rounded-t-2xl md:hidden"></div>
                        
                        <!-- Cabeçalho com título -->
                        <div class="relative z-10 p-6">
                            <h2 class="text-2xl font-bold text-center relative py-2">
                                <i class="fa-solid fa-book-open text-[#4A90E2] mr-2"></i>
                                <span class="inline-block text-[#4A90E2] mb-3">
                                    {{ $t('home.examples') }}
                                </span>
                                <div class="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#2871CC] via-[#4A90E2] to-[#81D4FA] rounded-full"></div>
                            </h2>
                        </div>
                    </div>
                    
                    <!-- Título quando não há exemplos -->
                    <h2 v-if="!examples || examples.length === 0" class="text-2xl font-bold mb-8 text-center relative">
                        <span class="inline-block text-[#4A90E2] mb-3">
                            {{ $t('home.examples') }}
                        </span>
                        <div class="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#2871CC] via-[#4A90E2] to-[#81D4FA] rounded-full"></div>
                    </h2>
                    
                    <!-- Grid com todos os exemplos -->
                    <div v-if="examples && examples.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <!-- Primeiro exemplo (com background abaixo dele) -->
                        <div v-if="examples.length > 0" class="relative md:col-span-2 lg:col-span-1">
                            <!-- Card normalmente é aqui -->
                            <div class="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-4 border-[#2871CC]">
                                <!-- Story Cover Image -->
                                <div class="relative h-48 overflow-hidden">
                                    <img :src="getOptimizedImageUrl(examples[0].coverImage || examples[0].image, 600, 300)" 
                                         :alt="examples[0].title" 
                                         @load="logImageLoaded(examples[0].title, examples[0].coverImage || examples[0].image)"
                                         @error="logImageError(examples[0].title, examples[0].coverImage || examples[0].image)"
                                         class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                    
                                    <!-- Decorative Elements -->
                                    <div class="absolute top-2 left-2 w-12 h-12 rounded-full bg-white bg-opacity-70 flex items-center justify-center text-[#2871CC]">
                                        <i class="fa-solid fa-book-open text-xl"></i>
                                    </div>
                                    
                                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-70"></div>
                                    <h3 class="absolute bottom-4 left-4 right-4 text-white font-bold text-xl line-clamp-2">{{ examples[0].title }}</h3>
                                </div>
                                
                                <div class="p-5">
                                    <!-- Narrator Info -->
                                    <div class="flex items-center mb-5">
                                        <div class="w-12 h-12 rounded-full overflow-hidden border-2 mr-3 border-[#4A90E2]">
                                            <img :src="getOptimizedImageUrl(examples[0].voiceAvatar, 64, 64)" 
                                                :alt="examples[0].voice" 
                                                @load="logImageLoaded(examples[0].voice, examples[0].voiceAvatar)"
                                                @error="logImageError(examples[0].voice, examples[0].voiceAvatar)"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p class="text-gray-600 text-sm">{{ $t('home.narratedBy') }}</p>
                                            <p class="font-medium">{{ examples[0].voice }}</p>
                                        </div>
                                    </div>
                                    
                                    <!-- Story Details -->
                                    <div class="mb-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <div class="flex flex-wrap gap-2 mb-2">
                                            <div v-if="examples[0].childName" class="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                                                <i class="fa-solid fa-child text-gray-600 mr-1"></i>
                                                <span>{{ examples[0].childName }}</span>
                                            </div>
                                            <div v-if="examples[0].themes" class="rounded-full px-3 py-1 text-sm flex items-center text-white bg-[#4A90E2]">
                                                <i class="fa-solid fa-lightbulb mr-1"></i>
                                                <span class="truncate max-w-[150px]">{{ examples[0].themes }}</span>
                                            </div>
                                        </div>
                                        <p v-if="examples[0].description" class="text-sm text-gray-600 line-clamp-2">{{ examples[0].description }}</p>
                                    </div>
                                    
                                    <!-- Audio Player -->
                                    <div class="flex items-center gap-3 w-full mb-4">
                                        <button @click="toggleAudio(examples[0])" 
                                                class="bg-[#2871CC] hover:bg-[#3D82D6] text-white p-3 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 transition-colors duration-200 shadow-md">
                                            <i :class="examples[0].isPlaying ? 'fa-solid fa-pause text-lg' : 'fa-solid fa-play text-lg'"></i>
                                        </button>
                                        <div class="flex-1 h-4 bg-gray-200 rounded-full relative">
                                            <div class="absolute inset-0 h-4 rounded-full bg-[#2871CC]" 
                                                :style="{ width: examples[0].progress }">
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Action Buttons -->
                                    <div class="grid grid-cols-1 gap-3 mt-4">
                                        <router-link :to="{ path: '/create', query: { themes: examples[0].themes, voiceId: examples[0].voiceId } }" 
                                                class="bg-white text-[#2871CC] hover:bg-[#EEF6FD] border-[#2871CC] shadow-[0_0_15px_rgba(40,113,204,0.15)] rounded-full py-3 px-4 flex items-center justify-center font-medium border-2 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1">
                                            <i class="fa-solid fa-magic mr-2"></i>
                                            {{ $t('home.createFromThis') }}
                                        </router-link>
                                    </div>
                                    
                                    <audio 
                                        id="audio-0" 
                                        :src="getOptimizedAudioUrl(examples[0].audio)" 
                                        @timeupdate="updateProgress($event, examples[0])" 
                                        @ended="audioEnded(examples[0])" 
                                        @canplaythrough="logAudioLoaded(examples[0].title, examples[0].audio)"
                                        @error="logAudioError(examples[0].title, examples[0].audio, $event.error)"
                                        style="display: none;"></audio>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Demais exemplos -->
                        <div v-for="(example, index) in examples.slice(1)" :key="index + 1" 
                             class="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-4"
                             :class="[
                                (index + 1) % 4 === 0 ? 'border-[#2871CC]' : '',
                                (index + 1) % 4 === 1 ? 'border-[#4A90E2]' : '',
                                (index + 1) % 4 === 2 ? 'border-[#64B5F6]' : '',
                                (index + 1) % 4 === 3 ? 'border-[#81D4FA]' : ''
                             ]">
                            <!-- Story Cover Image -->
                            <div class="relative h-48 overflow-hidden">
                                <img :src="getOptimizedImageUrl(example.coverImage || example.image, 600, 300)" 
                                     :alt="example.title" 
                                     @load="logImageLoaded(example.title, example.coverImage || example.image)"
                                     @error="logImageError(example.title, example.coverImage || example.image)"
                                     class="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                
                                <!-- Decorative Elements -->
                                <div class="absolute top-2 left-2 w-12 h-12 rounded-full bg-white bg-opacity-70 flex items-center justify-center"
                                     :class="[
                                        (index + 1) % 4 === 0 ? 'text-[#2871CC]' : '',
                                        (index + 1) % 4 === 1 ? 'text-[#4A90E2]' : '',
                                        (index + 1) % 4 === 2 ? 'text-[#64B5F6]' : '',
                                        (index + 1) % 4 === 3 ? 'text-[#81D4FA]' : ''
                                     ]">
                                    <i class="fa-solid fa-book-open text-xl"></i>
                                </div>
                                
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-70"></div>
                                <h3 class="absolute bottom-4 left-4 right-4 text-white font-bold text-xl line-clamp-2">{{ example.title }}</h3>
                            </div>
                            
                            <div class="p-5">
                                <!-- Narrator Info -->
                                <div class="flex items-center mb-5">
                                    <div class="w-12 h-12 rounded-full overflow-hidden border-2 mr-3"
                                         :class="[
                                            (index + 1) % 4 === 0 ? 'border-[#4A90E2]' : '',
                                            (index + 1) % 4 === 1 ? 'border-[#64B5F6]' : '',
                                            (index + 1) % 4 === 2 ? 'border-[#90CAF9]' : '',
                                            (index + 1) % 4 === 3 ? 'border-[#81D4FA]' : ''
                                         ]">
                                        <img :src="getOptimizedImageUrl(example.voiceAvatar, 64, 64)" 
                                             :alt="example.voice" 
                                             @load="logImageLoaded(example.voice, example.voiceAvatar)"
                                             @error="logImageError(example.voice, example.voiceAvatar)"
                                             class="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p class="text-gray-600 text-sm">{{ $t('home.narratedBy') }}</p>
                                        <p class="font-medium">{{ example.voice }}</p>
                                    </div>
                                </div>
                                
                                <!-- Story Details -->
                                <div class="mb-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div class="flex flex-wrap gap-2 mb-2">
                                        <div v-if="example.childName" class="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                                            <i class="fa-solid fa-child text-gray-600 mr-1"></i>
                                            <span>{{ example.childName }}</span>
                                        </div>
                                        <div v-if="example.themes" class="rounded-full px-3 py-1 text-sm flex items-center text-white"
                                             :class="[
                                                (index + 1) % 4 === 0 ? 'bg-[#4A90E2]' : '',
                                                (index + 1) % 4 === 1 ? 'bg-[#64B5F6]' : '',
                                                (index + 1) % 4 === 2 ? 'bg-[#90CAF9]' : '',
                                                (index + 1) % 4 === 3 ? 'bg-[#81D4FA]' : ''
                                             ]">
                                            <i class="fa-solid fa-lightbulb mr-1"></i>
                                            <span class="truncate max-w-[150px]">{{ example.themes }}</span>
                                        </div>
                                    </div>
                                    <p v-if="example.description" class="text-sm text-gray-600 line-clamp-2">{{ example.description }}</p>
                                </div>
                                
                                <!-- Audio Player -->
                                <div class="flex items-center gap-3 w-full mb-4">
                                    <button @click="toggleAudio(example)" 
                                            :class="[
                                                (index + 1) % 4 === 0 ? 'bg-[#2871CC] hover:bg-[#3D82D6]' : '',
                                                (index + 1) % 4 === 1 ? 'bg-[#4A90E2] hover:bg-[#5FA0E9]' : '',
                                                (index + 1) % 4 === 2 ? 'bg-[#64B5F6] hover:bg-[#7BC4FF]' : '',
                                                (index + 1) % 4 === 3 ? 'bg-[#81D4FA] hover:bg-[#99E0FF]' : ''
                                            ]"
                                            class="text-white p-3 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 transition-colors duration-200 shadow-md">
                                        <i :class="example.isPlaying ? 'fa-solid fa-pause text-lg' : 'fa-solid fa-play text-lg'"></i>
                                    </button>
                                    <div class="flex-1 h-4 bg-gray-200 rounded-full relative">
                                        <div class="absolute inset-0 h-4 rounded-full" 
                                             :style="{ width: example.progress }"
                                             :class="[
                                                (index + 1) % 4 === 0 ? 'bg-[#2871CC]' : '',
                                                (index + 1) % 4 === 1 ? 'bg-[#4A90E2]' : '',
                                                (index + 1) % 4 === 2 ? 'bg-[#64B5F6]' : '',
                                                (index + 1) % 4 === 3 ? 'bg-[#81D4FA]' : ''
                                             ]"></div>
                                    </div>
                                </div>
                                
                                <!-- Action Buttons -->
                                <div class="grid grid-cols-1 gap-3 mt-4">
                                    <router-link :to="{ path: '/create', query: { themes: example.themes, voiceId: example.voiceId } }" 
                                            :class="[
                                                (index + 1) % 4 === 0 ? 'bg-white text-[#2871CC] hover:bg-[#EEF6FD] border-[#2871CC] shadow-[0_0_15px_rgba(40,113,204,0.15)]' : '',
                                                (index + 1) % 4 === 1 ? 'bg-white text-[#4A90E2] hover:bg-[#EEF6FD] border-[#4A90E2] shadow-[0_0_15px_rgba(74,144,226,0.15)]' : '',
                                                (index + 1) % 4 === 2 ? 'bg-white text-[#64B5F6] hover:bg-[#EEF6FD] border-[#64B5F6] shadow-[0_0_15px_rgba(100,181,246,0.15)]' : '',
                                                (index + 1) % 4 === 3 ? 'bg-white text-[#81D4FA] hover:bg-[#EEF6FD] border-[#81D4FA] shadow-[0_0_15px_rgba(129,212,250,0.15)]' : ''
                                            ]"
                                            class="rounded-full py-3 px-4 flex items-center justify-center font-medium border-2 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1">
                                        <i class="fa-solid fa-magic mr-2"></i>
                                        {{ $t('home.createFromThis') }}
                                    </router-link>
                                </div>
                                
                                <audio 
                                    :id="'audio-' + (index + 1)" 
                                    :src="getOptimizedAudioUrl(example.audio)" 
                                    @timeupdate="updateProgress($event, example)" 
                                    @ended="audioEnded(example)" 
                                    @canplaythrough="logAudioLoaded(example.title, example.audio)"
                                    @error="logAudioError(example.title, example.audio, $event.error)"
                                    style="display: none;"></audio>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Empty State -->
                    <div v-if="!examples || examples.length === 0" class="bg-white rounded-3xl p-8 text-center shadow-lg border-4 border-dashed border-[#64B5F6]">
                        <div class="w-24 h-24 mx-auto mb-4 bg-[#F0F9FF] rounded-full flex items-center justify-center">
                            <i class="fa-solid fa-book text-[#4A90E2] text-4xl"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-700 mb-2">{{ $t('home.noExamples') }}</h3>
                        <p class="text-gray-600">{{ $t('home.checkBackSoon') }}</p>
                    </div>
                </div>
                
                <!-- Features Section -->
                <div class="mt-16 space-y-8">
                    <h2 class="text-2xl font-bold mb-8 text-center relative bg-white p-4 rounded-xl shadow-sm">
                        <span class="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#4A90E2] via-[#64B5F6] to-[#81D4FA] mb-3">
                            {{ $t('home.featuresTitle') }}
                        </span>
                        <div class="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#4A90E2] via-[#64B5F6] to-[#81D4FA] rounded-full"></div>
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white border-4 border-[#4A90E2] rounded-3xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div class="w-16 h-16 mx-auto mb-4 bg-[#F0F9FF] rounded-full flex items-center justify-center">
                                <i class="fa-solid fa-child text-[#4A90E2] text-2xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-[#4A90E2] mb-3 text-center">{{ $t('home.feature1Title') }}</h3>
                            <p class="text-gray-600 text-center">{{ $t('home.feature1Text') }}</p>
                        </div>
                        <div class="bg-white border-4 border-[#64B5F6] rounded-3xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div class="w-16 h-16 mx-auto mb-4 bg-[#F0F9FF] rounded-full flex items-center justify-center">
                                <i class="fa-solid fa-headphones text-[#64B5F6] text-2xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-[#64B5F6] mb-3 text-center">{{ $t('home.feature2Title') }}</h3>
                            <p class="text-gray-600 text-center">{{ $t('home.feature2Text') }}</p>
                        </div>
                        <div class="bg-white border-4 border-[#81D4FA] rounded-3xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div class="w-16 h-16 mx-auto mb-4 bg-[#F0F9FF] rounded-full flex items-center justify-center">
                                <i class="fa-solid fa-image text-[#81D4FA] text-2xl"></i>
                            </div>
                            <h3 class="text-xl font-semibold text-[#81D4FA] mb-3 text-center">{{ $t('home.feature3Title') }}</h3>
                            <p class="text-gray-600 text-center">{{ $t('home.feature3Text') }}</p>
                        </div>
                    </div>
                </div>
                
                <!-- How It Works Section -->
                <div class="mt-16 space-y-8">
                    <h2 class="text-2xl font-bold mb-8 text-center relative bg-white p-4 rounded-xl shadow-sm">
                        <span class="inline-block text-[#4A90E2] mb-3">
                            {{ $t('home.howItWorksTitle') }}
                        </span>
                        <div class="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#2871CC] via-[#4A90E2] to-[#81D4FA] rounded-full"></div>
                    </h2>
                    
                    <div class="relative">
                        <!-- Connecting Line -->
                        <div class="absolute top-24 left-1/2 w-2 bg-gradient-to-b from-[#2871CC] via-[#4A90E2] to-[#81D4FA] h-3/4 -translate-x-1/2 hidden md:block"></div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <!-- Step 1 -->
                            <div class="bg-white rounded-3xl p-6 shadow-lg border-4 border-[#2871CC] relative z-10">
                                <div class="absolute -top-5 -left-5 w-10 h-10 bg-[#2871CC] text-white rounded-full flex items-center justify-center font-bold text-xl">1</div>
                                <div class="flex items-center mb-4">
                                    <div class="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mr-4">
                                        <i class="fa-solid fa-user-pen text-[#2871CC] text-2xl"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-[#2871CC]">{{ $t('home.step1') }}</h3>
                                </div>
                                <div class="pl-20">
                                    <p class="text-gray-600">{{ $t('home.step1Description') }}</p>
                                </div>
                            </div>
                            
                            <!-- Step 2 -->
                            <div class="bg-white rounded-3xl p-6 shadow-lg border-4 border-[#4A90E2] relative z-10 md:mt-16">
                                <div class="absolute -top-5 -left-5 w-10 h-10 bg-[#4A90E2] text-white rounded-full flex items-center justify-center font-bold text-xl">2</div>
                                <div class="flex items-center mb-4">
                                    <div class="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mr-4">
                                        <i class="fa-solid fa-microphone text-[#4A90E2] text-2xl"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-[#4A90E2]">{{ $t('home.step2') }}</h3>
                                </div>
                                <div class="pl-20">
                                    <p class="text-gray-600">{{ $t('home.narratorDescription') }}</p>
                                </div>
                            </div>
                            
                            <!-- Step 3 -->
                            <div class="bg-white rounded-3xl p-6 shadow-lg border-4 border-[#64B5F6] relative z-10">
                                <div class="absolute -top-5 -left-5 w-10 h-10 bg-[#64B5F6] text-white rounded-full flex items-center justify-center font-bold text-xl">3</div>
                                <div class="flex items-center mb-4">
                                    <div class="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mr-4">
                                        <i class="fa-solid fa-wand-magic-sparkles text-[#64B5F6] text-2xl"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-[#64B5F6]">{{ $t('home.step3') }}</h3>
                                </div>
                                <div class="pl-20">
                                    <p class="text-gray-600">{{ $t('home.step3Description') }}</p>
                                </div>
                            </div>
                            
                            <!-- Step 4 -->
                            <div class="bg-white rounded-3xl p-6 shadow-lg border-4 border-[#81D4FA] relative z-10 md:mt-16">
                                <div class="absolute -top-5 -left-5 w-10 h-10 bg-[#81D4FA] text-white rounded-full flex items-center justify-center font-bold text-xl">4</div>
                                <div class="flex items-center mb-4">
                                    <div class="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mr-4">
                                        <i class="fa-solid fa-share-nodes text-[#81D4FA] text-2xl"></i>
                                    </div>
                                    <h3 class="text-xl font-semibold text-[#81D4FA]">{{ $t('home.step4') }}</h3>
                                </div>
                                <div class="pl-20">
                                    <p class="text-gray-600">{{ $t('home.step4Description') }}</p>
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
            user: null,
            examples: [],
            isPreviewEnvironment: false,
            isAdmin: false,
            refreshKey: 0, // Add a refresh key to force component re-render
            _loggedImages: {}, // Track already logged images
            _loggedAudios: {}, // Track already logged audios
            preloadedAudios: {} // Track preloaded audio files
        }
    },
    async mounted() {
        try {
            this.user = await sdk.getUser();
        } catch (error) {
            console.error("Error getting user:", error);
            this.user = null;
        }
        
        // Ensure we have all the necessary translation keys
        this.ensureTranslationKeys();
        
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
                
                // Preload all audio files
                this.preloadAudios();
                
            } else if (window.i18n.translations && window.i18n.translations.en && window.i18n.translations.en.examples) {
                // Fallback to English if current language doesn't have examples
                this.examples = window.i18n.translations.en.examples;
                
                // Debug: Log examples to check for missing audio properties
                console.log("Using English examples fallback:", this.examples.length);
                this.examples.forEach((example, index) => {
                    console.log(`Example ${index}: "${example.title}" - Audio: ${example.audio || 'MISSING'}`);
                });
                
                // Preload all audio files
                this.preloadAudios();
                
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
        
        // Ensure all necessary translation keys exist
        ensureTranslationKeys() {
            // Define default translations for new UI elements
            const requiredTranslations = {
                'home.narratedBy': 'Narrated by',
                'home.listenStory': 'Listen to Story',
                'home.pauseStory': 'Pause Story',
                'home.noExamples': 'No example stories yet',
                'home.checkBackSoon': 'Check back soon for example stories!',
                'home.createFromThis': 'Create from this',
                'home.step1Description': 'Enter your child\'s name and select themes they love for a personalized story experience.',
                'home.step3Description': 'Our AI crafts a magical story featuring your child and their interests in moments.',
                'home.step4Description': 'Enjoy the story together, save it to your collection, and share it with family and friends.'
            };
            
            // Portuguese translations for the new keys
            const ptTranslations = {
                'home.step1Description': 'Digite o nome do seu filho e selecione temas que ele ama para uma experiência de história personalizada.',
                'home.step3Description': 'Nossa IA cria uma história mágica com seu filho e seus interesses em poucos momentos.',
                'home.step4Description': 'Aproveite a história juntos, salve-a em sua coleção e compartilhe com familiares e amigos.'
            };
            
            // Add translations if they don't exist
            if (window.i18n && window.i18n.translations) {
                const currentLang = window.i18n.getLanguage();
                
                // For each language
                Object.keys(window.i18n.translations).forEach(lang => {
                    // For each required translation
                    Object.entries(requiredTranslations).forEach(([key, defaultValue]) => {
                        // Get the key parts (e.g., ['home', 'narratedBy'])
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
            
            // Ensure all necessary translation keys exist
            this.ensureTranslationKeys();
            
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
                
                // Reset tracking objects when examples change
                this._loggedImages = {};
                this._loggedAudios = {};
                
                // Preload audio files after examples are updated
                this.preloadAudios();
                
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
            
            // For local development, use ai-storytest.webdraw.app as the base URL
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // If it's a local file path, prefix with the test site URL
                if (!processedUrl.startsWith('http')) {
                    processedUrl = `https://ai-storytest.webdraw.app${processedUrl}`;
                }
                // Use the webdraw.com image optimization service for testing
                return `https://webdraw.com/image-optimize?src=${encodeURIComponent(processedUrl)}&width=${width}&height=${height}&fit=cover`;
            }
            
            // For production, if it's a local file path (including /assets/...), add the current site's origin
            if (!processedUrl.startsWith('http')) {
                // This will correctly handle paths like "/assets/image/ex2.png"
                processedUrl = `${window.location.origin}${processedUrl}`;
            }
            
            // Use the webdraw.com image optimization service for production
            const finalUrl = `https://webdraw.com/image-optimize?src=${encodeURIComponent(processedUrl)}&width=${width}&height=${height}&fit=cover`;
            return finalUrl;
        },
        getOptimizedAudioUrl(url) {
            if (url.startsWith('/')) return url;
            
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
                // Check if we need to try different URL formats based on preloaded status
                let audioUrl = this.getOptimizedAudioUrl(example.audio);
                const directPath = example.audio.startsWith('/') ? example.audio : '/' + example.audio;
                const fullPath = window.location.origin + directPath;
                
                // Use URL that was successfully preloaded, if available
                if (this.preloadedAudios[audioUrl]) {
                    console.log(`Using preloaded optimized URL for "${example.title}"`);
                } else if (this.preloadedAudios[directPath]) {
                    console.log(`Using preloaded direct path for "${example.title}"`);
                    audioUrl = directPath;
                } else if (this.preloadedAudios[fullPath]) {
                    console.log(`Using preloaded full path for "${example.title}"`);
                    audioUrl = fullPath;
                }
                
                // Set the source and play
                audioElement.src = audioUrl;
                
                // Try to play the audio
                audioElement.play()
                    .then(() => {
                        example.isPlaying = true;
                        console.log(`Playing audio: "${example.title}"`);
                    })
                    .catch(error => {
                        console.error(`Error playing audio: "${example.title}"`, error);
                        
                        // If we haven't tried the direct path yet, try it now
                        if (audioUrl !== directPath) {
                            audioElement.src = directPath;
                            
                            audioElement.play()
                                .then(() => {
                                    example.isPlaying = true;
                                    console.log(`Playing audio (direct path): "${example.title}"`);
                                })
                                .catch(directError => {
                                    // If we haven't tried the full path yet, try it now
                                    if (audioUrl !== fullPath && directPath !== fullPath) {
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
                                    } else {
                                        console.error(`Could not play audio: "${example.title}"`);
                                        alert(`Could not play audio for "${example.title}". The audio file may be missing or inaccessible.`);
                                    }
                                });
                        } else if (audioUrl !== fullPath) {
                            // Try full path directly if we already tried direct path
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
                        } else {
                            console.error(`Could not play audio: "${example.title}"`);
                            alert(`Could not play audio for "${example.title}". The audio file may be missing or inaccessible.`);
                        }
                    });
            } catch (error) {
                console.error(`Error attempting to play audio: "${example.title}"`, error);
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
        },
        preloadAudios() {
            console.log("Starting audio preloading...");
            if (!this.examples || this.examples.length === 0) {
                console.log("No examples to preload audio for");
                return;
            }
            
            this.examples.forEach((example, index) => {
                if (!example.audio) {
                    console.log(`Example ${index}: "${example.title}" - No audio to preload`);
                    return;
                }
                
                try {
                    // Get optimized URL
                    const optimizedUrl = this.getOptimizedAudioUrl(example.audio);
                    
                    // Skip if already preloaded
                    if (this.preloadedAudios[optimizedUrl]) {
                        console.log(`Audio for "${example.title}" already preloaded`);
                        return;
                    }
                    
                    // Create a new Audio element for preloading
                    const audioLoader = new Audio();
                    
                    // Set up event listeners
                    audioLoader.addEventListener('canplaythrough', () => {
                        console.log(`Audio preloaded successfully: "${example.title}"`);
                        this.preloadedAudios[optimizedUrl] = true;
                    });
                    
                    audioLoader.addEventListener('error', (error) => {
                        console.error(`Error preloading audio for "${example.title}":`, error);
                        
                        // Try with direct path if optimized path fails
                        const directPath = example.audio.startsWith('/') ? example.audio : '/' + example.audio;
                        const directLoader = new Audio();
                        
                        directLoader.addEventListener('canplaythrough', () => {
                            console.log(`Audio preloaded successfully (direct path): "${example.title}"`);
                            this.preloadedAudios[directPath] = true;
                        });
                        
                        directLoader.addEventListener('error', (directError) => {
                            console.error(`Error preloading audio (direct path) for "${example.title}":`, directError);
                            
                            // Try with full path as last resort
                            const fullPath = window.location.origin + directPath;
                            const fullPathLoader = new Audio();
                            
                            fullPathLoader.addEventListener('canplaythrough', () => {
                                console.log(`Audio preloaded successfully (full path): "${example.title}"`);
                                this.preloadedAudios[fullPath] = true;
                            });
                            
                            fullPathLoader.addEventListener('error', (fullPathError) => {
                                console.error(`Failed to preload audio for "${example.title}" after all attempts`);
                            });
                            
                            fullPathLoader.src = fullPath;
                            fullPathLoader.load();
                        });
                        
                        directLoader.src = directPath;
                        directLoader.load();
                    });
                    
                    // Start loading
                    audioLoader.src = optimizedUrl;
                    audioLoader.load();
                    
                    console.log(`Started preloading audio for "${example.title}": ${optimizedUrl}`);
                } catch (error) {
                    console.error(`Exception while trying to preload audio for "${example.title}":`, error);
                }
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
    },
    computed: {
        // Add any computed properties if needed
    },
    created() {
        // Add button styles to the document
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .btn-primary {
                background-image: linear-gradient(to right, #2871CC, #4A90E2);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 9999px;
                font-weight: 500;
                transition: all 0.3s ease;
                border: 2px solid #2871CC;
                box-shadow: 0 4px 6px rgba(74, 144, 226, 0.2);
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 8px rgba(74, 144, 226, 0.3);
            }
            
            .btn-secondary {
                background-color: white;
                color: #4A90E2;
                padding: 0.75rem 1.5rem;
                border-radius: 9999px;
                font-weight: 500;
                transition: all 0.3s ease;
                border: 2px solid #4A90E2;
                box-shadow: 0 4px 6px rgba(74, 144, 226, 0.1);
            }
            
            .btn-secondary:hover {
                background-color: #EEF6FD;
                transform: translateY(-2px);
                box-shadow: 0 6px 8px rgba(74, 144, 226, 0.2);
            }
        `;
        document.head.appendChild(styleEl);
    }
}; 

// Export for module systems while maintaining window compatibility
export default window.IndexPage; 