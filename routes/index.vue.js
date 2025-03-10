import { sdk } from "../sdk.js";

window.IndexPage = {
  template: `
        <div class="min-h-screen bg-gradient-to-b from-[#E1F5FE] to-[#BBDEFB] pb-16 relative">
            <!-- Background image for mobile only -->
            <div class="absolute inset-0 z-0 md:hidden">
                <img src="/assets/image/bg.webp" alt="Background" class="w-full h-full object-cover fixed" />
            </div>
            
            <!-- Fixed full-height gradient overlay that transitions to white -->
            <div class="absolute inset-0 z-0 bg-gradient-to-b from-white/10 to-white from-0% to-40% h-screen pointer-events-none"></div>
            <!-- White background for content below screen height -->
            <div class="absolute top-[100vh] left-0 right-0 bottom-0 bg-white z-0 pointer-events-none"></div>
                    
            <!-- Navigation -->
            <div class="relative z-10">
                <!-- Navigation Menu -->
                <nav class="py-3 px-4 sm:px-6">
                    <div class="flex justify-between items-center">
                        <!-- Language Switcher - Moved to top left -->
                        <div class="flex-shrink-0">
                            <language-switcher></language-switcher>
                        </div>
                        
                        <!-- My Stories Button - Styled like CTA button but smaller -->
                        <router-link v-if="user" to="/my-stories" @click="trackMyStoriesClick" class="flex justify-center items-center gap-1 py-2 px-4 w-auto min-w-[120px] h-10 bg-gradient-to-b from-purple-300 to-purple-500 border border-purple-700 rounded-full cursor-pointer shadow-md hover:translate-y-[-2px] transition-transform duration-200 font-['Onest'] font-medium text-sm text-white">
                            <span class="flex items-center justify-center">
                                <i class="fa-solid fa-book"></i>
                            </span>
                            {{ $t('ui.myStories') }}
                        </router-link>
                    </div>
                </nav>
            </div>
            
            <main class="max-w-7xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
                <!-- Hero Section -->
                <div class="relative z-10 flex flex-col items-center gap-6 max-w-[342px] md:max-w-[500px] mx-auto py-2 px-6 mb-16">                      
                        <!-- Main heading -->
                        <h1 class="font-['Onest'] font-medium text-3xl md:text-4xl leading-[0.93] tracking-tight text-slate-700 text-center m-0">{{ $t('home.welcome') }}</h1>
                        
                        <!-- CTA section -->
                        <div class="flex flex-col items-center w-full gap-2">
                            <button @click="trackCreateStoryClick(); user ? $router.push('/create') : handleLogin()" class="flex justify-center items-center gap-2 py-3 px-6 w-full md:w-auto md:min-w-[250px] h-12 bg-gradient-to-b from-purple-300 to-purple-500 border border-purple-700 rounded-full cursor-pointer shadow-md hover:translate-y-[-2px] transition-transform duration-200 font-['Onest'] font-medium text-lg text-white">
                                <span class="flex items-center justify-center">
                                    <img src="assets/image/book-icon.svg" alt="Book Icon" />
                                </span>
                                {{ $t('home.createButton') }}
                            </button>
                            <p class="font-['Onest'] font-normal text-xs leading-[1.67] text-slate-500 m-0">{{ $t('home.tryItNow') }}</p>
                        </div>
                    </div>
                <!-- Example Stories Section -->
                <div>                    
                    <!-- Grid com todos os exemplos -->
                    <div v-if="examples && examples.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <!-- Cards de exemplo -->
                        <div v-for="(example, index) in examples" :key="index" 
                             class="rounded-3xl transform transition-all duration-300 hover:-translate-y-2 shadow-md relative"
                             :class="[
                                index % 4 === 0 ? 'bg-gradient-to-b from-teal-200 to-teal-400 border border-teal-700' : '',
                                index % 4 === 1 ? 'bg-gradient-to-b from-purple-200 to-purple-400 border border-purple-700' : '',
                                index % 4 === 2 ? 'bg-gradient-to-b from-amber-200 to-amber-400 border border-amber-700' : '',
                                index % 4 === 3 ? 'bg-gradient-to-b from-blue-200 to-blue-400 border border-blue-700' : ''
                             ]">
                            <div class="pt-24 p-4 pb-2">
                                <!-- Story Info & Details -->
                                <div class="flex flex-col gap-4 mb-4 mt-8">
                                    <!-- Child's Name Tag -->
                                    <div class="flex flex-col gap-1">
                                        <div class="font-bold text-sm"
                                             :class="[
                                                 index % 4 === 0 ? 'text-teal-900' : '',
                                                 index % 4 === 1 ? 'text-purple-900' : '',
                                                 index % 4 === 2 ? 'text-amber-900' : '',
                                                 index % 4 === 3 ? 'text-blue-900' : ''
                                             ]">{{ $t('ui.childName') }}</div>
                                        <div class="text-sm"
                                             :class="[
                                                 index % 4 === 0 ? 'text-teal-800' : '',
                                                 index % 4 === 1 ? 'text-purple-800' : '',
                                                 index % 4 === 2 ? 'text-amber-800' : '',
                                                 index % 4 === 3 ? 'text-blue-800' : ''
                                             ]">{{ example.childName || 'Pablo' }}</div>
                                    </div>
                                    
                                    <!-- Themes Tag -->
                                    <div class="flex flex-col gap-1">
                                        <div class="font-bold text-sm"
                                             :class="[
                                                 index % 4 === 0 ? 'text-teal-900' : '',
                                                 index % 4 === 1 ? 'text-purple-900' : '',
                                                 index % 4 === 2 ? 'text-amber-900' : '',
                                                 index % 4 === 3 ? 'text-blue-900' : ''
                                             ]">{{ $t('ui.themes') }}</div>
                                        <div class="text-sm"
                                             :class="[
                                                 index % 4 === 0 ? 'text-teal-800' : '',
                                                 index % 4 === 1 ? 'text-purple-800' : '',
                                                 index % 4 === 2 ? 'text-amber-800' : '',
                                                 index % 4 === 3 ? 'text-blue-800' : ''
                                             ]">{{ example.themes || 'Knights, Desert and Telling the Truth' }}</div>
                                    </div>
                                    
                                    <!-- Narrated By Tag -->
                                    <div class="flex flex-col gap-1">
                                        <div class="font-bold text-sm"
                                             :class="[
                                                 index % 4 === 0 ? 'text-teal-900' : '',
                                                 index % 4 === 1 ? 'text-purple-900' : '',
                                                 index % 4 === 2 ? 'text-amber-900' : '',
                                                 index % 4 === 3 ? 'text-blue-900' : ''
                                             ]">{{ $t('home.narratedBy') }}</div>
                                        <div class="flex items-center gap-1"
                                             :class="[
                                                 index % 4 === 0 ? 'text-teal-800' : '',
                                                 index % 4 === 1 ? 'text-purple-800' : '',
                                                 index % 4 === 2 ? 'text-amber-800' : '',
                                                 index % 4 === 3 ? 'text-blue-800' : ''
                                             ]">
                                            <div class="w-5 h-5 overflow-hidden rounded-full">
                                                <img :src="getOptimizedImageUrl(example.voiceAvatar, 32, 32)" 
                                                    :alt="example.voice" 
                                                    class="w-full h-full object-cover" />
                                            </div>
                                            <span class="text-sm">{{ example.voice }}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Story Title and Play Button -->
                                <div class="absolute top-5 right-4 flex items-center gap-4 pl-40">
                                    <h3 class="font-bold text-lg leading-tight"
                                         :class="[
                                             index % 4 === 0 ? 'text-teal-900' : '',
                                             index % 4 === 1 ? 'text-purple-900' : '',
                                             index % 4 === 2 ? 'text-amber-900' : '',
                                             index % 4 === 3 ? 'text-blue-900' : ''
                                         ]">{{ example.title }}</h3>
                                    <button @click="toggleAudio(example)" 
                                            class="rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 transition-all duration-200 text-white shadow-md"
                                            :class="[
                                                index % 4 === 0 ? 'bg-teal-800' : '',
                                                index % 4 === 1 ? 'bg-purple-800' : '',
                                                index % 4 === 2 ? 'bg-amber-800' : '',
                                                index % 4 === 3 ? 'bg-blue-800' : ''
                                            ]">
                                        <i v-if="example.loading" class="fa-solid fa-spinner fa-spin"></i>
                                        <i v-else :class="[example.isPlaying ? 'fa-solid fa-stop' : 'fa-solid fa-play']"></i>
                                    </button>
                                </div>
                                
                                <audio 
                                    :id="'audio-' + index" 
                                    :src="getOptimizedAudioUrl(example.audio)" 
                                    @timeupdate="updateProgress($event, example)" 
                                    @ended="audioEnded(example)" 
                                    @canplaythrough="logAudioLoaded(example.title, example.audio)" 
                                    @error="logAudioError(example.title, example.audio, $event)" 
                                    preload="none"></audio>
                                
                                <!-- Create from this button - Updated to match the play button color -->
                                <div class="mt-4">
                                    <button @click="createFromExample(example)" 
                                            class="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-full cursor-pointer shadow-md transition-all duration-200 font-['Onest'] font-medium text-white"
                                            :class="[
                                                index % 4 === 0 ? 'bg-teal-800 hover:bg-teal-900' : '',
                                                index % 4 === 1 ? 'bg-purple-800 hover:bg-purple-900' : '',
                                                index % 4 === 2 ? 'bg-amber-800 hover:bg-amber-900' : '',
                                                index % 4 === 3 ? 'bg-blue-800 hover:bg-blue-900' : ''
                                            ]">
                                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                                        {{ $t('home.createFromThis') }}
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Story Image (positioned absolutely) -->
                            <div class="absolute -top-3 left-4 w-32 h-32 rounded-2xl overflow-hidden shadow-lg border"
                                 :class="[
                                     index % 4 === 0 ? 'border-teal-900' : '',
                                     index % 4 === 1 ? 'border-purple-900' : '',
                                     index % 4 === 2 ? 'border-amber-900' : '',
                                     index % 4 === 3 ? 'border-blue-900' : ''
                                 ]">
                                <img :src="getOptimizedImageUrl(example.coverImage || example.image, 200, 200)" 
                                     :alt="example.title" 
                                     class="w-full h-full object-cover" />
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
      preloadedAudios: {}, // Track preloaded audio files
    };
  },
  async mounted() {
    console.log("IndexPage mounted");

    // Check for custom translator file
    await this.checkTranslatorFile();

    // Load examples from translations (available immediately from i18n)
    const currentLang = window.i18n.getLanguage();
    if (window.i18n && window.i18n.translations && window.i18n.translations[currentLang]) {
      this.examples = window.i18n.translations[currentLang].examples || [];
      
      if (this.examples && this.examples.length > 0) {
        console.log("Examples loaded:", this.examples.length);
        this.examples.forEach((example, idx) => {
          console.log("Example", idx + ":", example.title, "- Audio:", example.audio);
        });
      } else {
        console.log("No examples found in translations");
      }
    } else {
      console.log("Translations not fully loaded yet");
      this.examples = [];
    }

    // Fix permissions for example audio files
    await this.fixExampleAudioPermissions();

    // Start preloading audio files for examples
    if (this.examples && this.examples.length > 0) {
      this.preloadAudios();
    }

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
      if (sdk && typeof sdk.fs?.read === "function") {
        console.log("Current working directory:", await sdk.fs.cwd());
        const translatorPath = "~/AI Storyteller/translations.json";
        try {
          const translationsContent = await sdk.fs.read(
            translatorPath,
          );
          console.log(
            "Translator file content on startup:",
            translationsContent ? "Content loaded successfully" : "No content",
          );
          console.log(
            "First 500 characters:",
            translationsContent ? translationsContent.substring(0, 500) : "N/A",
          );
        } catch (readError) {
          console.log(
            "Translator file doesn't exist yet:",
            readError.message,
          );
        }
      } else {
        console.log(
          "SDK.fs.read is not available, cannot read translator file",
        );
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
          window.eventBus.on(
            "translations-loaded",
            this.handleTranslationsLoaded,
          );
        }
        return;
      }

      if (
        window.i18n.translations &&
        window.i18n.translations[currentLang] &&
        window.i18n.translations[currentLang].examples
      ) {
        this.examples = window.i18n.translations[currentLang].examples;

        // Debug: Log examples to check for missing audio properties
        console.log("Examples loaded:", this.examples.length);
        this.examples.forEach((example, index) => {
          console.log({ example });
          console.log(
            `Example ${index}: "${example.title}" - Audio: ${
              example.audio || "MISSING"
            }`,
          );
        });

        // Preload all audio files
        this.preloadAudios();
      } else if (
        window.i18n.translations && window.i18n.translations.en &&
        window.i18n.translations.en.examples
      ) {
        // Fallback to English if current language doesn't have examples
        this.examples = window.i18n.translations.en.examples;

        // Debug: Log examples to check for missing audio properties
        console.log(
          "Using English examples fallback:",
          this.examples.length,
        );
        this.examples.forEach((example, index) => {
          console.log(
            `Example ${index}: "${example.title}" - Audio: ${
              example.audio || "MISSING"
            }`,
          );
        });

        // Preload all audio files
        this.preloadAudios();
      } else {
        console.error("No examples found in translations");
        this.examples = [];
      }

      // Ensure all examples have the required properties
      this.examples = this.examples.map((example, index) => {
        // Manter as imagens originais de cada exemplo em vez de atribuir com base no índice
        return {
          ...example,
          isPlaying: false,
          loading: false,
          progress: "0%",
          // Ensure audio property exists
          audio: example.audio || null,
          // Não modificar as imagens, apenas garantir que existam
          image: example.image ||
            `/assets/image/ex${index + 1}${index === 1 ? ".png" : ".webp"}`,
          coverImage: example.coverImage || example.image ||
            `/assets/image/ex${index + 1}${index === 1 ? ".png" : ".webp"}`,
        };
      });

      this._loggedImages = {};
      this._loggedAudios = {};
    } catch (error) {
      console.error("Error setting up examples:", error);
      this.examples = [];
    }

    // Check if we're in the preview environment
    this.isPreviewEnvironment = window.location.origin.includes(
      "preview.webdraw.app",
    );

    // Check if we can access the translator.json file
    await this.checkTranslatorAccess();

    // Listen for translations loaded event
    if (window.eventBus) {
      window.eventBus.on(
        "translations-loaded",
        this.handleTranslationsLoaded,
      );
      window.eventBus.on(
        "translations-updated",
        this.handleTranslationsLoaded,
      );
    }

    // Force refresh if translations are already loaded
    if (window.translationsLoaded) {
      this.handleTranslationsLoaded();
    }
  },
  methods: {
    handleLogin() {
      sdk.redirectToLogin({ appReturnUrl: "?goToCreate=true" });
    },

    // Ensure all necessary translation keys exist
    ensureTranslationKeys() {
      // Define default translations for new UI elements
      const requiredTranslations = {
        "home.narratedBy": "Narrated by",
        "home.listenStory": "Listen to Story",
        "home.pauseStory": "Pause Story",
        "home.noExamples": "No example stories yet",
        "home.checkBackSoon": "Check back soon for example stories!",
        "home.createFromThis": "Create from this",
        "home.step1Description":
          "Enter your child's name and select themes they love for a personalized story experience.",
        "home.step3Description":
          "Our AI crafts a magical story featuring your child and their interests in moments.",
        "home.step4Description":
          "Enjoy the story together, save it to your collection, and share it with family and friends.",
      };

      // Portuguese translations for the new keys
      const ptTranslations = {
        "home.step1Description":
          "Digite o nome do seu filho e selecione temas que ele ama para uma experiência de história personalizada.",
        "home.step3Description":
          "Nossa IA cria uma história mágica com seu filho e seus interesses em poucos momentos.",
        "home.step4Description":
          "Aproveite a história juntos, salve-a em sua coleção e compartilhe com familiares e amigos.",
      };

      // Add translations if they don't exist
      if (window.i18n && window.i18n.translations) {
        const currentLang = window.i18n.getLanguage();

        // For each language
        Object.keys(window.i18n.translations).forEach((lang) => {
          // For each required translation
          Object.entries(requiredTranslations).forEach(
            ([key, defaultValue]) => {
              // Get the key parts (e.g., ['home', 'narratedBy'])
              const keyParts = key.split(".");

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
                if (lang === "pt" && ptTranslations[key]) {
                  target[lastKey] = ptTranslations[key];
                } else {
                  target[lastKey] = defaultValue;
                }
                console.log(
                  `Added missing translation for ${lang}.${key}`,
                );
              }
            },
          );
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
        if (
          sdk && typeof sdk.fs?.read === "function" &&
          typeof sdk.fs?.write === "function"
        ) {
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
            console.log(
              "Admin access granted - ~/AI Storyteller/translations.json can be read and written",
            );
          } catch (readError) {
            // File doesn't exist or can't be read
            console.log(
              "Translator file doesn't exist or can't be read:",
              readError.message,
            );
            this.isAdmin = false;
          }
        }
      } catch (error) {
        console.log(
          "Not showing admin menu - ~/AI Storyteller/translations.json cannot be accessed:",
          error,
        );
        this.isAdmin = false;
      }
    },

    // Handle translations loaded event
    handleTranslationsLoaded() {
      console.log(
        "Translations loaded/updated, refreshing IndexPage component",
      );

      // Ensure all necessary translation keys exist
      this.ensureTranslationKeys();

      // Update examples if needed
      try {
        const currentLang = window.i18n.getLanguage();

        if (
          window.i18n.translations &&
          window.i18n.translations[currentLang] &&
          window.i18n.translations[currentLang].examples
        ) {
          this.examples = window.i18n.translations[currentLang].examples;

          // Debug: Log examples to check for missing audio properties
          console.log("Examples updated:", this.examples.length);
          this.examples.forEach((example, index) => {
            console.log(
              `Example ${index}: "${example.title}" - Audio: ${
                example.audio || "MISSING"
              }`,
            );
          });
        } else if (
          window.i18n.translations && window.i18n.translations.en &&
          window.i18n.translations.en.examples
        ) {
          // Fallback to English if current language doesn't have examples
          this.examples = window.i18n.translations.en.examples;

          // Debug: Log examples to check for missing audio properties
          console.log(
            "Examples updated (fallback to English):",
            this.examples.length,
          );
          this.examples.forEach((example, index) => {
            console.log(
              `Example ${index}: "${example.title}" - Audio: ${
                example.audio || "MISSING"
              }`,
            );
          });
        }

        // Ensure all examples have the required properties
        this.examples = this.examples.map((example, index) => {
          // Manter as imagens originais de cada exemplo em vez de atribuir com base no índice
          return {
            ...example,
            isPlaying: false,
            loading: false,
            progress: "0%",
            // Ensure audio property exists
            audio: example.audio || null,
            // Não modificar as imagens, apenas garantir que existam
            image: example.image ||
              `/assets/image/ex${index + 1}${index === 1 ? ".png" : ".webp"}`,
            coverImage: example.coverImage || example.image ||
              `/assets/image/ex${index + 1}${index === 1 ? ".png" : ".webp"}`,
          };
        });

        // Reset tracking objects when examples change
        this._loggedImages = {};
        this._loggedAudios = {};

        // Preload audio files after examples are updated
        this.preloadAudios();
      } catch (error) {
        console.error(
          "Error updating examples after translations loaded:",
          error,
        );
      }

      // Force component re-render by incrementing the refresh key
      this.refreshKey++;
      this.$forceUpdate();
    },
    getOptimizedImageUrl(url, width, height) {
      if (!url || url.startsWith("data:")) return url;

      // If the URL already starts with /assets/image, just return it directly
      if (
        url.startsWith("/assets/image") ||
        url.startsWith("assets/image")
      ) {
        return url.startsWith("/") ? url : `/${url}`;
      }

      // If the URL contains a filename that matches our example images, use direct path
      const filename = url.split("/").pop();
      if (
        filename &&
        (filename.startsWith("ex1") || filename.startsWith("ex2") ||
          filename.startsWith("ex3") || filename.startsWith("ex4"))
      ) {
        return `/assets/image/${filename}`;
      }

      // For other URLs, keep the original behavior but with fallback
      let processedUrl = url;

      // If the URL is not absolute and doesn't start with a slash, add a slash
      if (!url.startsWith("http") && !url.startsWith("/")) {
        processedUrl = "/" + url;
      }

      // Return the direct URL without optimization service
      if (!processedUrl.startsWith("http")) {
        return `${window.location.origin}${processedUrl}`;
      }

      return processedUrl;
    },
    getOptimizedAudioUrl(url) {
      // If the URL is empty, a data URL, or null, return it as is
      if (!url || url.startsWith("data:")) return url;

      // If the URL already includes https:// or http://, it's absolute - use it as is
      if (url.startsWith("http")) {
        return url;
      }

      // If the URL starts with a slash, it's a relative URL from the root
      if (url.startsWith("/")) {
        // For local development, use the URL as is (the browser will resolve it)
        if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          return url;
        }

        // For production, use the full URL with origin
        return url;
      }

      // If we get here, it's a URL without a leading slash, add one
      return "/" + url;
    },
    toggleAudio(example) {
      // Prevenir cliques múltiplos durante o carregamento
      if (example.loading) {
        console.log(
          `Ignoring click while audio is loading for "${example.title}"`,
        );
        return;
      }

      // Find the audio element
      const audioId = "audio-" + this.examples.indexOf(example);
      const audioElement = document.getElementById(audioId);

      if (!audioElement) {
        console.error("Audio element not found:", audioId);
        return;
      }

      // If this example is already playing, pause it
      if (example.isPlaying) {
        audioElement.pause();

        // Pausar também o elemento de áudio temporário, se existir
        if (example.tempAudio) {
          example.tempAudio.pause();
          // Não excluímos a referência para poder continuar de onde parou
        }

        example.isPlaying = false;
        return;
      }

      // Pause any other playing audio
      this.examples.forEach((ex) => {
        if (ex !== example && ex.isPlaying) {
          const otherAudioId = "audio-" + this.examples.indexOf(ex);
          const otherAudioElement = document.getElementById(
            otherAudioId,
          );
          if (otherAudioElement) {
            otherAudioElement.pause();
            ex.isPlaying = false;
          }
        }
      });

      // Ativar o indicador de carregamento
      example.loading = true;

      // Play this audio
      try {
        // Use the audio URL directly - example audio paths in translations.json are absolute
        const audioUrl = example.audio;

        // Exibir feedback visual de carregamento
        example.loading = true;

        // Verificar em todas as fontes disponíveis de áudio pré-carregado
        // 1. Verificar áudios pré-carregados globalmente (durante carregamento inicial)
        const globalPreloadedAudio = window._preloadedAudios &&
          window._preloadedAudios[audioUrl];
        // 2. Verificar áudios pré-carregados pelo componente
        const componentPreloadedAudio = this.preloadedAudios[audioUrl];

        // Escolher a melhor fonte disponível
        let bestAudioSource = null;
        if (
          globalPreloadedAudio && globalPreloadedAudio.loaded &&
          globalPreloadedAudio.element
        ) {
          console.log(
            `Using globally preloaded audio for "${example.title}"`,
          );
          bestAudioSource = globalPreloadedAudio;
        } else if (
          componentPreloadedAudio && componentPreloadedAudio.loaded &&
          componentPreloadedAudio.element
        ) {
          console.log(
            `Using component preloaded audio for "${example.title}"`,
          );
          bestAudioSource = componentPreloadedAudio;
        }

        // Verificar se o elemento pré-carregado está disponível e funcional
        if (bestAudioSource) {
          // Pausar o elemento pré-carregado e copiar seu conteúdo para o elemento de UI
          bestAudioSource.element.pause();
          audioElement.src = audioUrl;

          // Tentar reproduzir o áudio de UI com os mesmos dados do pré-carregado
          audioElement.currentTime = 0;
          audioElement.play()
            .then(() => {
              example.isPlaying = true;
              console.log(
                `Playing audio from preloaded source: "${example.title}"`,
              );
              example.loading = false;
            })
            .catch((error) => {
              console.error(
                `Error playing preloaded audio: "${example.title}"`,
                error,
              );
              this.handleAudioError(
                example,
                audioElement,
                audioUrl,
                error,
              );
            });
        } else {
          // Nenhuma fonte pré-carregada disponível, carregando diretamente
          console.log(
            `No preloaded audio available for "${example.title}", loading directly`,
          );

          // Set crossOrigin attribute if needed
          if (
            audioUrl.startsWith("http") &&
            !audioUrl.includes(window.location.hostname)
          ) {
            audioElement.crossOrigin = "anonymous";
          }

          // Set the source
          audioElement.src = audioUrl;

          // Try to play the audio
          audioElement.play()
            .then(() => {
              example.isPlaying = true;
              example.loading = false;
              console.log(`Playing audio: "${example.title}"`);
            })
            .catch((error) => {
              console.error(
                `Error playing audio: "${example.title}"`,
                error,
              );
              this.handleAudioError(
                example,
                audioElement,
                audioUrl,
                error,
              );
            });
        }
      } catch (error) {
        console.error(
          `Error attempting to play audio: "${example.title}"`,
          error,
        );
      }
    },

    updateProgress(event, example) {
      const audioElement = event.target;
      if (audioElement && !isNaN(audioElement.duration)) {
        const percentage = (audioElement.currentTime / audioElement.duration) *
          100;
        example.progress = percentage + "%";
      }
    },

    audioEnded(example) {
      example.isPlaying = false;
      example.progress = "0%";
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
        error: error ? error.message : "Unknown error",
      });
    },
    preloadAudios() {
      console.log("Starting audio preloading in component...");
      if (!this.examples || this.examples.length === 0) {
        console.log("No examples to preload audio for");
        return;
      }

      // Verificar se existem áudios pré-carregados durante o carregamento inicial
      const globalPreloadedAudios = window._preloadedAudios || {};
      console.log(
        "Checking for globally preloaded audios:",
        Object.keys(globalPreloadedAudios).length,
      );

      // Criar um array para armazenar promessas de carregamento
      const loadPromises = [];

      this.examples.forEach((example, index) => {
        if (!example.audio) {
          console.log(
            `Example ${index}: "${example.title}" - No audio to preload`,
          );
          return;
        }

        try {
          // Use original audio URL as is - all example audio paths in translations.json are absolute
          const audioUrl = example.audio;

          // Verificar se o áudio já foi pré-carregado durante o carregamento inicial da página
          if (
            globalPreloadedAudios[audioUrl] &&
            globalPreloadedAudios[audioUrl].loaded
          ) {
            console.log(
              `Using globally preloaded audio for "${example.title}"`,
            );
            this.preloadedAudios[audioUrl] = {
              loaded: true,
              element: globalPreloadedAudios[audioUrl].element,
            };
            return;
          }

          // Skip if already preloaded in the component
          if (this.preloadedAudios[audioUrl]) {
            console.log(
              `Audio for "${example.title}" already preloaded`,
            );
            return;
          }

          // Create a new Audio element for preloading
          const audioLoader = new Audio();

          // Criar uma promessa para o carregamento deste áudio
          const loadPromise = new Promise((resolve, reject) => {
            // Set up event listeners
            audioLoader.addEventListener("canplaythrough", () => {
              console.log(
                `Audio preloaded successfully: "${example.title}"`,
              );
              this.preloadedAudios[audioUrl] = {
                loaded: true,
                element: audioLoader,
              };
              resolve(audioUrl);
            }, { once: true });

            audioLoader.addEventListener("error", (error) => {
              console.error(
                `Error preloading audio for "${example.title}":`,
                error,
              );
              // Ainda armazenamos o elemento, mas marcamos como falha
              this.preloadedAudios[audioUrl] = {
                loaded: false,
                element: null,
                error: error,
              };
              reject(error);
            }, { once: true });

            // Timeout para evitar bloqueio indefinido
            setTimeout(() => {
              if (!this.preloadedAudios[audioUrl]?.loaded) {
                console.warn(
                  `Timeout preloading audio for "${example.title}"`,
                );
                this.preloadedAudios[audioUrl] = {
                  loaded: false,
                  element: audioLoader,
                  error: "timeout",
                };
                resolve(audioUrl); // Resolvemos de qualquer forma para não bloquear outros
              }
            }, 10000); // 10 segundos de timeout
          });

          loadPromises.push(loadPromise);

          // Set crossOrigin if it's from a different domain
          if (
            audioUrl.startsWith("http") &&
            !audioUrl.includes(window.location.hostname)
          ) {
            audioLoader.crossOrigin = "anonymous";
          }

          // Start loading
          audioLoader.src = audioUrl;
          audioLoader.load();

          console.log(
            `Started preloading audio for "${example.title}": ${audioUrl}`,
          );
        } catch (error) {
          console.error(
            `Exception while trying to preload audio for "${example.title}":`,
            error,
          );
        }
      });

      // Aguardar que todos os áudios sejam carregados (ou falhem)
      Promise.allSettled(loadPromises).then((results) => {
        console.log(
          "All audio preloading attempts completed:",
          results.filter((r) => r.status === "fulfilled").length,
          "successful,",
          results.filter((r) => r.status === "rejected").length,
          "failed",
        );
      });
    },
    handleAudioError(example, audioElement, audioUrl, error) {
      example.loading = true; // Manter o estado de carregamento ativo enquanto tentamos alternativas

      // Se for um erro de interrupção, apenas mostramos o feedback e não fazemos mais nada
      if (error && error.name === "AbortError") {
        console.log(
          `Audio playback was interrupted for "${example.title}" - likely due to multiple clicks`,
        );
        example.loading = false;
        return;
      }

      // Tentar uma segunda alternativa usando um elemento de áudio temporário
      console.log(
        `Trying alternative playback method for "${example.title}"`,
      );

      try {
        const tempAudio = new Audio();
        
        // Adicionar evento para monitorar o carregamento
        tempAudio.addEventListener("canplaythrough", () => {
          console.log(`Alternative audio method ready for "${example.title}"`);
          
          // Reproduzir automaticamente quando estiver pronto
          tempAudio.play()
            .then(() => {
              // Se conseguir reproduzir, usamos este elemento
              console.log(
                `Playing audio via alternative method: "${example.title}"`,
              );
              example.isPlaying = true;
              example.loading = false;

              // Adicionar evento para atualizar o progresso
              tempAudio.addEventListener("timeupdate", (event) => {
                if (tempAudio && !isNaN(tempAudio.duration)) {
                  const percentage = (tempAudio.currentTime /
                    tempAudio.duration) * 100;
                  example.progress = percentage + "%";
                }
              });

              // Adicionar evento para quando o áudio terminar
              tempAudio.addEventListener("ended", () => {
                example.isPlaying = false;
                example.progress = "0%";
                example.tempAudio = null; // Limpar a referência
              });

              // Armazenar a referência para poder pausar depois
              example.tempAudio = tempAudio;
            })
            .catch((playError) => {
              console.error(
                `Alternative playback failed to play for "${example.title}"`,
                playError
              );
              // Tentar terceira alternativa com permissões do arquivo
              this.tryWithPermissionsFix(example, audioUrl);
            });
        }, { once: true });
        
        // Adicionar handler de erro
        tempAudio.addEventListener("error", (audioError) => {
          console.error(
            `Alternative audio loading failed for "${example.title}"`,
            audioError
          );
          // Tentar terceira alternativa com permissões do arquivo
          this.tryWithPermissionsFix(example, audioUrl);
        }, { once: true });
        
        // Iniciar carregamento
        tempAudio.src = audioUrl;
        tempAudio.load();
      } catch (finalError) {
        console.error(
          `Second audio playback attempt failed for "${example.title}"`,
          finalError,
        );
        // Tentar terceira alternativa com permissões do arquivo
        this.tryWithPermissionsFix(example, audioUrl);
      }
    },
    
    // Tentativa adicional após corrigir permissões
    async tryWithPermissionsFix(example, audioUrl) {
      console.log(`Trying with permissions fix for "${example.title}"`);
      
      try {
        // Extrair o caminho do arquivo da URL
        let filePath = audioUrl;
        if (filePath.startsWith("http")) {
          try {
            const url = new URL(audioUrl);
            filePath = url.pathname;
          } catch (e) {
            console.warn("Could not parse URL:", audioUrl);
          }
        }
        
        // Remover prefixo ~ se presente
        if (filePath.startsWith('~')) {
          filePath = filePath.substring(1);
        }
        
        // Remover barras duplas iniciais
        while (filePath.startsWith('//')) {
          filePath = filePath.substring(1);
        }
        
        // Tentar corrigir permissões do arquivo
        if (sdk && typeof sdk.fs?.chmod === 'function') {
          try {
            console.log(`Fixing permissions for audio file: ${filePath}`);
            await sdk.fs.chmod(filePath, 0o644);
            console.log(`Successfully fixed permissions for: ${filePath}`);
            
            // Criar novo elemento após corrigir permissões
            const finalAudio = new Audio();
            
            finalAudio.addEventListener("canplaythrough", () => {
              finalAudio.play()
                .then(() => {
                  console.log(`Playing audio after permissions fix: "${example.title}"`);
                  example.isPlaying = true;
                  example.loading = false;
                  
                  // Configurar eventos para progresso e finalização
                  finalAudio.addEventListener("timeupdate", () => {
                    if (finalAudio && !isNaN(finalAudio.duration)) {
                      const percentage = (finalAudio.currentTime / finalAudio.duration) * 100;
                      example.progress = percentage + "%";
                    }
                  });
                  
                  finalAudio.addEventListener("ended", () => {
                    example.isPlaying = false;
                    example.progress = "0%";
                    example.tempAudio = null;
                  });
                  
                  example.tempAudio = finalAudio;
                })
                .catch(finalPlayError => {
                  console.error(`Final playback attempt failed for "${example.title}"`, finalPlayError);
                  example.loading = false;
                  example.isPlaying = false;
                });
            }, { once: true });
            
            finalAudio.addEventListener("error", (finalLoadError) => {
              console.error(`Final audio loading failed for "${example.title}"`, finalLoadError);
              example.loading = false;
              example.isPlaying = false;
            }, { once: true });
            
            // Tentar com URL com marca temporal para evitar cache
            finalAudio.src = `${audioUrl}?t=${Date.now()}`;
            finalAudio.load();
          } catch (permError) {
            console.error(`Failed to fix permissions for "${example.title}"`, permError);
            example.loading = false;
            example.isPlaying = false;
          }
        } else {
          console.warn("Permission utilities not available for final attempt");
          example.loading = false;
          example.isPlaying = false;
        }
      } catch (finalError) {
        console.error(`All audio playback attempts failed for "${example.title}"`, finalError);
        example.loading = false;
        example.isPlaying = false;
      }
    },
    trackMyStoriesClick() {
      // Track my stories click event with PostHog
      if (sdk && sdk.posthogEvent) {
        sdk.posthogEvent("my_stories_clicked", {
          user: this.user ? this.user.username : 'anonymous'
        });
      }
    },
    trackCreateStoryClick() {
      // Track the create story button click
      if (window.gtag) {
        window.gtag("event", "create_story_click", {
          event_category: "engagement",
          event_label: "home_page",
        });
      }
      
      // Track create story button click with PostHog
      if (sdk && sdk.posthogEvent) {
        sdk.posthogEvent("create_story_clicked", {
          user: this.user ? this.user.username : 'anonymous'
        });
      }
    },
    createFromExample(example) {
      // Store example data in localStorage to use in create page
      const exampleData = {
        themes: example.themes || '',
        voice: example.voice || '',
        title: example.title || ''
      };
      
      localStorage.setItem('createFromExample', JSON.stringify(exampleData));
      
      // Navigate to create page
      if (this.user) {
        this.$router.push('/create');
      } else {
        this.handleLogin();
      }
      
      // Track the create from example button click
      if (window.gtag) {
        window.gtag("event", "create_from_example_click", {
          event_category: "engagement",
          event_label: example.title,
        });
      }
      
      // Track create from example button click with PostHog
      if (sdk && sdk.posthogEvent) {
        sdk.posthogEvent("create_from_example_clicked", {
          user: this.user ? this.user.username : 'anonymous',
          exampleTitle: example.title,
          exampleThemes: example.themes
        });
      }
    },
    // Fix permissions for example audio files, especially those from different users
    async fixExampleAudioPermissions() {
      if (!sdk || typeof sdk.fs?.chmod !== "function") {
        console.warn("File permission utilities not available");
        return;
      }
      
      // Arrays of audio files that need permissions fixed
      const audioFiles = [
        // Uncle Joe/Tio José files
        "/users/a4896ea5-db22-462e-a239-22641f27118c/Apps/Staging%20AI%20Storyteller/assets/audio/sample/audio-uncle-joe.mp3",
        "/users/a4896ea5-db22-462e-a239-22641f27118c/Apps/Staging%20AI%20Storyteller/assets/audio/sample/audio-uncle-jose.mp3",
      ];
      
      console.log("Fixing permissions for example audio files...");
      
      // Process each file
      for (const filePath of audioFiles) {
        try {
          await sdk.fs.chmod(filePath, 0o644);
          console.log(`Successfully set permissions (0o644) for audio file: ${filePath}`);
        } catch (error) {
          console.warn(`Could not set file permissions for ${filePath}:`, error);
        }
      }
    },
    // Check for translator file
    async checkTranslatorFile() {
      // Check if custom translator file exists
      try {
        if (sdk && typeof sdk.fs?.read === "function") {
          const translatorPath = "~/AI Storyteller/translations.json";
          try {
            const translationsContent = await sdk.fs.read(
              translatorPath,
            );
            console.log(
              "Custom translator file exists, updating translations",
            );

            // If the file exists, update the translations
            if (translationsContent) {
              const customTranslations = JSON.parse(translationsContent);
              window.i18n.updateTranslations(customTranslations);
            }
          } catch (readError) {
            console.log(
              "Translator file doesn't exist or can't be read:",
              readError.message,
            );
          }
        } else {
          console.log(
            "SDK.fs.read is not available, using default translations",
          );
        }
      } catch (error) {
        console.error("Error checking for translator file:", error);
      }
    },
  },
  beforeUnmount() {
    // Clean up event listeners
    if (window.eventBus && window.eventBus.events) {
      if (window.eventBus.events["translations-loaded"]) {
        const index = window.eventBus.events["translations-loaded"]
          .indexOf(this.handleTranslationsLoaded);
        if (index !== -1) {
          window.eventBus.events["translations-loaded"].splice(
            index,
            1,
          );
        }
      }

      if (window.eventBus.events["translations-updated"]) {
        const index = window.eventBus.events["translations-updated"]
          .indexOf(this.handleTranslationsLoaded);
        if (index !== -1) {
          window.eventBus.events["translations-updated"].splice(
            index,
            1,
          );
        }
      }
    }

    // Stop any playing audio
    this.examples.forEach((example) => {
      if (example.isPlaying) {
        // Parar áudio no elemento padrão
        const audioId = "audio-" + this.examples.indexOf(example);
        const audioElement = document.getElementById(audioId);
        if (audioElement) {
          audioElement.pause();
        }

        // Parar áudio no elemento temporário, se existir
        if (example.tempAudio) {
          example.tempAudio.pause();
          example.tempAudio = null;
        }

        example.isPlaying = false;
      }

      // Limpar status visual
      example.loading = false;
      example.progress = "0%";
    });

    // Limpar referências a áudios pré-carregados
    Object.values(this.preloadedAudios).forEach((audio) => {
      if (audio && audio.element) {
        audio.element.pause();
        audio.element.src = "";
        audio.element = null;
      }
    });
    this.preloadedAudios = {};
  },
  computed: {
    // Add any computed properties if needed
  },
  created() {
    // Add button styles to the document
    const styleEl = document.createElement("style");
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
  },
};

// Export for module systems while maintaining window compatibility
export default window.IndexPage;
