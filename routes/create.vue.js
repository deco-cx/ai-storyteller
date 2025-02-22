window.CreatePage = {
    template: `
        <div class="min-h-screen p-6">
            <nav class="mb-8">
                <router-link to="/" class="text-blue-600 hover:text-blue-800">&larr; Back to Home</router-link>
            </nav>
            <main class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-6">Create Your Story</h2>
                <form class="space-y-6" @submit.prevent>
                    <div>
                        <label class="block text-gray-700 mb-2">Story Title</label>
                        <input type="text" class="w-full p-2 border rounded-lg" placeholder="Enter your story title">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Story Prompt</label>
                        <textarea class="w-full p-2 border rounded-lg h-32" placeholder="Describe your story idea..."></textarea>
                    </div>
                    <button class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Generate Story</button>
                </form>
            </main>
        </div>
    `
}; 