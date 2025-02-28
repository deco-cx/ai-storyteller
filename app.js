const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

// Import i18n system
import i18n from './i18n/index.js';
import translations from './i18n/translations.js';
import LanguageSwitcher from './components/LanguageSwitcher.js';
import { sdk } from './sdk.js';

// Initialize language
const currentLanguage = i18n.initLanguage();
console.log(`App initialized with language: ${currentLanguage}`);

// Make i18n available globally for components
window.i18n = i18n;
// Make translations available globally
window.i18n.translations = translations;

// Load custom translations if available
(async function loadCustomTranslations() {
  try {
    if (sdk && typeof sdk.fs?.read === 'function') {
      const translatorPath = "~/AI Storyteller/translations.js";
      try {
        const content = await sdk.fs.read(translatorPath);
        if (content) {
          // Parse the content to get the translations object
          const match = content.match(/const\s+translations\s*=\s*({[\s\S]*?});/);
          if (match && match[1]) {
            try {
              const customTranslations = JSON.parse(match[1]);
              console.log("Loaded custom translations from ~/AI Storyteller/translations.js");
              // Override default translations with custom translations
              window.i18n.translations = customTranslations;
            } catch (parseError) {
              console.error("Error parsing custom translations:", parseError);
            }
          }
        }
      } catch (readError) {
        console.log("No custom translations file found, using default translations");
      }
    }
  } catch (error) {
    console.error("Error loading custom translations:", error);
  }
})();

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
            currentLanguage: currentLanguage
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
    }
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
        
        // Store listener reference for cleanup
        this._languageUpdateListener = updateComponentLanguage;
    },
    beforeUnmount() {
        // Remove listener on component unmount
        if (this._languageUpdateListener) {
            document.removeEventListener('language-updated', this._languageUpdateListener);
        }
    }
});

app.mount('#app'); 