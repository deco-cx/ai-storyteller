import i18n from '../i18n/index.js';
import translations from '../i18n/translations.js';
import { sdk } from '../sdk.js';

window.AdminPage = {
  data() {
    return {
      languages: i18n.getAvailableLanguages(),
      currentLanguage: i18n.getLanguage(),
      sections: [
        { id: 'ui', label: 'UI Elements' },
        { id: 'home', label: 'Home Page' },
        { id: 'create', label: 'Create Page' },
        { id: 'myStories', label: 'My Stories Page' },
        { id: 'story', label: 'Story Page' },
        { id: 'examples', label: 'Example Stories' },
        { id: 'voices', label: 'Voice Options' },
        { id: 'themeSuggestions', label: 'Theme Suggestions' },
        { id: 'prompts', label: 'AI Prompts' }
      ],
      currentSection: 'ui',
      editedTranslations: JSON.parse(JSON.stringify(translations)),
      isSaving: false,
      saveMessage: '',
      saveError: false,
      showAddLanguageModal: false,
      newLanguageCode: '',
      newLanguageName: '',
      searchQuery: '',
      expandedItems: {}
    };
  },
  computed: {
    currentSectionData() {
      if (!this.currentSection) return {};
      
      const en = this.editedTranslations.en[this.currentSection];
      const current = this.editedTranslations[this.currentLanguage][this.currentSection];
      
      // Special handling for arrays
      if (Array.isArray(en)) {
        return en.map((item, index) => {
          if (typeof item === 'string') {
            return {
              key: index.toString(),
              enValue: item,
              currentValue: current[index] || ''
            };
          } else {
            // For objects in arrays (like voices)
            return {
              key: index.toString(),
              isObject: true,
              properties: Object.keys(item).map(propKey => ({
                key: propKey,
                enValue: item[propKey],
                currentValue: (current[index] && current[index][propKey]) || ''
              }))
            };
          }
        });
      }
      
      // For regular objects
      return Object.keys(en || {}).map(key => {
        if (typeof en[key] === 'object' && en[key] !== null && !Array.isArray(en[key])) {
          return {
            key,
            isObject: true,
            properties: Object.keys(en[key]).map(subKey => ({
              key: subKey,
              enValue: en[key][subKey],
              currentValue: (current[key] && current[key][subKey]) || ''
            }))
          };
        } else {
          return {
            key,
            enValue: en[key],
            currentValue: current[key] || ''
          };
        }
      });
    },
    filteredSectionData() {
      if (!this.searchQuery) return this.currentSectionData;
      
      const query = this.searchQuery.toLowerCase();
      return this.currentSectionData.filter(item => {
        if (item.isObject) {
          return item.properties.some(prop => 
            prop.key.toLowerCase().includes(query) || 
            prop.enValue.toString().toLowerCase().includes(query) ||
            prop.currentValue.toString().toLowerCase().includes(query)
          );
        } else {
          return item.key.toLowerCase().includes(query) || 
                 item.enValue.toString().toLowerCase().includes(query) ||
                 item.currentValue.toString().toLowerCase().includes(query);
        }
      });
    }
  },
  methods: {
    async loadCustomTranslations() {
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
                  // Update the editedTranslations with the custom translations
                  this.editedTranslations = JSON.parse(JSON.stringify(customTranslations));
                } catch (parseError) {
                  console.error("Error parsing custom translations:", parseError);
                }
              }
            }
          } catch (readError) {
            console.warn("Could not read custom translations file:", readError);
          }
        }
      } catch (error) {
        console.error("Error loading custom translations:", error);
      }
    },
    changeLanguage(lang) {
      this.currentLanguage = lang;
    },
    updateTranslation(item, value) {
      if (item.isObject) return;
      
      // Handle nested paths
      const keys = item.key.split('.');
      let target = this.editedTranslations[this.currentLanguage][this.currentSection];
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) {
          target[keys[i]] = {};
        }
        target = target[keys[i]];
      }
      
      target[keys[keys.length - 1]] = value;
    },
    updateObjectTranslation(item, prop, value) {
      if (!item.isObject) return;
      
      const index = parseInt(item.key);
      const section = this.editedTranslations[this.currentLanguage][this.currentSection];
      
      if (Array.isArray(section)) {
        if (!section[index]) {
          // Clone the structure from English
          section[index] = JSON.parse(JSON.stringify(this.editedTranslations.en[this.currentSection][index]));
        }
        section[index][prop.key] = value;
      } else {
        if (!section[item.key]) {
          section[item.key] = {};
        }
        section[item.key][prop.key] = value;
      }
    },
    toggleExpand(key) {
      this.expandedItems = {
        ...this.expandedItems,
        [key]: !this.expandedItems[key]
      };
    },
    isExpanded(key) {
      return !!this.expandedItems[key];
    },
    async saveTranslations() {
      this.isSaving = true;
      this.saveMessage = 'Saving translations...';
      this.saveError = false;
      
      try {
        const content = `// Translations for AI Storyteller
const translations = ${JSON.stringify(this.editedTranslations, null, 2)};

// Export the translations
export default translations;`;
        
        // Save to both locations for compatibility
        // 1. Save to the original location
        await sdk.fs.writeFile('i18n/translations.js', content);
        
        // Set file permissions to allow read and write (0644 in octal)
        try {
          await sdk.fs.chmod('i18n/translations.js', 0o644);
          console.log("Set read-write permissions for i18n/translations.js");
        } catch (permError) {
          console.warn("Could not set file permissions for i18n/translations.js:", permError);
          // Continue even if setting permissions fails
        }
        
        // 2. Save to the new location in AI Storyteller directory
        const translatorPath = "~/AI Storyteller/translations.js";
        await sdk.fs.write(translatorPath, content);
        
        // Set file permissions for the new location
        try {
          await sdk.fs.chmod(translatorPath, 0o644);
          console.log("Set read-write permissions for ~/AI Storyteller/translations.js");
        } catch (permError) {
          console.warn("Could not set file permissions for ~/AI Storyteller/translations.js:", permError);
          // Continue even if setting permissions fails
        }
        
        this.saveMessage = 'Translations saved successfully!';
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      } catch (error) {
        console.error('Error saving translations:', error);
        this.saveMessage = `Error saving translations: ${error.message}`;
        this.saveError = true;
      } finally {
        this.isSaving = false;
      }
    },
    addNewLanguage() {
      if (!this.newLanguageCode || !this.newLanguageName) {
        alert('Please provide both a language code and name');
        return;
      }
      
      // Clone English structure for the new language
      this.editedTranslations[this.newLanguageCode] = JSON.parse(JSON.stringify(this.editedTranslations.en));
      
      // Ensure examples are properly initialized
      if (!this.editedTranslations[this.newLanguageCode].examples && this.editedTranslations.en.examples) {
        this.editedTranslations[this.newLanguageCode].examples = JSON.parse(JSON.stringify(this.editedTranslations.en.examples));
      }
      
      // Add to languages list
      this.languages.push({
        code: this.newLanguageCode,
        name: this.newLanguageName
      });
      
      // Switch to the new language
      this.currentLanguage = this.newLanguageCode;
      
      // Close modal and reset fields
      this.showAddLanguageModal = false;
      this.newLanguageCode = '';
      this.newLanguageName = '';
    },
    cancelAddLanguage() {
      this.showAddLanguageModal = false;
      this.newLanguageCode = '';
      this.newLanguageName = '';
    },
    addNewExample() {
      // Create a new example with default values
      const newExample = {
        title: "New Example Story",
        childName: "Child Name",
        themes: "Theme 1, Theme 2",
        voice: "Voice Name",
        voiceAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=example&backgroundColor=b6e3f4",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/default_illustration.webp",
        isPlaying: false,
        progress: "0%"
      };
      
      // Add to the current language examples
      if (!this.editedTranslations[this.currentLanguage].examples) {
        this.editedTranslations[this.currentLanguage].examples = [];
      }
      
      this.editedTranslations[this.currentLanguage].examples.push(newExample);
      
      // If this is a new language without examples, make sure to copy the structure from English
      if (this.currentLanguage !== 'en' && this.editedTranslations[this.currentLanguage].examples.length === 1) {
        // Copy all examples from English but keep the new one we just added
        const englishExamples = this.editedTranslations.en.examples || [];
        for (let i = 0; i < englishExamples.length; i++) {
          if (i === 0) {
            // Skip the first one as we already added our new example
            continue;
          }
          // Create a copy with the same structure but empty values
          const exampleCopy = { ...englishExamples[i] };
          this.editedTranslations[this.currentLanguage].examples.push(exampleCopy);
        }
      }
    },
    removeExample(index) {
      if (confirm('Are you sure you want to remove this example?')) {
        this.editedTranslations[this.currentLanguage].examples.splice(index, 1);
      }
    }
  },
  mounted() {
    // Try to load custom translations
    this.loadCustomTranslations();
  },
  template: `
    <div class="min-h-screen bg-[#FFF9F6]">
      <!-- Navigation -->
      <nav class="bg-white shadow-md py-4 px-4 sm:px-6 flex items-center justify-between mb-4">
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
        <language-switcher></language-switcher>
      </nav>
      
      <div class="admin-container p-4">
        <h1 class="text-2xl font-bold mb-4">Translation Management</h1>
        
        <!-- Language selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Select Language:</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="lang in languages" 
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="px-3 py-1 rounded"
              :class="currentLanguage === lang.code ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
            >
              {{ lang.name }}
            </button>
            <button 
              @click="showAddLanguageModal = true"
              class="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
            >
              + Add Language
            </button>
          </div>
        </div>
        
        <!-- Section selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Select Section:</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="section in sections" 
              :key="section.id"
              @click="currentSection = section.id"
              class="px-3 py-1 rounded"
              :class="currentSection === section.id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
            >
              {{ section.label }}
            </button>
          </div>
        </div>
        
        <!-- Search -->
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Search:</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search translations..." 
            class="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <!-- Translation editor -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Edit Translations</h2>
          
          <div v-if="filteredSectionData.length === 0" class="text-gray-500">
            No translations found for this section or search query.
          </div>
          
          <!-- Special UI for Examples section -->
          <div v-else-if="currentSection === 'examples'" class="space-y-6">
            <div class="flex justify-between mb-4">
              <h3 class="text-lg font-medium">Example Stories</h3>
              <button 
                @click="addNewExample" 
                class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                + Add Example
              </button>
            </div>
            
            <div 
              v-for="(example, index) in editedTranslations[currentLanguage].examples" 
              :key="index"
              class="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-medium text-lg">Example #{{ index + 1 }}</h4>
                <button 
                  @click="removeExample(index)" 
                  class="text-red-500 hover:text-red-700"
                  title="Remove this example"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Title -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Title:</label>
                  <input 
                    v-model="example.title" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Child Name -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Child's Name:</label>
                  <input 
                    v-model="example.childName" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Themes -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Themes:</label>
                  <input 
                    v-model="example.themes" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Voice -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Voice:</label>
                  <input 
                    v-model="example.voice" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Voice Avatar -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Voice Avatar URL:</label>
                  <input 
                    v-model="example.voiceAvatar" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Image -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Image URL:</label>
                  <input 
                    v-model="example.image" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Progress (for display purposes) -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Progress (e.g. "33%"):</label>
                  <input 
                    v-model="example.progress" 
                    type="text" 
                    class="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <!-- Is Playing (checkbox) -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium">
                    <input 
                      v-model="example.isPlaying" 
                      type="checkbox" 
                      class="mr-2"
                    />
                    Is Playing
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <!-- Regular translation UI for other sections -->
            <div 
              v-for="item in filteredSectionData" 
              :key="item.key"
              class="border rounded p-4"
            >
              <!-- Regular key-value pair -->
              <template v-if="!item.isObject">
                <div class="mb-2">
                  <span class="font-medium">{{ item.key }}:</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">English:</label>
                    <textarea 
                      :value="item.enValue" 
                      readonly
                      rows="2"
                      class="w-full px-3 py-2 border rounded bg-gray-50"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm text-gray-600 mb-1">{{ languages.find(l => l.code === currentLanguage)?.name }}:</label>
                    <textarea 
                      v-model="item.currentValue" 
                      @input="updateTranslation(item, item.currentValue)"
                      rows="2"
                      class="w-full px-3 py-2 border rounded"
                    ></textarea>
                  </div>
                </div>
              </template>
              
              <!-- Object with nested properties -->
              <template v-else>
                <div class="flex justify-between items-center mb-2 cursor-pointer" @click="toggleExpand(item.key)">
                  <span class="font-medium">{{ item.key }}</span>
                  <span>{{ isExpanded(item.key) ? '▼' : '►' }}</span>
                </div>
                
                <div v-if="isExpanded(item.key)" class="pl-4 border-l-2 border-gray-200 mt-2 space-y-4">
                  <div v-for="prop in item.properties" :key="prop.key" class="mt-2">
                    <div class="mb-1">
                      <span class="font-medium">{{ prop.key }}:</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">English:</label>
                        <textarea 
                          :value="prop.enValue" 
                          readonly
                          rows="2"
                          class="w-full px-3 py-2 border rounded bg-gray-50"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-sm text-gray-600 mb-1">{{ languages.find(l => l.code === currentLanguage)?.name }}:</label>
                        <textarea 
                          v-model="prop.currentValue" 
                          @input="updateObjectTranslation(item, prop, prop.currentValue)"
                          rows="2"
                          class="w-full px-3 py-2 border rounded"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <!-- Save button -->
        <div class="mt-6">
          <button 
            @click="saveTranslations" 
            :disabled="isSaving"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {{ isSaving ? 'Saving...' : 'Save Translations' }}
          </button>
          
          <div 
            v-if="saveMessage" 
            class="mt-2 p-2 rounded"
            :class="saveError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'"
          >
            {{ saveMessage }}
          </div>
        </div>
        
        <!-- Add Language Modal -->
        <div v-if="showAddLanguageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 class="text-xl font-bold mb-4">Add New Language</h2>
            
            <div class="mb-4">
              <label class="block text-sm font-medium mb-1">Language Code (2 letters):</label>
              <input 
                v-model="newLanguageCode" 
                type="text" 
                placeholder="e.g., fr, es, de" 
                class="w-full px-3 py-2 border rounded"
                maxlength="2"
              />
            </div>
            
            <div class="mb-6">
              <label class="block text-sm font-medium mb-1">Language Name:</label>
              <input 
                v-model="newLanguageName" 
                type="text" 
                placeholder="e.g., French, Spanish, German" 
                class="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div class="flex justify-end gap-2">
              <button 
                @click="cancelAddLanguage"
                class="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                @click="addNewLanguage"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                :disabled="!newLanguageCode || !newLanguageName"
              >
                Add Language
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}; 