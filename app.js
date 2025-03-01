const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// Import i18n system
import i18n from './i18n/index.js';
import LanguageSwitcher from './components/LanguageSwitcher.js';
import { sdk } from './sdk.js';

// Initialize language
const currentLanguage = i18n.initLanguage();
console.log(`App initialized with language: ${currentLanguage}`);

// Make i18n available globally for components
window.i18n = i18n;

// Create a loading state
window.translationsLoaded = false;

// Load default translations from JSON file
(async function loadDefaultTranslations() {
  try {
    const response = await fetch('./i18n/translations.json');
    if (response.ok) {
      const translations = await response.json();
      // Make translations available globally
      window.i18n.translations = translations;
      console.log("Loaded default translations from translations.json");
      
      // After loading default translations, try to load custom translations
      await loadCustomTranslations();
      
      // Mark translations as loaded
      window.translationsLoaded = true;
      
      // Notify app that translations are loaded
      if (window.eventBus) {
        window.eventBus.emit('translations-loaded');
        
        // Also trigger a language update to refresh all components
        window.eventBus.emit('language-changed', window.i18n.getLanguage());
        
        // Dispatch DOM event for components that might not be using the event bus
        document.dispatchEvent(new CustomEvent('translations-loaded'));
        document.dispatchEvent(new CustomEvent('language-updated', { detail: window.i18n.getLanguage() }));
      }
    } else {
      console.error("Error loading default translations:", response.statusText);
      // Mark translations as loaded even on error to prevent infinite loading
      window.translationsLoaded = true;
      if (window.eventBus) {
        window.eventBus.emit('translations-loaded');
      }
    }
  } catch (error) {
    console.error("Error loading default translations:", error);
    // Mark translations as loaded even on error to prevent infinite loading
    window.translationsLoaded = true;
    if (window.eventBus) {
      window.eventBus.emit('translations-loaded');
    }
  }
})();

// Load custom translations if available
async function loadCustomTranslations() {
  try {
    if (sdk && typeof sdk.fs?.read === 'function') {
      const translatorPath = "~/AI Storyteller/translations.json";
      try {
        const content = await sdk.fs.read(translatorPath);
        if (content) {
          try {
            // Parse JSON directly
            const customTranslations = JSON.parse(content);
            console.log("Loaded custom translations from ~/AI Storyteller/translations.json");
            // Override default translations with custom translations
            window.i18n.translations = customTranslations;
            
            // Notify components that translations have been updated
            if (window.eventBus) {
              window.eventBus.emit('translations-updated');
              
              // Also trigger a language update to refresh all components
              window.eventBus.emit('language-changed', window.i18n.getLanguage());
              
              // Dispatch DOM event for components that might not be using the event bus
              document.dispatchEvent(new CustomEvent('translations-updated'));
              document.dispatchEvent(new CustomEvent('language-updated', { detail: window.i18n.getLanguage() }));
            }
          } catch (parseError) {
            console.error("Error parsing custom translations:", parseError);
          }
        }
      } catch (readError) {
        console.log("No custom translations file found, using default translations");
      }
    }
  } catch (error) {
    console.error("Error loading custom translations:", error);
  }
}

// Make SDK available globally
window.sdk = sdk;

// Create a simple event bus for Vue 3
const eventBus = {
    events: {},
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    },
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
};

// Make event bus available globally
window.eventBus = eventBus;

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: window.IndexPage },
        { path: '/login', component: window.LoginPage },
        { path: '/create', component: window.CreatePage },
        { path: '/story', component: window.StoryPage },
        { path: '/my-stories', component: window.MyStoriesPage },
        { path: '/_admin', component: window.AdminPage }
    ]
});

const app = createApp({
    data() {
        return {
            currentLanguage: currentLanguage,
            isLoading: !window.translationsLoaded
        };
    },
    mounted() {
        // Listen for language change events using our event bus
        window.eventBus.on('language-changed', (lang) => {
            this.currentLanguage = lang;
            
            // Update app first
            this.$forceUpdate();
            
            // Update all components
            setTimeout(() => {
                // Dispatch event to notify all components
                document.dispatchEvent(new CustomEvent('language-updated', { detail: lang }));
            }, 0);
        });
        
        // Listen for translations loaded event
        window.eventBus.on('translations-loaded', () => {
            this.isLoading = false;
        });
        
        // If translations are already loaded, update the loading state
        if (window.translationsLoaded) {
            this.isLoading = false;
        }
    },
    template: `
        <div>
            <!-- Loading Screen -->
            <div v-if="isLoading" class="fixed inset-0 bg-[#FFF9F6] flex items-center justify-center z-50">
                <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00B7EA] mb-4"></div>
                    <p class="text-xl text-[#00B7EA] font-medium">Loading...</p>
                </div>
            </div>
            
            <!-- Main App Content -->
            <router-view v-show="!isLoading" :key="currentLanguage"></router-view>
        </div>
    `
});

app.use(router);

// Register global components
app.component('language-switcher', LanguageSwitcher);

// Add i18n helper methods to all components
app.mixin({
    methods: {
        // Translate a key
        $t(key) {
            return i18n.t(key);
        },
        // Translate a key with variables
        $tf(key, variables) {
            return i18n.tf(key, variables);
        }
    },
    mounted() {
        // Add language update listener
        const updateComponentLanguage = () => {
            if (this.$el && this.$forceUpdate) {
                this.$forceUpdate();
            }
        };
        
        document.addEventListener('language-updated', updateComponentLanguage);
        
        // Add translations update listener
        if (window.eventBus) {
            window.eventBus.on('translations-updated', updateComponentLanguage);
            window.eventBus.on('translations-loaded', updateComponentLanguage);
        }
        
        // Store listener reference for cleanup
        this._languageUpdateListener = updateComponentLanguage;
    },
    beforeUnmount() {
        // Remove listener on component unmount
        if (this._languageUpdateListener) {
            document.removeEventListener('language-updated', this._languageUpdateListener);
            
            // Also remove from event bus if it exists
            if (window.eventBus && window.eventBus.events) {
                if (window.eventBus.events['translations-updated']) {
                    const index = window.eventBus.events['translations-updated'].indexOf(this._languageUpdateListener);
                    if (index !== -1) {
                        window.eventBus.events['translations-updated'].splice(index, 1);
                    }
                }
                
                if (window.eventBus.events['translations-loaded']) {
                    const index = window.eventBus.events['translations-loaded'].indexOf(this._languageUpdateListener);
                    if (index !== -1) {
                        window.eventBus.events['translations-loaded'].splice(index, 1);
                    }
                }
            }
        }
    }
});

app.mount('#app'); 