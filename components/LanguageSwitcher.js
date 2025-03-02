// Language Switcher Component
export default {
    template: `
        <div class="language-switcher">
            <div class="relative inline-flex items-center">
                <i class="fa-solid fa-globe text-[#0EA5E9] absolute left-3 z-10 pointer-events-none"></i>
                <select 
                    v-model="currentLanguage"
                    @change="changeLanguage"
                    class="appearance-none pl-9 pr-8 py-2 rounded-full bg-[#E0F2FE] hover:bg-[#BAE6FD] border border-[#7DD3FC] text-sm text-[#0284C7] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8]"
                >
                    <option 
                        v-for="lang in languages" 
                        :key="lang.code" 
                        :value="lang.code"
                    >
                        {{ lang.name }}
                    </option>
                </select>
                <i class="fa-solid fa-chevron-down text-xs text-[#0284C7] absolute right-3 pointer-events-none"></i>
            </div>
        </div>
    `,
    data() {
        return {
            languages: window.i18n.getAvailableLanguages(),
            currentLanguage: window.i18n.getLanguage()
        };
    },
    methods: {
        changeLanguage() {
            window.i18n.setLanguage(this.currentLanguage);
            // The i18n system will now handle the notification
        }
    }
}; 