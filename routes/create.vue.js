window.CreatePage = {
  data() {
    return {
      screen: "form",
      childName: "",
      interests: "",
      storyData: null,
      storyImage: null,
      audioSource: null,
      isPlaying: false,
      audioProgress: 0,
      taskStatus: {
        story: "waiting",
        image: "waiting",
        audio: "waiting",
      },
      streamingText: "",
      voices: [
        { 
          id: "D38z5RcWu1voky8WS1ja", 
          name: "Fin (Legacy)", 
          audioUrl: null, 
          status: "pending", 
          previewAudio: "/audio/fin_preview.mp3", 
          isLoading: false,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=D38z5RcWu1voky8WS1ja&backgroundColor=b6e3f4"
        },
        { 
          id: "NOpBlnGInO9m6vDvFkFC", 
          name: "Vô Zé", 
          audioUrl: null, 
          status: "pending", 
          previewAudio: "/audio/voze_preview.mp3", 
          isLoading: false,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NOpBlnGInO9m6vDvFkFC&backgroundColor=c0aede"
        },
        { 
          id: "jBpfuIE2acCO8z3wKNLl", 
          name: "Gigi", 
          audioUrl: null, 
          status: "pending", 
          previewAudio: "/audio/gigi_preview.mp3", 
          isLoading: false,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jBpfuIE2acCO8z3wKNLl&backgroundColor=ffdfbf"
        },
        { 
          id: "pFZP5JQG7iQjIQuC4Bku", 
          name: "Lily", 
          audioUrl: null, 
          status: "pending", 
          previewAudio: "/audio/lily_preview.mp3", 
          isLoading: false,
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pFZP5JQG7iQjIQuC4Bku&backgroundColor=d1f4d9"
        },
      ],
      selectedVoice: null,
      isPreviewPlaying: null,
      previewAudioElement: null,
    };
  },
  mounted() {
    // Create audio element for voice previews
    this.previewAudioElement = new Audio();
    this.previewAudioElement.addEventListener('ended', () => {
      this.isPreviewPlaying = null;
    });
  },
  methods: {
    selectVoice(voice) {
      this.selectedVoice = voice;
    },
    addInterest(suggestion) {
      const interestText = suggestion;
      let currentInterests = this.interests
        .split(/,\s*|\s+and\s+/gi)
        .map(i => i.trim())
        .filter(i => i);
      const index = currentInterests.indexOf(interestText);
      if (index > -1) {
        currentInterests.splice(index, 1);
      } else if (currentInterests.length < 6) {
        currentInterests.push(interestText);
      }
      if (currentInterests.length === 0) {
        this.interests = "";
      } else if (currentInterests.length === 1) {
        this.interests = currentInterests[0];
      } else if (currentInterests.length === 2) {
        this.interests = currentInterests.join(" and ");
      } else {
        const allButLast = currentInterests.slice(0, -1).join(", ");
        const last = currentInterests[currentInterests.length - 1];
        this.interests = `${allButLast} and ${last}`;
      }
    },
    randomTheme() {
      const randomThemes = [
        "Fairy Tales",
        "Robots in the City",
        "Underwater Adventure",
        "Magical Forest",
        "Ninjas and Samurai",
        "Galactic Warriors",
        "Candy Kingdom",
      ];
      const randomPick = randomThemes[Math.floor(Math.random() * randomThemes.length)];
      this.addInterest(randomPick);
    },
    playVoicePreview(voice) {
      // Select the voice when clicking the play button
      this.selectVoice(voice);
      
      // If this voice is already playing, pause it
      if (this.isPreviewPlaying === voice.id) {
        this.previewAudioElement.pause();
        this.isPreviewPlaying = null;
        return;
      }
      
      // If another voice is playing, stop it
      if (this.isPreviewPlaying) {
        this.previewAudioElement.pause();
      }
      
      // Set the audio source to this voice's preview
      if (voice.previewAudio) {
        voice.isLoading = true;
        
        this.previewAudioElement.src = voice.previewAudio;
        this.previewAudioElement.oncanplaythrough = () => {
          voice.isLoading = false;
          this.previewAudioElement.play();
          this.isPreviewPlaying = voice.id;
        };
        
        this.previewAudioElement.onerror = () => {
          voice.isLoading = false;
          console.error("Error loading audio preview for", voice.name);
          alert(`Could not load audio preview for ${voice.name}`);
        };
      }
    },
    generateStory() {
      this.screen = "loading";
      
      // Reset states
      this.storyData = null;
      this.storyImage = "";
      this.audioSource = "";
      this.taskStatus = {
        story: "loading",
        image: "loading",
        audio: "idle",
      };
      
      // Simulate story generation
      setTimeout(() => {
        this.streamingText = "Once upon a time in a magical forest...";
        this.taskStatus.story = "done";
        
        // Simulate image generation completion
        setTimeout(() => {
          this.storyImage = "https://placehold.co/600x400/e6fcc7/005B79?text=Story+Illustration";
          this.taskStatus.image = "done";
          
          // Simulate audio generation
          this.taskStatus.audio = "loading";
          setTimeout(() => {
            this.audioSource = "https://example.com/audio.mp3";
            this.taskStatus.audio = "done";
            
            // Set story data
            this.storyData = {
              title: "The Magical Adventure",
              story: "Once upon a time in a magical forest, " + this.childName + " discovered a hidden path. Following it led to an amazing adventure with new friends and valuable lessons about " + this.interests + "."
            };
            
            // Show result
            this.screen = "result";
          }, 2000);
        }, 1500);
      }, 2000);
    },
    toggleAudio() {
      this.isPlaying = !this.isPlaying;
      // In a real implementation, this would control audio playback
    },
    seekAudio(e) {
      this.audioProgress = e.target.value;
      // In a real implementation, this would seek the audio
    },
    downloadAudio() {
      // In a real implementation, this would download the audio
      alert("Audio download functionality would be implemented here");
    },
    goBack() {
      this.screen = "form";
    }
  },
  template: `
    <div class="min-h-screen" style="background-color: #FFF9F6;">
      <!-- Back Button (visible in loading and result screens) -->
      <button
        v-if="screen === 'loading' || screen === 'result'"
        @click="goBack"
        class="fixed top-4 left-4 bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <!-- Form and Loading Screens -->
      <div v-if="screen === 'form' || screen === 'loading'" class="max-w-3xl mx-auto w-full px-4 py-16">
        <!-- Loading State -->
        <template v-if="screen === 'loading'">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 mb-8 border-4 border-gray-300 min-h-[250px]">
            <div class="space-y-4">
              <!-- Status of each task -->
              <div class="flex items-center gap-4" v-for="(status, task) in taskStatus" :key="task">
                <div class="w-8 h-8 flex-shrink-0">
                  <!-- Spinner -->
                  <svg v-if="status === 'loading'" class="animate-spin" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <!-- Check -->
                  <svg v-else-if="status === 'done'" class="text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <!-- Error -->
                  <svg v-else-if="status === 'error'" class="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="flex-1 flex items-center justify-between gap-2">
                  <span class="text-lg capitalize whitespace-nowrap">
                    {{ task === 'story' ? 'Writing Story' : task === 'image' ? 'Creating Illustration' : 'Generating Narration' }}
                  </span>
                  <span v-if="task === 'story' && streamingText" class="text-sm text-gray-500 italic truncate">
                    "...{{ streamingText }}"
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Form State -->
        <template v-else>
          <div class="rounded-2xl p-8">
            <h2 class="text-3xl font-semibold text-[#00B7EA] mb-8 text-center">Create Your Story</h2>
            <div class="space-y-8">
              <!-- Child's Name -->
              <div class="space-y-3">
                <label class="block text-lg font-medium text-gray-700">Child's Name:</label>
                <input type="text" placeholder="Name" v-model="childName" :disabled="screen === 'loading'" class="w-full px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-lg" />
              </div>

              <!-- Themes -->
              <div class="space-y-3">
                <label class="block text-lg font-medium text-gray-700">Themes</label>
                <div class="relative border border-gray-200 rounded-xl">
                  <textarea placeholder="Type your ideas or select the tags below..." v-model="interests" rows="2" :disabled="screen === 'loading'" class="w-full px-6 py-3 border-0 rounded-xl focus:ring-2 focus:ring-sky-500 resize-none text-lg"></textarea>
                  <button type="button" @click="randomTheme" class="absolute right-4 bottom-4 bg-[#008CBD] text-white px-3 py-2 rounded-full text-xs flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    Random Theme
                  </button>
                </div>

                <!-- Theme Tags -->
                <div class="flex flex-wrap gap-3 mt-4">
                  <span class="bg-[#22C55E] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Rockets')">Rockets</span>
                  <span class="bg-[#00B7EA] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Pirates')">Pirates</span>
                  <span class="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Space')">Space</span>
                  <span class="bg-[#EF4444] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Dinosaurs')">Dinosaurs</span>
                  <span class="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Helping Others')">Helping Others</span>
                  <span class="bg-[#22C55E] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Respecting your Elders')">Respecting your Elders</span>
                </div>
              </div>

              <!-- Voice Selection -->
              <div class="space-y-3">
                <label class="block text-lg font-medium text-gray-700">Voice</label>
                <div class="border border-gray-200 rounded-xl overflow-hidden">
                  <div 
                    v-for="voice in voices" 
                    :key="voice.id"
                    class="p-3 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    :class="{ 'bg-[#DAF3FD]': selectedVoice && selectedVoice.id === voice.id }"
                    @click="selectVoice(voice)"
                  >
                    <div class="flex items-center gap-4">
                      <img :src="voice.avatar" :alt="voice.name" class="w-10 h-10 rounded-full" />
                      <span class="text-lg">{{ voice.name }}</span>
                    </div>
                    <button 
                      @click.stop="playVoicePreview(voice)"
                      class="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white"
                      :title="isPreviewPlaying === voice.id ? 'Pause preview' : 'Play preview'"
                    >
                      <svg v-if="!voice.isLoading" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path v-if="isPreviewPlaying !== voice.id" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        <path v-else d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" />
                      </svg>
                      <svg v-else class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Create Story Button -->
              <button @click="generateStory" :disabled="screen === 'loading'" class="w-full px-8 py-4 bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white rounded-full flex items-center justify-center gap-3 hover:bg-sky-700 transition-all duration-200 text-xl font-medium mt-8 border border-[#0369A1]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Create new story!
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Result Screen -->
      <div v-if="screen === 'result'" class="max-w-3xl mx-auto py-16">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-4 border-gray-300">
          <div class="space-y-6 mb-6">
            <!-- Story Illustration -->
            <img v-if="storyImage" :src="storyImage" alt="Magic Illustration" class="w-full rounded-xl border-4 border-gray-200 shadow-lg" />
          </div>

          <!-- Audio Controls -->
          <div class="audio-controls mb-8 space-y-4" v-if="audioSource">
            <div class="flex items-center gap-4">
              <button @click="toggleAudio" class="p-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path v-if="isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <input type="range" v-model="audioProgress" @input="seekAudio" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" />
              <a @click="downloadAudio" class="p-2 text-sky-500 hover:text-sky-800 cursor-pointer" title="Download">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Story Text -->
          <div v-if="storyData" class="prose-lg text-gray-700 space-y-4">
            <h2 class="text-3xl font-bold text-sky-500 mb-6">{{ storyData.title }}</h2>
            <div class="space-y-6">{{ storyData.story }}</div>
          </div>

          <!-- Link to My Stories -->
          <div class="mt-8 text-center">
            <a href="/my-stories.html" class="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span class="font-semibold">See all your stories</span>
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Hidden Audio Element -->
      <audio ref="audioPlayer">
        <source :src="audioSource" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  `
}; 