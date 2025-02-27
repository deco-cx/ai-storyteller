// Language Switcher Component
export default {
    template: `
        <div class="language-switcher">
            <div class="relative">
                <button 
                    @click="toggleDropdown" 
                    class="flex items-center gap-2 px-3 py-2 rounded-full bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#7DD3FC] text-sm text-[#0284C7] font-medium transition-colors"
                >
                    <i class="fa-solid fa-globe text-[#0EA5E9]"></i>
                    <span>{{ currentLanguageName }}</span>
                    <i class="fa-solid fa-chevron-down text-xs"></i>
                </button>
                
                <div 
                    v-if="isOpen" 
                    class="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]"
                >
                    <button 
                        v-for="lang in languages" 
                        :key="lang.code"
                        @click="changeLanguage(lang.code)"
                        class="block w-full text-left px-4 py-2 hover:bg-[#E0F2FE] text-sm"
                        :class="{ 'font-medium text-[#0284C7] bg-[#F0F9FF]': currentLanguage === lang.code }"
                    >
                        {{ lang.name }}
                    </button>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            isOpen: false,
            languages: window.i18n.getAvailableLanguages(),
            currentLanguage: window.i18n.getLanguage()
        };
    },
    computed: {
        currentLanguageName() {
            const lang = this.languages.find(l => l.code === this.currentLanguage);
            return lang ? lang.name : this.currentLanguage;
        }
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        changeLanguage(code) {
            if (this.currentLanguage !== code) {
                window.i18n.setLanguage(code);
                this.currentLanguage = code;
                // The i18n system will now handle the notification
            }
            this.isOpen = false;
        },
        handleClickOutside(event) {
            if (this.isOpen && !this.$el.contains(event.target)) {
                this.isOpen = false;
            }
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }
}; 