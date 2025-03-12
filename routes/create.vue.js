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
      voices: [],
      selectedVoice: null,
      isPreviewPlaying: null,
      preloadedAudios: {},
      BASE_FS_URL: "https://fs.webdraw.com",
      currentLanguage: window.i18n.getLanguage(),
      interestSuggestions: [],
      showWarningModal: false,
      warningModalData: {
        title: "",
        message: "",
        type: "warning"
      }
    };
  },
  watch: {
    currentLanguage(newLang, oldLang) {
      console.log(`Language changed from ${oldLang} to ${newLang}`);
      // Update the voices array when language changes
      this.updateVoicesForLanguage();
      this.$forceUpdate();
    }
  },
  mounted() {
    // Debug initial translations
    this.debugTranslations();
    
    // Initialize voices based on current language
    // Check if translations are loaded first
    if (window.i18n && window.i18n.translations) {
      this.updateVoicesForLanguage();
      this.updateInterestSuggestions();
      
      // Check if we have example data in localStorage
      const exampleDataString = localStorage.getItem('createFromExample');
      if (exampleDataString) {
        try {
          const exampleData = JSON.parse(exampleDataString);
          
          // Pre-fill form with example data
          if (exampleData.childName) this.childName = exampleData.childName;
          if (exampleData.themes) this.interests = exampleData.themes;
          
          // Select the voice if it exists in our voices array
          if (exampleData.voice && this.voices.length > 0) {
            const matchingVoice = this.voices.find(v => v.name === exampleData.voice);
            if (matchingVoice) {
              this.selectedVoice = matchingVoice;
            }
          }
          
          // Clear the localStorage item after using it
          localStorage.removeItem('createFromExample');
        } catch (error) {
          console.error('Error parsing example data from localStorage:', error);
          localStorage.removeItem('createFromExample');
        }
      }
      
      // Check for URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const themes = urlParams.get('themes');
      const voiceId = urlParams.get('voiceId');
      
      // Pre-fill the themes if provided
      if (themes) {
        this.interests = themes;
      }
      
      // Pre-select the voice if provided
      if (voiceId && this.voices.length > 0) {
        const matchingVoice = this.voices.find(voice => voice.id === voiceId);
        if (matchingVoice) {
          this.selectedVoice = matchingVoice;
        }
      }
    } else {
      // If translations aren't loaded yet, listen for the event
      const onTranslationsLoaded = () => {
        this.updateVoicesForLanguage();
        this.updateInterestSuggestions();
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const themes = urlParams.get('themes');
        const voiceId = urlParams.get('voiceId');
        
        // Pre-fill the themes if provided
        if (themes) {
          this.interests = themes;
        }
        
        // Pre-select the voice if provided
        if (voiceId && this.voices.length > 0) {
          const matchingVoice = this.voices.find(voice => voice.id === voiceId);
          if (matchingVoice) {
            this.selectedVoice = matchingVoice;
          }
        }
        
        // Remove the listener after handling it once
        document.removeEventListener('translations-loaded', onTranslationsLoaded);
      };
      
      document.addEventListener('translations-loaded', onTranslationsLoaded);
    }
    
    // Listen for audio errors
    document.addEventListener('audioerror', this.handleAudioError);
    
    this.previewAudioElement = new Audio();
    this.previewAudioElement.addEventListener('ended', () => {
      this.isPreviewPlaying = null;
      console.log('Preview audio playback completed');
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
      
      // Preload voice preview audios
      this.preloadVoiceAudios();
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
      
      // Clean up translations-loaded event listener
      if (window.eventBus.events['translations-loaded']) {
        window.eventBus.events['translations-loaded'] = window.eventBus.events['translations-loaded'].filter(
          callback => typeof callback === 'function' && callback.toString().includes('updateVoicesForLanguage')
        );
      }
    }
    
    // Clean up audio check interval
    if (this.audioCheckInterval) {
      clearInterval(this.audioCheckInterval);
      this.audioCheckInterval = null;
    }
  },
  methods: {
    // Get translations for the current language
    updateVoicesForLanguage() {
      const lang = this.currentLanguage;
      console.log(`Updating voices for language: ${lang}`);
      
      // Check if window.i18n and translations exist
      if (!window.i18n || !window.i18n.translations) {
        console.warn('Translations not loaded yet, will retry later');
        // Set a timeout to try again in a moment
        setTimeout(() => this.updateVoicesForLanguage(), 500);
        return;
      }
      
      // Check if the current language exists in translations
      if (lang && window.i18n.translations[lang] && window.i18n.translations[lang].voices) {
        this.voices = window.i18n.translations[lang].voices;
        console.log(`Loaded ${this.voices.length} voices for ${lang}:`, this.voices);
        
        // If a voice was previously selected, find its equivalent in the new language
        if (this.selectedVoice) {
          const previousIndex = this.voices.findIndex(v => v.id === this.selectedVoice.id);
          if (previousIndex !== -1) {
            this.selectedVoice = this.voices[previousIndex];
          } else {
            this.selectedVoice = null;
          }
        }
      } else {
        console.warn(`No voices found for language: ${lang}`);
        // Check if English translations exist before defaulting to them
        if (window.i18n.translations.en && window.i18n.translations.en.voices) {
          this.voices = window.i18n.translations.en.voices || [];
        } else {
          console.error('No fallback voices available');
          this.voices = [];
        }
      }
    },
    
    // Handle language change events
    handleLanguageChange(lang) {
      console.log('Language change event received in CreatePage:', lang);
      this.currentLanguage = lang;
      
      // Update voices for the new language
      this.updateVoicesForLanguage();
      
      // Update interest suggestions for the new language
      this.updateInterestSuggestions();
      
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
      // Add a visual feedback when a voice is selected
      console.log(`Voice selected: ${voice.name}`);
    },
    addInterest(suggestion) {
      const interestText = suggestion;
      // Get the conjunction based on the current language
      const conjunction = this.currentLanguage === 'pt' ? ' e ' : ' and ';
      
      // Also update the regex to split by both "and" and "e"
      let currentInterests = this.interests
        .split(/,\s*|\s+and\s+|\s+e\s+/gi)
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
        this.interests = currentInterests.join(conjunction);
      } else {
        const allButLast = currentInterests.slice(0, -1).join(", ");
        const last = currentInterests[currentInterests.length - 1];
        this.interests = `${allButLast}${conjunction}${last}`;
      }
    },
    randomTheme() {
      if (!this.interestSuggestions || this.interestSuggestions.length === 0) {
        console.warn("No interest suggestions available");
        return;
      }
      const randomPick = this.interestSuggestions[Math.floor(Math.random() * this.interestSuggestions.length)];
      this.addInterest(randomPick.text);
    },
    playVoicePreview(voice) {
      // Remove the automatic voice selection when playing preview
      // this.selectVoice(voice);
      
      // Get the audio element for this voice
      const audioElement = document.getElementById(`preview-audio-${voice.id}`);
      if (!audioElement) {
        console.error(`Audio element for voice ${voice.name} not found`);
        return;
      }
      
      if (this.isPreviewPlaying === voice.id) {
        // User clicked the same voice that's currently playing - pause it
        audioElement.pause();
        this.isPreviewPlaying = null;
        return;
      }
      
      // If another voice preview is playing, stop it first
      if (this.isPreviewPlaying) {
        const previousAudio = document.getElementById(`preview-audio-${this.isPreviewPlaying}`);
        if (previousAudio) {
          previousAudio.pause();
        }
        this.isPreviewPlaying = null;
      }
      
      if (voice.previewAudio) {
        voice.isLoading = true;
        
        // Ensure source is set
        if (!audioElement.querySelector('source').src) {
          const source = audioElement.querySelector('source');
          source.src = this.getPreviewAudioUrl(voice);
          audioElement.load();
        }
        
        // Try to play the audio
        audioElement.play()
          .then(() => {
            voice.isLoading = false;
            this.isPreviewPlaying = voice.id;
            console.log(`Successfully playing audio for ${voice.name}`);
          })
          .catch(playError => {
            console.error(`Error playing audio for ${voice.name}:`, playError);
            voice.isLoading = false;
            alert(`Could not play audio preview for ${voice.name}. The audio file may be missing.`);
          });
      }
    },
    async generateStory() {
      if (!this.childName || !this.interests || !this.selectedVoice) {
        this.warningModalData = {
          title: this.$t('create.warningTitle'),
          message: this.$t('create.fillAllFields'),
          type: 'warning'
        };
        this.showWarningModal = true;
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
              content: this.$tf('prompts.generatePlot', {
                childName: this.childName,
                interests: this.interests
              })
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
        const imagePrompt = this.$tf('prompts.generateImage', {
          title: object.title,
          plot: object.plot
        });

        let translatedPrompt;
        try {
          const translationResponse = await sdk.ai.generateText({
            messages: [
              {
                role: "system",
                content: "You are a translator. Translate the following text to English."
              },
              {
                role: "user",
                content: imagePrompt
              }
            ]
          });
          
          translatedPrompt = translationResponse.text;
        } catch (translationError) {
          console.error("Error translating prompt:", translationError);
          // Fallback: create a basic English prompt if translation fails
          translatedPrompt = `Create a cheerful and child-friendly illustration for a children's story titled "${object.title}". Use bright, soft colors and a warm, engaging style. The image should depict a main scene from the story in a magical, inspiring way that's appropriate for young children.`;
          console.log("Using fallback English prompt:", translatedPrompt);
        }

        let imagePromise;
        try {
          imagePromise = sdk.ai.generateImage({
            model: "replicate:recraft-ai/recraft-v3",
            prompt: translatedPrompt,
            providerOptions: {
              replicate: {
                size: "1024x1024",
                style: "digital_illustration",
                prompt: translatedPrompt
              }
            }
          });
        } catch (error) {
          console.error("Error starting image generation:", error);
          // Continuamos com a geração da história mesmo se a imagem falhar
          imagePromise = Promise.resolve({ error: "Failed to initialize image generation" });
        }
        
        this.taskStatus.story = "loading";
        console.log("Starting story generation...");
        const storyStream = await sdk.ai.streamText({
          messages: [
            {
              role: "user",
              content: this.$tf('prompts.generateStory', {
                childName: this.childName,
                interests: this.interests,
                title: object.title,
                plot: object.plot
              })
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
        
        try {
          const imageResult = await imagePromise;
          console.log("Raw image generation result:", JSON.stringify(imageResult));
          
          if (imageResult.error) {
            throw new Error(imageResult.error);
          }
          
          if (imageResult.images && imageResult.images.length > 0) {
            const replicateImageUrl = imageResult.images[0];
            console.log("Got Replicate image URL:", replicateImageUrl);
            
            try {
              console.log("Downloading image from Replicate URL...");
              const filename = imageResult.filepath || `/users/${this.userId}/Pictures/${this.safeFolderName(object.title)}.webp`;
              
              this.storyImage = replicateImageUrl;
              console.log("Using direct Replicate URL for now:", this.storyImage);
              
              if (imageResult.filepath) {
                console.log("Local filepath for future reference:", imageResult.filepath);
              }
            } catch (downloadError) {
              console.error("Error downloading image from Replicate:", downloadError);
              this.storyImage = replicateImageUrl;// Use a direct Replicate URL as a fallback
            }
          } else if (imageResult.filepath) {
            this.storyImage = imageResult.filepath;
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
            }
          } catch (permError) {
            console.warn("Error setting permissions for image file:", permError);
          }
          
        } catch (imageError) {
          console.error("Error generating story image:", imageError);
          // Use uma imagem aleatória de backup
          this.storyImage = this.getRandomFallbackImage();
          // Adiciona uma mensagem para o usuário informando sobre o problema
          this.$nextTick(() => {
            if (this.$refs.imageErrorMessage) {
              this.$refs.imageErrorMessage.textContent = this.$t('errors.imageGenerationFailed');
              this.$refs.imageErrorMessage.style.display = 'block';
            }
          });
        }
        
        this.taskStatus.image = "done";
        
        this.taskStatus.audio = "loading";
        console.log("Starting audio generation...");
        //const audioText = this.storyData.story;
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
                speed: 1.0,
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
          
          // Add an initial delay before checking to allow permissions to propagate
          console.log("Waiting 4 seconds for file permissions to apply before checking...");
          await new Promise(resolve => setTimeout(resolve, 4000));
          
          // Do an initial check with fewer attempts and less logging
          console.log("Checking if audio file is ready...");
          const isAudioReady = await this.checkAudioReady(fullAudioUrl, 2, 3000);
          
          if (isAudioReady) {
            console.log("Audio file is confirmed ready");
            this.audioLoading = false;
          } else {
            console.log("Audio file not immediately available, will continue checking in background");
            // Start background checking
            this.startBackgroundAudioCheck(fullAudioUrl);
          }
        }
        
        if (fullAudioUrl) {
          console.log("Waiting for audio file to be fully accessible before showing result screen...");
          let audioReady = false;
          let attempts = 0;
          const maxAttempts = 30;
          let lastStatus = null;
          
          while (!audioReady && attempts < maxAttempts) {
            attempts++;
            // Only log on first attempt or every 5th attempt to reduce console spam
            if (attempts === 1 || attempts % 5 === 0 || attempts === maxAttempts) {
              console.log(`Audio availability check attempt ${attempts}/${maxAttempts}`);
            }
            
            // If previous attempt returned 403, only make actual request periodically
            const shouldSkipRequest = lastStatus === 403 && 
                                      attempts > 1 && 
                                      attempts % 5 !== 0 && 
                                      attempts !== maxAttempts;
                                      
            if (shouldSkipRequest) {
              // Just wait without making a request
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            
            try {
              const response = await fetch(fullAudioUrl, { 
                method: 'GET',
                headers: {
                  'Range': 'bytes=0-1'
                }
              });
              
              lastStatus = response.status;
              
              if (response.ok || response.status === 206) {
                console.log(`Audio file is accessible! Status: ${response.status}`);
                audioReady = true;
                this.taskStatus.audio = "done";
              } else {
                // Only log on first attempt or every 5th attempt
                if (attempts === 1 || attempts % 5 === 0 || attempts === maxAttempts) {
                  console.log(`Audio file not accessible yet (status: ${response.status}), waiting...`);
                }
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between attempts
              }
            } catch (error) {
              // Only log on first attempt or every 5th attempt
              if (attempts === 1 || attempts % 5 === 0 || attempts === maxAttempts) {
                console.warn(`Error checking audio file: ${error.message}`);
              }
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
          
          if (!audioReady) {
            console.warn("Could not confirm audio file is ready after maximum attempts. Proceeding anyway.");
            this.taskStatus.audio = "error";
          } else {
            console.log("Audio file confirmed accessible! Proceeding to result screen.");
            this.audioLoading = false;
          }
          
          // Only switch to the result screen and save the story after confirming that the audio is ready
          this.screen = "result";
          
          // Save story only after audio is available
          await this.saveStory();
        } else {
          console.warn("No audio URL available, proceeding to result screen anyway");
          this.taskStatus.audio = "error";
          this.screen = "result";
          await this.saveStory();
        }
        
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
          console.log("Audio playback paused");
        } else {
          if (audioPlayer.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            console.log(`Playing audio: ${this.audioSource}`);
            console.log(`Audio duration: ${audioPlayer.duration.toFixed(2)} seconds`);
            
            fetch(this.audioSource, { method: 'HEAD' })
              .then(response => {
                const contentLength = response.headers.get('content-length');
                if (contentLength) {
                  const fileSizeInMB = (parseInt(contentLength) / (1024 * 1024)).toFixed(2);
                  console.log(`Audio file size: ${fileSizeInMB} MB`);
                } else {
                  console.log("Could not determine audio file size");
                }
              })
              .catch(error => {
                console.warn("Error fetching audio file size:", error);
              });
            
            audioPlayer.play()
              .then(() => {
                this.isPlaying = true;
                console.log("Audio playback started successfully");
              })
              .catch(error => {
                console.error("Error playing audio:", error);
                this.reloadAndPlayAudio();
              });
          } else {
            console.log("Audio not fully loaded yet, reloading...");
            this.reloadAndPlayAudio();
          }
        }
      }
    },
    
    reloadAndPlayAudio() {
      this.audioLoading = true;
      console.log("Reloading audio from source:", this.audioSource);
      
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        const currentSource = audioPlayer.querySelector('source');
        if (currentSource) {
          currentSource.remove();
        }
        
        const newSource = document.createElement('source');
        newSource.src = this.audioSource;
        newSource.type = "audio/mpeg";
        audioPlayer.appendChild(newSource);
        
        audioPlayer.load();
        
        // Add an event listener to play when ready
        const canPlayHandler = () => {
          console.log("Audio reloaded and ready to play");
          console.log(`Audio duration after reload: ${audioPlayer.duration.toFixed(2)} seconds`);
          
          this.audioLoading = false;
          audioPlayer.play()
            .then(() => {
              this.isPlaying = true;
              console.log("Audio playback started after reload");
            })
            .catch(playError => {
              console.error("Error playing audio after reload:", playError);
              this.isPlaying = false;
              this.audioLoading = false;
            });
          
          audioPlayer.removeEventListener('canplaythrough', canPlayHandler);
        };
        
        audioPlayer.addEventListener('canplaythrough', canPlayHandler);
        
        // Add a timeout to avoid getting stuck loading
        setTimeout(() => {
          if (this.audioLoading) {
            console.warn("Audio loading timeout reached, attempting to play anyway");
            this.audioLoading = false;
            audioPlayer.removeEventListener('canplaythrough', canPlayHandler);
            audioPlayer.play()
              .then(() => {
                this.isPlaying = true;
                console.log("Audio playback started after timeout");
              })
              .catch(playError => {
                console.error("Error playing audio after timeout:", playError);
                this.isPlaying = false;
              });
          }
        }, 5000); // 5 segundos de timeout
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
        // Create a Blob URL from the audio source if it's not already a Blob URL
        fetch(this.audioSource)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error fetching audio: ${response.status} ${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => {
            // Create a download link and trigger it
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.storyData.title.replace(/\s+/g, '_')}.mp3`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
            
            console.log("Downloading audio from:", this.audioSource);
          })
          .catch(error => {
            console.error("Error downloading audio:", error);
            alert(this.$t('ui.errorDownloadingAudio') || "Error downloading audio");
          });
      }
    },
    goBack() {
      this.screen = "form";
    },
    async checkAudioReady(url, maxAttempts = 10, delayMs = 2000) {
      if (!url) return false;
      
      let lastStatus = null;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          // Only log on first attempt or last attempt
          if (attempt === 0 || attempt === maxAttempts - 1) {
            console.log(`Checking audio availability (attempt ${attempt + 1}/${maxAttempts})...`);
          }
          
          // If previous attempt returned 403, only make actual network request on first, third, and last attempts
          // to reduce console errors while still checking periodically
          const shouldSkipActualRequest = lastStatus === 403 && 
                                          attempt > 0 && 
                                          attempt !== 2 && 
                                          attempt !== maxAttempts - 1;
          
          if (shouldSkipActualRequest) {
            // Skip actual network request but still wait
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          
          // Use a GET request with range headers instead of HEAD
          // This requests just the first few bytes of the file
          const response = await fetch(url, { 
            method: 'GET',
            headers: {
              'Range': 'bytes=0-1' // Just request the first 2 bytes
            }
          });
          
          lastStatus = response.status;
          
          if (response.ok || response.status === 206) { // 206 is Partial Content
            console.log(`Audio file response status: ${response.status}`);
            
            // If we got a response, the file likely exists and is accessible
            console.log('Audio file is ready!');
            return true;
          }
          
          // Only log on first attempt to reduce console spam
          if (attempt === 0 || attempt === maxAttempts - 1) {
            console.log(`Audio file not ready yet (status: ${response.status}), waiting ${delayMs}ms...`);
          }
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (error) {
          // Only log on first attempt to reduce console spam
          if (attempt === 0 || attempt === maxAttempts - 1) {
            console.warn(`Error checking audio file: ${error.message}`);
          }
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
      
      console.warn('Max attempts reached, audio file may not be fully available');
      return false;
    },
    formatStoryText(text) {
      if (!text) return '';
      
      // Remove the title if it appears at the beginning of the story
      // This way the title only appears in the blue header above
      if (this.storyData && this.storyData.title) {
        const title = this.storyData.title.trim();
        
        // Check for common title patterns at the beginning of the text
        // 1. Exact title match at beginning
        text = text.replace(new RegExp(`^\\s*${title}\\s*[\n\r]+`), '');
        
        // 2. Title with markdown heading format (# Title)
        text = text.replace(new RegExp(`^\\s*#\\s*${title}\\s*[\n\r]+`), '');
        
        // 3. Title with double line or other formatting
        text = text.replace(new RegExp(`^\\s*${title}\\s*[\n\r]+[-=]+[\n\r]+`), '');
      }
      
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
    
    getRandomFallbackImage() {
      // Lista de imagens de fallback disponíveis
      const fallbackImages = [
        '/assets/image/bg.png',
        '/assets/image/ex1.webp',
        '/assets/image/ex2.png',
        '/assets/image/ex3.webp',
        '/assets/image/ex4.webp'
      ];
      
      // Seleciona uma imagem aleatória
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      return fallbackImages[randomIndex];
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
          
          // Redirect to the story page
          this.$router.push({
            path: "/story",
            query: { 
              file: filename,
            }
          });
          
          return true;
        } catch (writeError) {
          console.error("DEBUG: Error during write operation:", writeError);
          console.error("DEBUG: Error details:", writeError.message, writeError.stack);
          throw writeError;
        }
        
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
          // Use 0o644 (rw-r--r--) instead of 0o444 (r--r--r--) to ensure web server can access the files
          await sdk.fs.chmod(cleanPath, 0o644);
          console.log(`Successfully set permissions (0o644) for: ${cleanPath}`);
        } catch (chmodError) {
          console.warn(`Could not set file permissions with chmod for ${cleanPath}:`, chmodError);
          console.log("DEBUG: Error details:", chmodError.message, chmodError.stack);
          
          // Try again with a different approach if needed
          try {
            console.log("DEBUG: Trying alternative chmod approach");
            await sdk.fs.chmod(cleanPath, 0o644);
            console.log(`Successfully set permissions using alternative approach for: ${cleanPath}`);
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
      console.warn("Audio error occurred:", event);
      
      // Retry with exponential backoff
      let retryCount = 0;
      const maxRetries = 5;
      const baseDelay = 1000;
      
      const retryWithBackoff = () => {
        if (retryCount >= maxRetries) {
          console.warn(`Failed to load audio after ${maxRetries} retries`);
          this.audioLoading = false;
          return;
        }
        
        const delay = baseDelay * Math.pow(2, retryCount);
        console.log(`Retrying audio load in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        
        setTimeout(() => {
          retryCount++;
          
          // Tentar definir permissões novamente
          if (this.audioSource) {
            this.setFilePermissions(this.audioSource)
              .then(() => {
                console.log(`Permissions reset, reloading audio (attempt ${retryCount})`);
                const audioElement = this.$refs.audioPlayer;
                if (audioElement) {
                  audioElement.load();
                }
              })
              .catch(error => {
                console.warn(`Error setting permissions on retry ${retryCount}:`, error);
                retryWithBackoff();
              });
          }
        }, delay);
      };
      
      this.audioLoading = true;
      retryWithBackoff();
      
      this.startBackgroundAudioCheck(this.audioSource);
    },
    handleAudioReady(event) {
      console.log('Audio canplaythrough event:', event);
      this.audioLoading = false;
      
      const audioPlayer = this.$refs.audioPlayer;
      if (audioPlayer) {
        console.log(`Audio ready - Source: ${this.audioSource}`);
        console.log(`Audio ready - Duration: ${audioPlayer.duration.toFixed(2)} seconds`);
        console.log(`Audio ready - Ready State: ${audioPlayer.readyState}`);
        
        // Check if the audio has enough data for playback
        if (audioPlayer.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
          console.log("Audio has enough data for smooth playback");
        } else {
          console.log("Audio may not have enough data for smooth playback yet");
        }
      }
    },
    getOptimizedImageUrl(url, width, height) {
      if (!url || url.startsWith('data:')) return url;
      
      // If the URL already starts with /assets/image, just return it directly
      if (url.startsWith('/assets/image') || url.startsWith('assets/image')) {
        return url.startsWith('/') ? url : `/${url}`;
      }
      
      // For local paths, use direct path
      let processedUrl = url;
      
      // If the URL is not absolute and doesn't start with a slash, add a slash
      if (!url.startsWith('http') && !url.startsWith('/')) {
        processedUrl = '/' + url;
      }
      
      // Return the direct URL without optimization service
      if (!processedUrl.startsWith('http')) {
        return `${window.location.origin}${processedUrl}`;
      }
      
      return processedUrl;
    },
    // Get interest suggestions for the current language
    updateInterestSuggestions() {
      const lang = this.currentLanguage;
      console.log(`Updating interest suggestions for language: ${lang}`);
      
      // Check if window.i18n and translations exist
      if (!window.i18n || !window.i18n.translations) {
        console.warn('Translations not loaded yet, will retry later');
        // Set a timeout to try again in a moment
        setTimeout(() => this.updateInterestSuggestions(), 500);
        return;
      }
      
      // Check if the current language exists in translations
      if (lang && window.i18n.translations[lang] && window.i18n.translations[lang].interestSuggestions) {
        this.interestSuggestions = window.i18n.translations[lang].interestSuggestions;
        console.log(`Loaded ${this.interestSuggestions.length} interest suggestions for ${lang}:`, this.interestSuggestions);
      } else {
        console.warn(`No interest suggestions found for language: ${lang}`);
        // Check if English translations exist before defaulting to them
        if (window.i18n.translations.en && window.i18n.translations.en.interestSuggestions) {
          this.interestSuggestions = window.i18n.translations.en.interestSuggestions || [];
        } else {
          console.error('No fallback interest suggestions available');
          // Provide default suggestions if nothing is available
          this.interestSuggestions = [
            { text: "Rockets", color: "#22C55E" },
            { text: "Pirates", color: "#A5B4FC" },
            { text: "Space", color: "#F59E0B" },
            { text: "Dinosaurs", color: "#EF4444" },
            { text: "Helping Others", color: "#F59E0B" },
            { text: "Respecting your Elders", color: "#22C55E" }
          ];
        }
      }
    },
    preloadVoiceAudios() {
      console.log("Starting voice preview audio preloading...");
      if (!this.voices || this.voices.length === 0) {
        console.log("No voices to preload audio for");
        return;
      }
      
      this.voices.forEach(voice => {
        if (!voice.previewAudio) {
          console.log(`Voice ${voice.name}: No preview audio to preload`);
          return;
        }
        
        try {
          // Get audio URL for this voice
          const audioUrl = this.getPreviewAudioUrl(voice);
          
          // Skip if already preloaded
          if (this.preloadedAudios[audioUrl]) {
            console.log(`Audio for "${voice.name}" already preloaded`);
            return;
          }
          
          // Get the audio element
          const audioElement = document.getElementById(`preview-audio-${voice.id}`);
          if (!audioElement) {
            console.warn(`Audio element for voice ${voice.name} not found`);
            return;
          }
          
          // Set preload attribute to auto
          audioElement.preload = "auto";
          
          // Log preload start
          console.log(`Started preloading audio for voice "${voice.name}": ${audioUrl}`);
          
          // Mark as being loaded
          voice.isLoading = true;
          
          // Load the audio
          audioElement.load();
        } catch (error) {
          console.error(`Exception while trying to preload audio for "${voice.name}":`, error);
          voice.isLoading = false;
        }
      });
    },
    
    getPreviewAudioUrl(voice) {
      if (!voice.previewAudio) return null;
      
      const fileName = voice.previewAudio.split('/').pop();
      const audioPath = `/assets/audio/preview/${fileName}`;
      
      // Always use absolute URLs
      // For localhost, use the staging environment as the origin
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `https://staging-ai-storyteller.webdraw.app${audioPath}`;
      }
      
      // For production, use the current site's origin
      return `${window.location.origin}${audioPath}`;
    },
    
    previewAudioReady(voice) {
      console.log(`Preview audio for "${voice.name}" loaded and ready to play`);
      voice.isLoading = false;
      
      // Mark as preloaded
      const audioUrl = this.getPreviewAudioUrl(voice);
      this.preloadedAudios[audioUrl] = true;
    },
    
    previewAudioError(event, voice) {
      console.error(`Error loading preview audio for "${voice.name}":`, event);
      voice.isLoading = false;
    },
    
    previewAudioEnded(voice) {
      console.log(`Preview audio for "${voice.name}" playback completed`);
      this.isPreviewPlaying = null;
    },
    
    getSuggestionClasses(suggestion) {
      return [
        `bg-${suggestion.color}-300`,
        `text-${suggestion.color}-900`,
        'px-3 py-2 rounded-full text-xs cursor-pointer'
      ];
    },

    closeWarningModal() {
      this.showWarningModal = false;
    }
  },
  template: `
    <div class="min-h-screen bg-white pb-16">
      <nav class="py-3 px-8 flex items-center relative max-w-3xl mx-auto">
        <router-link to="/">
          <i class="fas fa-arrow-left text-slate-700"></i>
        </router-link>
        <div class="flex items-center mx-auto p-2">
          {{ $t('ui.createNewStory') }}
        </div>
      </nav>

      <div v-if="screen === 'form' || screen === 'loading'" class="max-w-3xl mx-auto w-full">
        <template v-if="screen === 'loading'">
          <div class="p-8 transform transition-all duration mb-8">
            <h2 class="font-bold mb-8 relative inline-block mb-3 text-slate-700">
              {{ $t('create.generatingTitle') }}
            </h2>
            <div class="space-y-6">
              <div class="flex items-center gap-4" v-for="(status, task) in taskStatus" :key="task">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-50">
                  <svg v-if="status === 'loading'" class="w-8 h-8 animate-spin text-slate-700" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <svg v-else-if="status === 'done'" class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else-if="status === 'error'" class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div class="flex-1 flex items-center justify-between gap-2">
                  <span class="text-lg font-medium text-slate-700 capitalize whitespace-nowrap">
                    {{ task === 'plot' ? $t('create.generatingPlot') : 
                       task === 'story' ? $t('create.generatingStory') : 
                       task === 'image' ? $t('create.generatingImage') : 
                       $t('create.generatingAudio') }}
                  </span>
                  <span v-if="task === 'story' && streamingText" class="hidden text-sm text-gray-600 italic truncate max-w-md p-2 bg-[#F0F9FF] rounded-lg border   [#E1F5FE]">
                    "...{{ streamingText.slice(-50) }}"
                  </span>
                  <span v-else-if="task === 'plot' && storyData && storyData.title" class="hidden text-sm text-gray-600 italic truncate max-w-md p-2 bg-[#F0F9FF] rounded-lg border border-[#E1F5FE]">
                    "{{ storyData.title }}"
                  </span>
                  <span v-else-if="task === 'image' && taskStatus.image === 'done'" class="hidden text-sm text-gray-600 italic p-2 bg-[#F0F9FF] rounded-lg border border-[#E1F5FE]">
                    "{{ $t('create.imageCreated') }}"
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="p-8">
            <div class="space-y-8">
              <div class="space-y-3">
                <label class="block text-lg font-medium text-slate-700">{{ $t('create.nameLabel') }}:</label>
                <input type="text" :placeholder="$t('create.namePlaceholder')" v-model="childName" :disabled="screen === 'loading'" class="w-full px-6 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#4A90E2] focus:border-[#4A90E2] bg-white text-lg" />
              </div>
              <div class="space-y-3">
                <label class="block text-lg font-medium text-slate-700">{{ $t('create.interestsLabel') }}</label>
                <div class="relative border border-gray-200 rounded-3xl">
                  <textarea :placeholder="$t('create.interestsPlaceholder')" v-model="interests" rows="4" :disabled="screen === 'loading'" class="w-full px-6 py-3 border-0 rounded-3xl focus:ring-2 focus:ring-[#4A90E2] resize-none text-lg min-h-[100px]"></textarea>
                  <button type="button" @click="randomTheme" class="absolute right-4 bottom-4 bg-purple-500 hover:bg-purple-400 text-white px-3 py-2 rounded-full text-xs flex items-center gap-2 shadow-md transition-colors duration-200">
                    <i class="fas fa-dice-five"></i>
                    {{ $t('create.randomTheme') }}
                  </button>
                </div>

                <div class="flex flex-wrap gap-3 mt-4">
                  <span 
                    v-for="suggestion in interestSuggestions" 
                    :key="suggestion.text"
                    :class="getSuggestionClasses(suggestion)"
                    @click="addInterest(suggestion.text)"
                  >
                    {{ suggestion.text }}
                  </span>
                </div>
              </div>

              <div class="space-y-3">
                <label class="block text-lg font-medium text-slate-700">
                  {{ $t('create.voiceLabel') }}
                  <span class="text-red-500">*</span>
                </label>
                <div class="rounded-3xl overflow-hidden p-2 border border-[#DDDDDD]">
                  <div 
                    v-for="(voice, index) in voices" 
                    :key="voice.id"
                    class="mb-4 last:mb-0"
                  >
                    <div 
                      class="rounded-2xl bg-white p-2 flex items-center justify-between duration-200 cursor-pointer"
                      :class="{
                        'bg-teal-100': selectedVoice && selectedVoice.id === voice.id && index === 0,
                        'bg-amber-100': selectedVoice && selectedVoice.id === voice.id && index === 1,
                        'bg-purple-100': selectedVoice && selectedVoice.id === voice.id && index === 2,
                        'bg-blue-100': selectedVoice && selectedVoice.id === voice.id && index > 2
                      }"
                      @click="selectVoice(voice)"
                    >
                      <div class="flex items-center gap-4 flex-1">
                        <div class="flex-shrink-0">
                          <img :src="voice.avatar" :alt="voice.name" class="w-12 h-12 rounded-full" />
                        </div>
                        <div>
                          <span class="text-lg font-medium text-slate-700">{{ voice.name }}</span>
                        </div>
                      </div>
                      <button 
                        @click.stop="playVoicePreview(voice)"
                        :class="{
                          'bg-teal-500 hover:bg-teal-600': index === 0,
                          'bg-amber-500 hover:bg-amber-600': index === 1,
                          'bg-purple-500 hover:bg-purple-600': index === 2,
                          'bg-[#4A90E2] hover:bg-[#5FA0E9]': index > 2
                        }"
                        class="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-200 flex-shrink-0"
                        :title="isPreviewPlaying === voice.id ? $t('create.pausePreview') : $t('create.playPreview')"
                      >
                        <i v-if="!voice.isLoading" :class="[
                          'fas',
                          isPreviewPlaying === voice.id ? 'fa-pause' : 'fa-play',
                          'text-lg'
                        ]"></i>
                        <i v-else class="fas fa-spinner fa-spin text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="!selectedVoice" class="mt-2 p-2 bg-red-50 rounded-lg text-sm text-red-500 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {{ $t('create.voiceRequired') }}
                </div>
                <div v-else class="mt-2 p-2 bg-[#E1F5FE] rounded-lg text-sm text-slate-700 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $tf('create.voiceSelected', { name: selectedVoice.name }) }}
                </div>
              </div>

              <button @click="generateStory" :disabled="screen === 'loading'" class="flex justify-center items-center gap-2 py-3 px-6 w-full md:w-auto md:min-w-[250px] h-12 bg-gradient-to-b from-purple-300 to-purple-500 border border-purple-700 rounded-full cursor-pointer shadow-md hover:translate-y-[-2px] transition-transform duration-200 font-['Onest'] font-medium text-lg text-white">
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
        <div class="p-8">
          <div class="space-y-6 mb-6">
            <img v-if="storyImage" :src="getOptimizedImageUrl(storyImage, 800, 400)" alt="Magic Illustration" class="w-full rounded-xl shadow-lg" />
            <div ref="imageErrorMessage" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2 hidden">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.667-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700"></p>
                </div>
              </div>
            </div>
          </div>

          <div class="audio-controls mb-8 space-y-4" v-if="audioSource">
            <div class="flex items-center gap-4">
              <button @click="toggleAudio" class="p-3 rounded-full bg-[#4A90E2] hover:bg-[#5FA0E9] text-white shadow-md transition-colors duration-200" :disabled="audioLoading">
                <svg v-if="audioLoading" class="w-6 h-6 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3-2a1 1 0 000-1.664z" />
                  <path v-if="isPlaying" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div class="w-full flex items-center gap-2">
                <div class="w-full h-4 bg-gray-200 rounded-full relative">
                  <div class="absolute inset-0 h-4 rounded-full bg-[#4A90E2]" :style="{ width: audioProgress + '%' }"></div>
                </div>
                <span v-if="audioLoading" class="text-xs text-gray-500 animate-pulse">{{ $t('ui.loading') || 'Loading...' }}</span>
              </div>
              <a @click="downloadAudio" class="p-2 text-slate-700 hover:text-[#2871CC] cursor-pointer" :title="$t('ui.download')" :class="{ 'opacity-50 cursor-not-allowed': audioLoading }" :disabled="audioLoading">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>

          <div v-if="storyData" class="prose-base text-slate-700 space-y-4">
            <h2 class="text-2xl font-bold mb-6 text-center relative">
              <span class="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#2871CC] via-[#4A90E2] to-[#81D4FA] mb-3">
                {{ storyData.title }}
              </span>
            </h2>
            <div class="space-y-6 whitespace-pre-line text-left" v-html="storyData.story"></div>
          </div>

          <div class="mt-8 text-center">
            <router-link to="/my-stories" class="inline-flex items-center gap-2 bg-gradient-to-b from-[#4A90E2] to-[#2871CC] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:from-[#5FA0E9] hover:to-[#4A90E2] transition-all duration-300 group font-medium border border-[#2871CC]">
              <span>{{ $t('ui.myStories') }}</span>
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
        preload="auto"
        crossorigin="anonymous"
      >
        <source v-if="audioSource" :src="audioSource" type="audio/mpeg" />
        {{ $t('ui.audioNotSupported') }}
      </audio>

      <!-- Add audio elements for voice previews -->
      <div style="display: none;">
        <audio 
          v-for="voice in voices" 
          :key="'preview-' + voice.id"
          :id="'preview-audio-' + voice.id"
          preload="none"
          @ended="previewAudioEnded(voice)"
          @canplaythrough="previewAudioReady(voice)"
          @error="previewAudioError($event, voice)"
        >
          <source v-if="voice.previewAudio" :src="getPreviewAudioUrl(voice)" type="audio/mpeg">
        </audio>
      </div>

      <div v-if="showWarningModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out">
        <div 
          class="bg-white rounded-3xl shadow-xl p-6 max-w-md w-full relative overflow-hidden transform transition-all duration-300 ease-out"
          :class="{
            'border-l-4 border-amber-500': warningModalData.type === 'warning',
            'scale-100 opacity-100': showWarningModal,
            'scale-95 opacity-0': !showWarningModal
          }"
        >
          <div class="flex justify-center mb-4" v-if="warningModalData.type === 'warning'">
            <div class="bg-amber-500 bg-opacity-20 rounded-full p-4 w-16 h-16 flex items-center justify-center">
              <i class="fa-solid fa-triangle-exclamation text-2xl text-amber-500"></i>
            </div>
          </div>
          
          <h3 class="text-lg font-medium text-center mb-2">{{ warningModalData.title }}</h3>
          
          <p class="text-gray-600 text-center mb-6">{{ warningModalData.message }}</p>
          
          <div class="flex justify-center">
            <button 
              @click="closeWarningModal" 
              class="px-5 py-2 rounded-full text-white font-medium text-sm bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-600 hover:translate-y-[-2px] hover:from-amber-300 hover:to-amber-400 transition-all duration-200"
            >
              {{ $t('ui.ok') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}; 