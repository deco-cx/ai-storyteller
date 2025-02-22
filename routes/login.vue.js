window.LoginPage = {
    template: `
        <div class="min-h-screen p-6">
            <nav class="mb-8">
                <router-link to="/" class="text-blue-600 hover:text-blue-800">&larr; Back to Home</router-link>
            </nav>
            <main class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 class="text-2xl font-semibold mb-6 text-center">Login</h2>
                <form class="space-y-4" @submit.prevent>
                    <div>
                        <label class="block text-gray-700 mb-2">Email</label>
                        <input type="email" class="w-full p-2 border rounded-lg" placeholder="Enter your email">
                    </div>
                    <div>
                        <label class="block text-gray-700 mb-2">Password</label>
                        <input type="password" class="w-full p-2 border rounded-lg" placeholder="Enter your password">
                    </div>
                    <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
                </form>
            </main>
        </div>
    `
}; 