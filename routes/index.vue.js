window.IndexPage = {
    template: `
        <div class="min-h-screen bg-[#FFF9F6]">
            <!-- Navigation -->
            <nav class="flex justify-center items-center px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-sky-100">
                <div class="flex items-center gap-3">
                    <img src="https://webdraw.com/image-optimize?src=https%3A%2F%2Fai-storyteller.webdraw.app%2F.webdraw%2Fassets%2Ficon-b8a9e1bd-cf34-46f5-8f72-a98c365e9b09.png&width=80&height=80&fit=cover" 
                         alt="AI Storyteller Logo" 
                         class="w-10 h-10 rounded-xl object-cover" />
                    <h1 class="text-xl font-medium text-[#006D95]">AI Storyteller</h1>
                </div>
            </nav>

            <!-- Hero Section -->
            <main class="max-w-4xl mx-auto px-6 py-12 text-center">
                <h2 class="text-4xl font-semibold mb-4 text-[#00B7EA]">Create bedtime stories for your kids with one click!</h2>
                <p class="text-gray-600 mb-8 text-lg">Transform your ideas into captivating stories with the power of artificial intelligence.</p>
                
                <div class="flex flex-col gap-2 items-center mb-16">
                    <router-link to="/create" class="bg-gradient-to-b from-[#38BDF8] to-[#0284C7] text-white px-6 py-3 rounded-full hover:from-[#0284C7] hover:to-[#0284C7] border border-[#0369A1] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                        <i class="fa-solid fa-book-open"></i>
                        Create new story!
                    </router-link>
                    <router-link to="/stories" class="border border-[#00B7EA] text-[#00B7EA] px-6 py-3 rounded-full hover:bg-[#F0F9FF] font-medium flex items-center gap-2 w-full max-w-sm justify-center">
                        <i class="fa-solid fa-book"></i>
                        My stories
                    </router-link>
                </div>

                <!-- Example Stories -->
                <div class="space-y-6">
                    <p class="text-[#00B7EA] text-sm">See some examples:</p>
                    
                    <!-- Story Card 1 -->
                    <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-[#00B7EA] mb-4">Pablo the Knight and the Desert Oasis</h3>
                        <div class="flex gap-6">
                            <div class="w-1/2 space-y-4">
                                <!-- Story Settings -->
                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Child's Name:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                                        Pablo
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Themes:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                                        Knights, Desert and Telling the Truth
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Voice:</label>
                                    <div class="bg-white border border-gray-200 rounded-full p-2 text-sm text-gray-600 flex items-center gap-2">
                                        <img src="https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729" class="w-6 h-6 rounded-full" />
                                        <span>Granny Mabel</span>
                                        <button class="ml-auto bg-blue-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center">
                                            <i class="fa-solid fa-play text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="w-1/2">
                                <div class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
                                    <img src="https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp" 
                                         alt="Story illustration" 
                                         class="w-full h-48 object-cover rounded-lg mb-4" />
                                    
                                    <!-- Audio Player -->
                                    <div class="flex items-center gap-4">
                                        <button class="bg-[#0EA5E9] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                                            <i class="fa-solid fa-pause"></i>
                                        </button>
                                        <div class="flex-1 h-8 bg-[#E0F2FE] rounded-full relative">
                                            <div class="absolute inset-0 flex items-center px-2">
                                                <div class="h-1 bg-[#7DD3FC] rounded-full w-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Story Card 2 -->
                    <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-[#00B7EA] mb-4">The Magic Garden Adventure</h3>
                        <div class="flex gap-6">
                            <div class="w-1/2 space-y-4">
                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Child's Name:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                                        Sarah
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Themes:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                                        Nature, Magic and Friendship
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Voice:</label>
                                    <div class="bg-white border border-gray-200 rounded-full p-2 text-sm text-gray-600 flex items-center gap-2">
                                        <img src="https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729" class="w-6 h-6 rounded-full" />
                                        <span>Fairy Godmother</span>
                                        <button class="ml-auto bg-blue-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center">
                                            <i class="fa-solid fa-play text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="w-1/2">
                                <div class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
                                    <img src="https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp" 
                                         alt="Story illustration" 
                                         class="w-full h-48 object-cover rounded-lg mb-4" />
                                    
                                    <!-- Audio Player -->
                                    <div class="flex items-center gap-4">
                                        <button class="bg-[#0EA5E9] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                                            <i class="fa-solid fa-play"></i>
                                        </button>
                                        <div class="flex-1 h-8 bg-[#E0F2FE] rounded-full relative">
                                            <div class="absolute inset-0 flex items-center px-2">
                                                <div class="h-1 bg-[#7DD3FC] rounded-full w-1/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Story Card 3 -->
                    <div class="bg-[#E0F2FE] border border-[#BAE6FD] rounded-xl p-6">
                        <h3 class="text-xl font-semibold text-[#00B7EA] mb-4">The Space Explorer's Journey</h3>
                        <div class="flex gap-6">
                            <div class="w-1/2 space-y-4">
                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Child's Name:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                                        Alex
                                    </div>
                                </div>
                                
                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Themes:</label>
                                    <div class="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
                                        Space, Discovery and Courage
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    <label class="block text-xs font-medium text-[#005B79]">Voice:</label>
                                    <div class="bg-white border border-gray-200 rounded-full p-2 text-sm text-gray-600 flex items-center gap-2">
                                        <img src="https://github.com/user-attachments/assets/754281d3-a02b-41de-a9ef-ead820c40729" class="w-6 h-6 rounded-full" />
                                        <span>Space Captain</span>
                                        <button class="ml-auto bg-blue-600 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center">
                                            <i class="fa-solid fa-play text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="w-1/2">
                                <div class="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-4">
                                    <img src="https://fs.webdraw.com/users/117259cb-462f-4558-9b28-7aa8f21715a9/Pictures/piratas_disney_pixar_illustration_2.webp" 
                                         alt="Story illustration" 
                                         class="w-full h-48 object-cover rounded-lg mb-4" />
                                    
                                    <!-- Audio Player -->
                                    <div class="flex items-center gap-4">
                                        <button class="bg-[#0EA5E9] text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">
                                            <i class="fa-solid fa-play"></i>
                                        </button>
                                        <div class="flex-1 h-8 bg-[#E0F2FE] rounded-full relative">
                                            <div class="absolute inset-0 flex items-center px-2">
                                                <div class="h-1 bg-[#7DD3FC] rounded-full w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `
}; 