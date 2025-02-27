import { sdk } from "../sdk.js";

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
      audioLoading: false,
      audioCheckInterval: null,
      taskStatus: {
        plot: "waiting",
        story: "waiting",
        image: "waiting",
        audio: "waiting",
      },
      streamingText: "",
      formattedStory: "",
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
      BASE_FS_URL: "https://fs.webdraw.com",
      currentLanguage: window.i18n.getLanguage()
    };
  },
  watch: {
    currentLanguage(newLang, oldLang) {
      console.log(`Language changed from ${oldLang} to ${newLang}`);
      this.$forceUpdate();
    }
  },
  mounted() {
    // Debug initial translations
    this.debugTranslations();
    
    this.previewAudioElement = new Audio();
    this.previewAudioElement.addEventListener('ended', () => {
      this.isPreviewPlaying = null;
    });
    
    this.$nextTick(() => {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', this.updateAudioProgress);
        audioPlayer.addEventListener('ended', () => {
          this.isPlaying = false;
          this.audioProgress = 0;
        });
      }
    });
    
    // Listen for language change events
    if (window.eventBus) {
      window.eventBus.on('language-changed', this.handleLanguageChange);
    }
  },
  beforeUnmount() {
    const audioPlayer = this.$refs.audioPlayer;
    if (audioPlayer) {
      audioPlayer.removeEventListener('timeupdate', this.updateAudioProgress);
      audioPlayer.removeEventListener('ended', () => {});
    }
    
    // Clean up language change event listener
    if (window.eventBus) {
      window.eventBus.events['language-changed'] = window.eventBus.events['language-changed']?.filter(
        callback => callback !== this.handleLanguageChange
      );
    }
    
    // Clean up audio check interval
    if (this.audioCheckInterval) {
      clearInterval(this.audioCheckInterval);
      this.audioCheckInterval = null;
    }
  },
  methods: {
    // Handle language change events
    handleLanguageChange(lang) {
      console.log('Language change event received in CreatePage:', lang);
      this.currentLanguage = lang;
      
      // Debug translations
      this.debugTranslations();
      
      // Force re-render
      this.$forceUpdate();
    },
    
    // Debug translations
    debugTranslations() {
      console.log('Current language:', this.currentLanguage);
      console.log('i18n language:', window.i18n.getLanguage());
      console.log('Translation for create.title:', window.i18n.t('create.title'));
      console.log('Translation for create.nameLabel:', window.i18n.t('create.nameLabel'));
      console.log('Available translations:', window.i18n.translations);
    },
    
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
      this.selectVoice(voice);
      
      if (this.isPreviewPlaying === voice.id) {
        this.previewAudioElement.pause();
        this.isPreviewPlaying = null;
        return;
      }
      
      if (this.isPreviewPlaying) {
        this.previewAudioElement.pause();
      }
      
      if (voice.previewAudio) {
        voice.isLoading = true;
        
        let previewUrl = voice.previewAudio;
        if (!previewUrl.startsWith('http') && !previewUrl.startsWith('data:')) {
          previewUrl = `https://fs.webdraw.com${previewUrl.startsWith('/') ? '' : '/'}${previewUrl}`;
        }
        
        this.previewAudioElement.src = previewUrl;
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
    async generateStory() {
      if (!this.childName || !this.interests || !this.selectedVoice) {
        alert("Please fill in all fields and select a voice before creating a story.");
        return;
      }
      
      this.screen = "loading";
      
      this.storyData = null;
      this.storyImage = null;
      this.audioSource = null;
      this.streamingText = "";
      this.taskStatus = {
        plot: "loading",
        story: "waiting",
        image: "waiting",
        audio: "waiting",
      };
      
      try {
        console.log("Starting plot generation...");
        const { object } = await sdk.ai.generateObject({
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              plot: { type: "string" }
            },
            required: ["title", "plot"]
          },
          messages: [
            {
              role: "user",
              content: `Create a children's story title and plot for a ${this.childName} who is interested in ${this.interests}. The story should be educational, engaging, and appropriate for children. Keep the plot brief (2-3 sentences).`
            }
          ]
        });
        
        console.log("Plot generation complete:", object);
        this.taskStatus.plot = "done";
        this.storyData = {
          title: object.title,
          plot: object.plot,
          story: ""
        };
        
        this.taskStatus.image = "loading";
        console.log("Starting image generation...");
        const imagePromise = sdk.ai.generateImage({
          model: "stability:core",
          prompt: `Create a colorful, child-friendly illustration for a children's story titled "${object.title}" about ${this.interests}. The image should be vibrant, engaging, and suitable for children.`
        });
        
        this.taskStatus.story = "loading";
        console.log("Starting story generation...");
        const storyStream = await sdk.ai.streamText({
          messages: [
            {
              role: "user",
              content: `Write a children's story based on the following title and plot. Make it engaging, educational, and appropriate for children. Include the child's name (${this.childName}) as the main character. The story should be about ${this.interests}.
              
              Title: ${object.title}
              Plot: ${object.plot}
              
              Write a complete story with a beginning, middle, and end. The story should be 3-4 paragraphs long.`
            }
          ]
        });
        
        this.storyData.story = "";
        for await (const chunk of storyStream) {
          this.streamingText += chunk.text;
          this.storyData.story += chunk.text;
        }
        
        this.storyData.story = this.formatStoryText(this.storyData.story);
        
        console.log("Story generation complete:", this.storyData.story);
        this.taskStatus.story = "done";
        
        const imageResult = await imagePromise;
        console.log("Raw image generation result:", JSON.stringify(imageResult));
        
        if (imageResult.url) {
          this.storyImage = imageResult.url;
        } else if (imageResult.filepath) {
          this.storyImage = imageResult.filepath;
        } else if (imageResult.images && imageResult.images.length > 0) {
          this.storyImage = imageResult.images[0];
        } else {
          console.warn("Unexpected image result format:", imageResult);
          this.storyImage = null;
        }
        
        if (this.storyImage && !this.storyImage.startsWith('http')) {
          this.storyImage = `https://fs.webdraw.com${this.storyImage.startsWith('/') ? '' : '/'}${this.storyImage}`;
        }
        
        console.log("Final image URL:", this.storyImage);
        
        // Set permissions for the image file immediately
        try {
          if (imageResult.filepath) {
            await this.setFilePermissions(imageResult.filepath);
            console.log("Set permissions for image file:", imageResult.filepath);
          } else if (imageResult.images && imageResult.images.length > 0) {
            await this.setFilePermissions(imageResult.images[0]);
            console.log("Set permissions for image file:", imageResult.images[0]);
          }
        } catch (permError) {
          console.warn("Error setting permissions for image file:", permError);
        }
        
        this.taskStatus.image = "done";
        
        this.taskStatus.audio = "loading";
        console.log("Starting audio generation...");
        const audioText = `${this.storyData.title}. ${this.storyData.story}`;
        
        const chosenVoice = this.selectedVoice || this.voices[0];
        
        const audioResponse = await sdk.ai.generateAudio({
          model: "elevenlabs:tts",
          prompt: audioText,
          providerOptions: {
            elevenLabs: {
              voiceId: chosenVoice.id,
              model_id: "eleven_turbo_v2_5",
              optimize_streaming_latency: 0,
              voice_settings: {
                speed: 0.9,
                similarity_boost: 0.85,
                stability: 0.75,
                style: 0,
              },
            },
          },
        });
        
        console.log("Audio generation complete:", audioResponse);
        
        let audioPath = null;
        
        if (audioResponse.filepath && audioResponse.filepath.length > 0) {
          audioPath = audioResponse.filepath[0];
          console.log("Using filepath as audio source:", audioPath);
        } else if (audioResponse.audios && audioResponse.audios.length > 0) {
          audioPath = audioResponse.audios[0];
          console.log("Using audios array as audio source:", audioPath);
        } else if (audioResponse.url) {
          audioPath = audioResponse.url;
          console.log("Using url as audio source:", audioPath);
        } else {
          console.warn("No recognizable audio source found in response:", audioResponse);
          alert("Audio was generated but the source format is not recognized. The audio playback may not work.");
        }
        
        let fullAudioUrl = null;
        if (audioPath) {
          if (!audioPath.startsWith('http') && !audioPath.startsWith('data:')) {
            fullAudioUrl = `https://fs.webdraw.com${audioPath.startsWith('/') ? '' : '/'}${audioPath}`;
          } else {
            fullAudioUrl = audioPath;
          }
          console.log("Final audio source with domain:", fullAudioUrl);
          
          // Set permissions for the audio file immediately
          try {
            await this.setFilePermissions(audioPath);
            console.log("Set permissions for audio file:", audioPath);
          } catch (permError) {
            console.warn("Error setting permissions for audio file:", permError);
          }
          
          // Set audio source immediately but mark as loading
          this.audioSource = fullAudioUrl;
          this.audioLoading = true;
          
          // Do an initial check
          console.log("Checking if audio file is ready...");
          const isAudioReady = await this.checkAudioReady(fullAudioUrl, 3, 1000);
          
          if (isAudioReady) {
            console.log("Audio file is confirmed ready");
            this.audioLoading = false;
          } else {
            console.log("Audio file not immediately available, will continue checking in background");
            // Start background checking
            this.startBackgroundAudioCheck(fullAudioUrl);
          }
        }
        
        this.taskStatus.audio = "done";
        
        this.screen = "result";
        
        await this.saveStory();
        
      } catch (error) {
        console.error("Error generating story:", error);
        alert("There was an error generating your story. Please try again.");
        this.screen = "form";
      }
    },
    startBackgroundAudioCheck(url) {
      // Clear any existing interval
      if (this.audioCheckInterval) {
        clearInterval(this.audioCheckInterval);
      }
      
      let attempts = 0;
      const maxAttempts = 30; // Check for up to 5 minutes (30 * 10 seconds)
      
      this.audioCheckInterval = setInterval(async () => {
        attempts++;
        console.log(`Background audio check attempt ${attempts}/${maxAttempts}`);
        
        try {
          // Use a GET request with range headers instead of HEAD
          const response = await fetch(url, { 
            method: 'GET',
            headers: {
              'Range': 'bytes=0-1' // Just request the first 2 bytes
            }
          });
          
          if (response.ok || response.status === 206) { // 206 is Partial Content
            console.log(`Audio file response status: ${response.status}`);
            
            // If we got a response, the file likely exists and is accessible
            console.log('Audio file is now ready!');
            
            // Extract the path from the URL and set permissions
            try {
              const audioPath = url.includes(this.BASE_FS_URL) 
                ? url.replace(this.BASE_FS_URL, '') 
                : url;
              
              await this.setFilePermissions(audioPath);
              console.log("Set permissions for audio file in background check:", audioPath);
            } catch (permError) {
              console.warn("Error setting permissions for audio file in background check:", permError);
            }
            
            this.audioLoading = false;
            clearInterval(this.audioCheckInterval);
            this.audioCheckInterval = null;
            
            // Force audio element to reload the source
            this.$nextTick(() => {
              const audioPlayer = this.$refs.audioPlayer;
              if (audioPlayer) {
                audioPlayer.load();
              }
            });
          } else {
            console.log(`Audio file not ready yet (status: ${response.status}), will continue checking...`);
          }
        } catch (error) {
          console.warn(`Error in background audio check: ${error.message}`);
        }
        
        // Stop checking after max attempts
        if (attempts >= maxAttempts) {
          console.warn('Max background check attempts reached');
          this.audioLoading = false;
          clearInterval(this.audioCheckInterval);
          this.audioCheckInterval = null;
        }
      }, 10000); // Check every 10 seconds
    },
    toggleAudio() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer && !this.audioLoading) {
        if (this.isPlaying) {
          audioPlayer.pause();
          this.isPlaying = false;
        } else {
          audioPlayer.play().catch(error => {
            console.error("Error playing audio:", error);
            // If we get an error playing, it might be that the file isn't ready yet
            if (error.name === 'NotSupportedError' || error.name === 'NotAllowedError') {
              console.log("Audio playback failed, checking if file is ready...");
              this.audioLoading = true;
              this.startBackgroundAudioCheck(this.audioSource);
            }
          });
          this.isPlaying = true;
        }
      }
    },
    updateAudioProgress() {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer && !isNaN(audioPlayer.duration)) {
        this.audioProgress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      }
    },
    seekAudio(e) {
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer && !isNaN(audioPlayer.duration)) {
        const seekPosition = (e.target.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekPosition;
        this.audioProgress = e.target.value;
      }
    },
    downloadAudio() {
      if (this.audioSource && !this.audioLoading) {
        const a = document.createElement('a');
        a.href = this.audioSource;
        a.download = `${this.storyData.title.replace(/\s+/g, '_')}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        console.log("Downloading audio from:", this.audioSource);
      }
    },
    goBack() {
      this.screen = "form";
    },
    async checkAudioReady(url, maxAttempts = 10, delayMs = 1000) {
      if (!url) return false;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          console.log(`Checking audio availability (attempt ${attempt + 1}/${maxAttempts})...`);
          
          // Use a GET request with range headers instead of HEAD
          // This requests just the first few bytes of the file
          const response = await fetch(url, { 
            method: 'GET',
            headers: {
              'Range': 'bytes=0-1' // Just request the first 2 bytes
            }
          });
          
          if (response.ok || response.status === 206) { // 206 is Partial Content
            console.log(`Audio file response status: ${response.status}`);
            
            // If we got a response, the file likely exists and is accessible
            console.log('Audio file is ready!');
            return true;
          }
          
          console.log(`Audio file not ready yet (status: ${response.status}), waiting ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (error) {
          console.warn(`Error checking audio file: ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      console.warn('Max attempts reached, audio file may not be fully available');
      return false;
    },
    formatStoryText(text) {
      if (!text) return '';
      
      text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
      text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
      text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
      
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      text = text.replace(/\n\n/g, '\n\n');
      
      return text;
    },
    safeFolderName(name) {
      if (!name) return 'untitled';
      return name.replace(/[^a-zA-Z0-9_\-\s]/g, '_').substring(0, 100);
    },
    
    generateExcerpt(story) {
      if (!story) return '';
      const plainText = story.replace(/<[^>]*>/g, '');
      return plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
    },
    
    async saveStory() {
      if (!this.storyData || !this.storyData.title) {
        console.error("Cannot save story: No story data available");
        return;
      }
      
      try {
        console.log("DEBUG: Starting saveStory method");
        console.log("DEBUG: SDK available?", !!sdk);
        console.log("DEBUG: SDK.fs available?", !!(sdk && sdk.fs));
        console.log("DEBUG: SDK.fs.write available?", !!(sdk && sdk.fs && typeof sdk.fs.write === 'function'));
        
        const timestamp = new Date().toISOString();
        const safeName = this.safeFolderName(this.storyData.title);
        console.log("DEBUG: Safe folder name generated:", safeName);
        
        const excerpt = this.generateExcerpt(this.storyData.story);
        
        console.log("Debug - Story image URL before processing:", this.storyImage);
        
        let imageFilepath = null;
        if (this.storyImage) {
          if (this.storyImage.includes(this.BASE_FS_URL)) {
            imageFilepath = this.storyImage.replace(this.BASE_FS_URL, '');
            console.log("Extracted image filepath from URL:", imageFilepath);
          } else {
            imageFilepath = this.storyImage;
            console.log("Using full image URL as filepath:", imageFilepath);
          }
          
          // Set permissions for image file
          await this.setFilePermissions(imageFilepath);
        } else {
          console.warn("No story image URL available");
        }
        
        let audioFilepath = null;
        if (this.audioSource) {
          if (this.audioSource.includes(this.BASE_FS_URL)) {
            audioFilepath = this.audioSource.replace(this.BASE_FS_URL, '');
            console.log("Extracted audio filepath from URL:", audioFilepath);
          } else {
            audioFilepath = this.audioSource;
            console.log("Using full audio URL as filepath:", audioFilepath);
          }
          
          // Set permissions for audio file
          await this.setFilePermissions(audioFilepath);
        } else {
          console.warn("No audio source URL available");
        }
        
        const newGeneration = {
          title: this.storyData.title,
          coverUrl: this.storyImage || null,
          excerpt: excerpt,
          story: this.storyData.story,
          audioUrl: this.audioSource || null,
          createdAt: timestamp,
          voice: this.selectedVoice,
          childName: this.childName,
          themes: this.interests
        };
        
        console.log("Story object to save:", JSON.stringify(newGeneration, null, 2));
        
        let baseFilename = `~/AI Storyteller/${safeName}`;
        let filename = `${baseFilename}.json`;
        let counter = 1;
        
        try {
          console.log("DEBUG: Checking if file already exists:", filename);
          while (true) {
            try {
              await sdk.fs.read(filename);
              console.log("DEBUG: File already exists, incrementing counter:", filename);
              filename = `${baseFilename}_${counter}.json`;
              counter++;
            } catch (e) {
              console.log("DEBUG: File does not exist, will use this filename:", filename);
              break;
            }
          }
        } catch (e) {
          console.log("Error checking for existing file:", e);
          console.log("DEBUG: Error details:", e.message, e.stack);
        }
        
        console.log("Saving story to:", filename);
        try {
          await sdk.fs.write(filename, JSON.stringify(newGeneration, null, 2));
          console.log("DEBUG: Write operation completed");
          
          // Verify the file was written
          try {
            const content = await sdk.fs.read(filename);
            console.log("DEBUG: Verification - File exists and has content:", !!content);
          } catch (verifyError) {
            console.error("DEBUG: Verification failed - Could not read the file after writing:", verifyError);
          }
          
          // Set permissions for story JSON file
          await this.setFilePermissions(filename);
          
          console.log("Story saved successfully!");
        } catch (writeError) {
          console.error("DEBUG: Error during write operation:", writeError);
          console.error("DEBUG: Error details:", writeError.message, writeError.stack);
          throw writeError;
        }
        
        return true;
      } catch (error) {
        console.error("Error saving story:", error);
        console.error("DEBUG: Error details:", error.message, error.stack);
        alert("There was an error saving your story. Please try again.");
        return false;
      }
    },
    
    // Helper method to set file permissions
    async setFilePermissions(filepath) {
      if (!filepath) return;
      
      try {
        console.log("DEBUG: Starting setFilePermissions for:", filepath);
        // Clean up the filepath
        let cleanPath = filepath;
        
        // Remove any URL prefix
        if (cleanPath.startsWith('http')) {
          const url = new URL(cleanPath);
          cleanPath = url.pathname;
          console.log("DEBUG: Removed URL prefix, now:", cleanPath);
        }
        
        // Remove the leading ~ if present
        if (cleanPath.startsWith('~')) {
          cleanPath = cleanPath.substring(1);
          console.log("DEBUG: Removed leading ~, now:", cleanPath);
        }
        
        // Ensure the path doesn't start with double slashes
        while (cleanPath.startsWith('//')) {
          cleanPath = cleanPath.substring(1);
          console.log("DEBUG: Removed extra slash, now:", cleanPath);
        }
        
        console.log(`Setting permissions for: ${cleanPath}`);
        console.log("DEBUG: SDK.fs.chmod available?", !!(sdk && sdk.fs && typeof sdk.fs.chmod === 'function'));
        
        try {
          await sdk.fs.chmod(cleanPath, 0o444);
          console.log(`Successfully set read-only permissions for: ${cleanPath}`);
        } catch (chmodError) {
          console.warn(`Could not set file permissions with chmod for ${cleanPath}:`, chmodError);
          console.log("DEBUG: Error details:", chmodError.message, chmodError.stack);
          
          // Try alternative approach if chmod fails
          try {
            if (typeof sdk.fs.setPermissions === 'function') {
              console.log("DEBUG: Trying alternative setPermissions method");
              await sdk.fs.setPermissions(cleanPath, { readable: true, writable: false, executable: false });
              console.log(`Successfully set permissions using alternative method for: ${cleanPath}`);
            }
          } catch (altError) {
            console.warn("Alternative permission setting also failed:", altError);
          }
        }
      } catch (error) {
        console.warn(`Could not set file permissions for ${filepath}:`, error);
        console.log("DEBUG: Error details:", error.message, error.stack);
      }
    },
    handleAudioError(event) {
      console.error('Audio error:', event);
      // If we get an error, it might be that the file isn't ready yet or has permission issues
      if (this.audioSource) {
        console.log("Audio error occurred, attempting to fix permissions and start background check...");
        
        // Try to set permissions for the audio file
        try {
          const audioPath = this.audioSource.includes(this.BASE_FS_URL) 
            ? this.audioSource.replace(this.BASE_FS_URL, '') 
            : this.audioSource;
          
          this.setFilePermissions(audioPath)
            .then(() => {
              console.log("Set permissions for audio file after error:", audioPath);
              
              // Reload the audio element
              this.$nextTick(() => {
                const audioPlayer = this.$refs.audioPlayer;
                if (audioPlayer) {
                  audioPlayer.load();
                }
              });
            })
            .catch(permError => {
              console.warn("Error setting permissions for audio file after error:", permError);
            });
        } catch (error) {
          console.warn("Error processing audio path for permissions:", error);
        }
        
        // Start background check
        this.audioLoading = true;
        this.startBackgroundAudioCheck(this.audioSource);
      }
    },
    handleAudioReady(event) {
      console.log('Audio canplaythrough event:', event);
      this.audioLoading = false;
    },
  },
  template: `
    <div class="min-h-screen" style="background-color: #FFF9F6;">
      <nav class="bg-white shadow-md py-4 px-4 sm:px-6 flex items-center justify-between">
        <div class="flex items-center space-x-1 sm:space-x-4 overflow-x-auto whitespace-nowrap">
          <router-link to="/" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
            {{ $t('ui.home') }}
          </router-link>
          <router-link to="/create" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg bg-[#E0F2FE] text-[#0284C7] font-medium text-sm sm:text-base">
            {{ $t('ui.new') }}
          </router-link>
          <router-link to="/my-stories" class="px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[#00B7EA] hover:bg-[#F0F9FF] text-sm sm:text-base">
            {{ $t('ui.myStories') }}
          </router-link>
        </div>
        <language-switcher></language-switcher>
      </nav>
      
      <button
        v-if="screen === 'loading' || screen === 'result'"
        @click="goBack"
        class="fixed top-20 left-4 bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ $t('ui.back') }}
      </button>

      <div v-if="screen === 'form' || screen === 'loading'" class="max-w-3xl mx-auto w-full px-4 pt-6 pb-16">
        <template v-if="screen === 'loading'">
          <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 mb-8 border-4 border-gray-300 min-h-[250px]">
            <div class="space-y-4">
              <div class="flex items-center gap-4" v-for="(status, task) in taskStatus" :key="task">
                <div class="w-8 h-8 flex-shrink-0">
                  <svg v-if="status === 'loading'" class="animate-spin" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <svg v-else-if="status === 'done'" class="text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="status === 'error'" class="text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="flex-1 flex items-center justify-between gap-2">
                  <span class="text-lg capitalize whitespace-nowrap">
                    {{ task === 'plot' ? $t('create.generatingPlot') : 
                       task === 'story' ? $t('create.generatingStory') : 
                       task === 'image' ? $t('create.generatingImage') : 
                       $t('create.generatingAudio') }}
                  </span>
                  <span v-if="task === 'story' && streamingText" class="text-sm text-gray-500 italic truncate max-w-md">
                    "...{{ streamingText.slice(-50) }}"
                  </span>
                  <span v-else-if="task === 'plot' && storyData && storyData.title" class="text-sm text-gray-500 italic truncate max-w-md">
                    "{{ storyData.title }}"
                  </span>
                  <span v-else-if="task === 'image' && taskStatus.image === 'done'" class="text-sm text-gray-500 italic">
                    "{{ $t('create.imageCreated') }}"
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="rounded-2xl p-8">
            <h2 class="text-3xl font-semibold text-[#00B7EA] mb-8 text-center">{{ $t('create.title') }}</h2>
            <div class="space-y-8">
              <div class="space-y-3">
                <label class="block text-lg font-medium text-gray-700">{{ $t('create.nameLabel') }}:</label>
                <input type="text" :placeholder="$t('create.namePlaceholder')" v-model="childName" :disabled="screen === 'loading'" class="w-full px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white text-lg" />
              </div>

              <div class="space-y-3">
                <label class="block text-lg font-medium text-gray-700">{{ $t('create.interestsLabel') }}</label>
                <div class="relative border border-gray-200 rounded-xl">
                  <textarea :placeholder="$t('create.interestsPlaceholder')" v-model="interests" rows="2" :disabled="screen === 'loading'" class="w-full px-6 py-3 border-0 rounded-xl focus:ring-2 focus:ring-sky-500 resize-none text-lg"></textarea>
                  <button type="button" @click="randomTheme" class="absolute right-4 bottom-4 bg-[#008CBD] text-white px-3 py-2 rounded-full text-xs flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                    {{ $t('create.randomTheme') }}
                  </button>
                </div>

                <div class="flex flex-wrap gap-3 mt-4">
                  <span class="bg-[#22C55E] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Rockets')">Rockets</span>
                  <span class="bg-[#00B7EA] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Pirates')">Pirates</span>
                  <span class="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Space')">Space</span>
                  <span class="bg-[#EF4444] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Dinosaurs')">Dinosaurs</span>
                  <span class="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Helping Others')">Helping Others</span>
                  <span class="bg-[#22C55E] text-white px-3 py-1 rounded-full text-xs cursor-pointer" @click="addInterest('Respecting your Elders')">Respecting your Elders</span>
                </div>
              </div>

              <div class="space-y-3">
                <label class="block text-lg font-medium text-gray-700">{{ $t('create.voiceLabel') }}</label>
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

              <button @click="generateStory" :disabled="screen === 'loading'" class="w-full px-8 py-4 bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white rounded-full flex items-center justify-center gap-3 hover:bg-sky-700 transition-all duration-200 text-xl font-medium mt-8 border border-[#0369A1]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                {{ $t('create.createButton') }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <div v-if="screen === 'result'" class="max-w-3xl mx-auto pt-6 pb-16 px-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border-4 border-gray-300">
          <div class="space-y-6 mb-6">
            <img v-if="storyImage" :src="storyImage" alt="Magic Illustration" class="w-full rounded-xl border-4 border-gray-200 shadow-lg" />
          </div>

          <div class="audio-controls mb-8 space-y-4" v-if="audioSource">
            <div class="flex items-center gap-4">
              <button @click="toggleAudio" class="p-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white" :disabled="audioLoading">
                <svg v-if="audioLoading" class="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path v-if="isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div class="w-full flex items-center gap-2">
                <input type="range" v-model="audioProgress" @input="seekAudio" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" :disabled="audioLoading" />
                <span v-if="audioLoading" class="text-xs text-gray-500 animate-pulse">{{ $t('ui.loading') || 'Loading...' }}</span>
              </div>
              <a @click="downloadAudio" class="p-2 text-sky-500 hover:text-sky-800 cursor-pointer" :title="$t('ui.download')" :class="{ 'opacity-50 cursor-not-allowed': audioLoading }" :disabled="audioLoading">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>

          <div v-if="storyData" class="prose-lg text-gray-700 space-y-4">
            <h2 class="text-3xl font-bold text-sky-500 mb-6">{{ storyData.title }}</h2>
            <div class="space-y-6 whitespace-pre-line" v-html="storyData.story"></div>
          </div>

          <div class="mt-8 text-center">
            <router-link to="/my-stories" class="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span class="font-semibold">{{ $t('myStories.pageTitle') }}</span>
              <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>

      <audio 
        ref="audioPlayer" 
        @error="handleAudioError" 
        @canplaythrough="handleAudioReady"
      >
        <source v-if="audioSource" :src="audioSource" type="audio/mpeg" />
        {{ $t('ui.audioNotSupported') }}
      </audio>
    </div>
  `
}; 