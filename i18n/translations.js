// Translations for AI Storyteller
const translations = {
  // English translations
  en: {
    // Common UI elements
    ui: {
      appName: "AI Storyteller",
      loading: "Loading...",
      error: "Error",
      back: "Back to Home",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      confirm: "Confirm",
      share: "Share",
      download: "Download",
      create: "Create",
      listen: "Listen",
      retry: "Try Again",
      errorLoading: "Error Loading",
      returnHome: "Return to Home",
      storyText: "Story Text:",
      downloadAudio: "Download Audio",
      shareStory: "Share Story",
      createNewStory: "Create New Story",
      storySettings: "Story Settings",
      childName: "Child's Name:",
      themes: "Themes:",
      voice: "Voice:",
      copied: "Copied to clipboard!",
      copyLink: "Copy this link to share the story:",
      audioNotSupported: "Your browser does not support the audio element.",
      home: "Home",
      new: "New",
      myStories: "My Stories"
    },
    
    // Login page
    login: {
      title: "Login",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      loginButton: "Login",
      forgotPassword: "Forgot Password?",
      signUp: "Sign Up"
    },
    
    // Home page
    home: {
      welcome: "Create bedtime stories for your kids with one click!",
      tagline: "Transform your ideas into captivating stories with the power of artificial intelligence.",
      createButton: "Create new story!",
      myStoriesButton: "My stories",
      signInToCreate: "Sign in to create a story",
      freeStories: "3 stories for free",
      examples: "Examples",
      result: "Result",
      featuresTitle: "Features",
      feature1Title: "Personalized Stories",
      feature1Text: "Create stories featuring your child as the main character",
      feature2Title: "Audio Narration",
      feature2Text: "Listen to stories narrated by different voices",
      feature3Title: "Beautiful Illustrations",
      feature3Text: "Each story comes with a unique illustration",
      howItWorksTitle: "How It Works",
      step1: "Enter your child's name and interests",
      step2: "Choose a voice for narration",
      step3: "Our AI creates a personalized story",
      step4: "Listen, read, and share the story"
    },
    
    // Create page
    create: {
      title: "Create a Story",
      nameLabel: "Child's Name",
      namePlaceholder: "Enter the child's name",
      interestsLabel: "Interests or Themes",
      interestsPlaceholder: "e.g., Space, Dinosaurs, Princesses",
      interestsHelp: "What is your child interested in? Add up to 6 themes.",
      randomTheme: "Random Theme",
      voiceLabel: "Choose a Voice",
      createButton: "Create new story!",
      generatingTitle: "Creating Your Story",
      generatingPlot: "Creating Plot",
      generatingStory: "Writing Story",
      generatingImage: "Creating Illustration",
      generatingAudio: "Generating Narration",
      imageCreated: "Image created successfully",
      audioCreated: "Audio narration ready",
      errorCreating: "Error creating story",
      tryAgain: "Please try again",
      storyReady: "Your Story is Ready!",
      listen: "Listen",
      saveAndShare: "Save & Share",
      startOver: "Start Over",
      fillAllFields: "Please fill in all fields and select a voice before creating a story."
    },
    
    // My Stories page
    myStories: {
      pageTitle: "My Stories",
      newStoryButton: "New Story",
      noStoriesText: "You haven't created any stories yet.",
      createFirstText: "Create your first story!",
      searchPlaceholder: "Search stories...",
      noSearchResults: "No stories found matching your search.",
      deleteConfirm: "Are you sure you want to delete this story?",
      today: "Today at",
      yesterday: "Yesterday at"
    },
    
    // Story page
    story: {
      loadingStory: "Loading your story...",
      errorLoadingStory: "Error Loading Story",
      noStorySpecified: "No story file specified. Please provide a valid file URL.",
      invalidIndex: "Invalid story index",
      noStoryContent: "No story content available",
      untitledStory: "Untitled Story"
    },
    
    // Example stories for the home page
    examples: [
      {
        title: "Pablo the Knight and the Desert Oasis",
        childName: "Pablo",
        themes: "Knights, Desert and Telling the Truth",
        voice: "Granny Mabel",
        voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
        isPlaying: true,
        progress: "100%"
      },
      {
        title: "The Magic Garden Adventure",
        childName: "Sarah",
        themes: "Nature, Magic and Friendship",
        voice: "Fairy Godmother",
        voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
        isPlaying: false,
        progress: "33%"
      },
      {
        title: "The Space Explorer's Journey",
        childName: "Alex",
        themes: "Space, Discovery and Courage",
        voice: "Space Captain",
        voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
        isPlaying: false,
        progress: "66%"
      }
    ],
    
    // Voice options
    voices: [
      { 
        id: "IKne3meq5aSn9XLyUdCD", 
        name: "Uncle Joe", 
        previewAudio: "/audio/uncle_2.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Eden&accessories=glasses&clothingColor=78e185,ffcf77&face=cheeky,smile,smileBig,calm&facialHair=full&facialHairProbability=100&head=grayShort&headContrastColor=2c1b18&skinColor=ae5d29&backgroundColor=b6e3f4"
      },
      { 
        id: "NOpBlnGInO9m6vDvFkFC", 
        name: "Grandpa Solomon", 
        previewAudio: "/audio/grandpa_1.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Luis&accessories[]&clothingColor=9ddadb&face=cheeky,smile,calm&facialHair=full3&facialHairProbability=100&head=noHair2&headContrastColor=2c1b18&mask[]&skinColor=edb98a&backgroundColor=ffdfbf"
      },
      { 
        id: "ZqvIIuD5aI9JFejebHiH", 
        name: "Aunt Dora", 
        previewAudio: "/audio/aunt_1.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Chase&accessories[]&clothingColor=e279c7&face=cheeky,smile,calm&facialHair[]&facialHairProbability=0&head=long,bun2&headContrastColor=2c1b18&mask[]&skinColor=edb98a&backgroundColor=d1d4f9"
      },
      { 
        id: "S9EY1qVDizdxKWghP5FL", 
        name: "Grandma Beatriz", 
        previewAudio: "/audio/grandma_1.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Kimberly&accessories=glasses&clothingColor=e78276&face=cheeky,smile,smileBig,calm&facialHair[]&head=grayBun&headContrastColor=e8e1e1&skinColor=ae5d29&backgroundColor=ffd5dc,ffdfbf"
      }
    ],
    
    // Theme suggestions
    themeSuggestions: [
      "Fairy Tales",
      "Robots in the City",
      "Underwater Adventure",
      "Magical Forest",
      "Ninjas and Samurai",
      "Galactic Warriors",
      "Candy Kingdom",
      "Dinosaur Island",
      "Space Exploration",
      "Superhero Academy"
    ],
    
    // AI Prompts
    prompts: {
      generatePlot: "Create a children's story title and plot for a {childName} who is interested in {interests}. The story should be educational, engaging, and appropriate for children. Keep the plot brief (2-3 sentences).",
      generateStory: "Write a children's story based on the following title and plot. Make it engaging, educational, and appropriate for children. Include the child's name ({childName}) as the main character. The story should be about {interests}.\n\nTitle: {title}\nPlot: {plot}\n\nWrite a complete story with a beginning, middle, and end. The story should be 3-4 paragraphs long.",
      generateImage: "Create a colorful, child-friendly illustration for a children's story titled \"{title}\" with the following plot: {plot}. The image should be vibrant, engaging, and suitable for children."
    }
  },
  
  // Portuguese translations
  pt: {
    // Common UI elements
    ui: {
      appName: "Contador de Histórias IA",
      loading: "Carregando...",
      error: "Erro",
      back: "Voltar para Início",
      save: "Salvar",
      cancel: "Cancelar",
      delete: "Excluir",
      confirm: "Confirmar",
      share: "Compartilhar",
      download: "Baixar",
      create: "Criar",
      listen: "Ouvir",
      retry: "Tentar Novamente",
      errorLoading: "Erro ao Carregar",
      returnHome: "Voltar para Início",
      storyText: "Texto da História:",
      downloadAudio: "Baixar Áudio",
      shareStory: "Compartilhar História",
      createNewStory: "Criar Nova História",
      storySettings: "Configurações da História",
      childName: "Nome da Criança:",
      themes: "Temas:",
      voice: "Voz:",
      copied: "Copiado para a área de transferência!",
      copyLink: "Copie este link para compartilhar a história:",
      audioNotSupported: "Seu navegador não suporta o elemento de áudio.",
      home: "Início",
      new: "Novo",
      myStories: "Minhas Histórias"
    },
    
    // Login page
    login: {
      title: "Entrar",
      email: "Email",
      emailPlaceholder: "Digite seu email",
      password: "Senha",
      passwordPlaceholder: "Digite sua senha",
      loginButton: "Entrar",
      forgotPassword: "Esqueceu a senha?",
      signUp: "Cadastrar"
    },
    
    // Home page
    home: {
      welcome: "Crie histórias para dormir para seus filhos com um clique!",
      tagline: "Transforme suas ideias em histórias cativantes com o poder da inteligência artificial.",
      createButton: "Criar nova história!",
      myStoriesButton: "Minhas histórias",
      signInToCreate: "Faça login para criar uma história",
      freeStories: "3 histórias grátis",
      examples: "Exemplos",
      result: "Resultado",
      featuresTitle: "Recursos",
      feature1Title: "Histórias Personalizadas",
      feature1Text: "Crie histórias com seu filho como personagem principal",
      feature2Title: "Narração em Áudio",
      feature2Text: "Ouça histórias narradas por diferentes vozes",
      feature3Title: "Belas Ilustrações",
      feature3Text: "Cada história vem com uma ilustração única",
      howItWorksTitle: "Como Funciona",
      step1: "Digite o nome e interesses do seu filho",
      step2: "Escolha uma voz para narração",
      step3: "Nossa IA cria uma história personalizada",
      step4: "Ouça, leia e compartilhe a história"
    },
    
    // Create page
    create: {
      title: "Criar uma História",
      nameLabel: "Nome da Criança",
      namePlaceholder: "Digite o nome da criança",
      interestsLabel: "Interesses ou Temas",
      interestsPlaceholder: "ex: Espaço, Dinossauros, Princesas",
      interestsHelp: "O que seu filho gosta? Adicione até 6 temas.",
      randomTheme: "Tema Aleatório",
      voiceLabel: "Escolha uma Voz",
      createButton: "Criar nova história!",
      generatingTitle: "Criando Sua História",
      generatingPlot: "Criando Enredo",
      generatingStory: "Escrevendo História",
      generatingImage: "Criando Ilustração",
      generatingAudio: "Gerando Narração",
      imageCreated: "Imagem criada com sucesso",
      audioCreated: "Narração em áudio pronta",
      errorCreating: "Erro ao criar história",
      tryAgain: "Por favor, tente novamente",
      storyReady: "Sua História está Pronta!",
      listen: "Ouvir",
      saveAndShare: "Salvar e Compartilhar",
      startOver: "Recomeçar",
      fillAllFields: "Por favor, preencha todos os campos e selecione uma voz antes de criar uma história."
    },
    
    // My Stories page
    myStories: {
      pageTitle: "Minhas Histórias",
      newStoryButton: "Nova História",
      noStoriesText: "Você ainda não criou nenhuma história.",
      createFirstText: "Crie sua primeira história!",
      searchPlaceholder: "Buscar histórias...",
      noSearchResults: "Nenhuma história encontrada para sua busca.",
      deleteConfirm: "Tem certeza que deseja excluir esta história?",
      today: "Hoje às",
      yesterday: "Ontem às"
    },
    
    // Story page
    story: {
      loadingStory: "Carregando sua história...",
      errorLoadingStory: "Erro ao Carregar História",
      noStorySpecified: "Nenhum arquivo de história especificado. Por favor, forneça uma URL de arquivo válida.",
      invalidIndex: "Índice de história inválido",
      noStoryContent: "Nenhum conteúdo de história disponível",
      untitledStory: "História sem Título"
    },
    
    // Example stories for the home page
    examples: [
      {
        title: "Pablo o Cavaleiro e o Oásis do Deserto",
        childName: "Pablo",
        themes: "Cavaleiros, Deserto e Dizer a Verdade",
        voice: "Vovó Mabel",
        voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
        isPlaying: true,
        progress: "100%"
      },
      {
        title: "A Aventura do Jardim Mágico",
        childName: "Sara",
        themes: "Natureza, Magia e Amizade",
        voice: "Fada Madrinha",
        voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
        isPlaying: false,
        progress: "33%"
      },
      {
        title: "A Jornada do Explorador Espacial",
        childName: "Alex",
        themes: "Espaço, Descoberta e Coragem",
        voice: "Capitão Espacial",
        voiceAvatar: "https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729",
        image: "https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp",
        isPlaying: false,
        progress: "66%"
      }
    ],
    
    // Voice options
    voices: [
      { 
        id: "IKne3meq5aSn9XLyUdCD", 
        name: "Tio José", 
        previewAudio: "/audio/uncle_2pt.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Eden&accessories=glasses&clothingColor=78e185,ffcf77&face=cheeky,smile,smileBig,calm&facialHair=full&facialHairProbability=100&head=grayShort&headContrastColor=2c1b18&skinColor=ae5d29&backgroundColor=b6e3f4"
      },
      { 
        id: "NOpBlnGInO9m6vDvFkFC", 
        name: "Vô Pedro", 
        previewAudio: "/audio/grandpa_1pt.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Luis&accessories[]&clothingColor=9ddadb&face=cheeky,smile,calm&facialHair=full3&facialHairProbability=100&head=noHair2&headContrastColor=2c1b18&mask[]&skinColor=edb98a&backgroundColor=ffdfbf"
      },
      { 
        id: "ZqvIIuD5aI9JFejebHiH", 
        name: "Tia Dora", 
        previewAudio: "/audio/aunt_1pt.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Chase&accessories[]&clothingColor=e279c7&face=cheeky,smile,calm&facialHair[]&facialHairProbability=0&head=long,bun2&headContrastColor=2c1b18&mask[]&skinColor=edb98a&backgroundColor=d1d4f9"
      },
      { 
        id: "S9EY1qVDizdxKWghP5FL", 
        name: "Vó Eunice", 
        previewAudio: "/audio/grandma_1pt.mp3", 
        avatar: "https://api.dicebear.com/9.x/open-peeps/svg?seed=Kimberly&accessories=glasses&clothingColor=e78276&face=cheeky,smile,smileBig,calm&facialHair[]&head=grayBun&headContrastColor=e8e1e1&skinColor=ae5d29&backgroundColor=ffd5dc,ffdfbf"
      }
    ],
    
    // Theme suggestions
    themeSuggestions: [
      "Contos de Fadas",
      "Robôs na Cidade",
      "Aventura Submarina",
      "Floresta Mágica",
      "Ninjas e Samurais",
      "Guerreiros Galácticos",
      "Reino dos Doces",
      "Ilha dos Dinossauros",
      "Exploração Espacial",
      "Academia de Super-heróis"
    ],
    
    // AI Prompts
    prompts: {
      generatePlot: "Crie um título e enredo de história infantil para {childName} que se interessa por {interests}. A história deve ser educativa, envolvente e apropriada para crianças. Mantenha o enredo breve (2-3 frases).",
      generateStory: "Escreva uma história infantil baseada no seguinte título e enredo. Torne-a envolvente, educativa e apropriada para crianças. Inclua o nome da criança ({childName}) como personagem principal. A história deve ser sobre {interests}.\n\nTítulo: {title}\nEnredo: {plot}\n\nEscreva uma história completa com começo, meio e fim. A história deve ter 3-4 parágrafos.",
      generateImage: "Crie uma ilustração colorida e amigável para crianças para uma história infantil intitulada \"{title}\" com o seguinte enredo: {plot}. A imagem deve ser vibrante, envolvente e adequada para crianças."
    }
  }
};

// Export the translations
export default translations; 