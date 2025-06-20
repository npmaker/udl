<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">UDL</h1>
            <span class="ml-2 text-sm text-gray-500">Universal Data Logger</span>
          </div>
          <div v-if="user" class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">{{ user.email }}</span>
            <button
              @click="handleSignOut"
              class="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Configuration Warning -->
      <div v-if="!supabaseConfigured" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Supabase Configuration Required
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>To use the Universal Data Logger, you need to configure your Supabase connection:</p>
              <ol class="mt-2 list-decimal list-inside space-y-1">
                <li>Create a <code class="bg-yellow-100 px-1 rounded">.env</code> file in the project root</li>
                <li>Add your Supabase URL and anonymous key (see <code class="bg-yellow-100 px-1 rounded">.env.example</code>)</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Authentication Component -->
      <AuthComponent v-if="!user && supabaseConfigured" @user-authenticated="handleUserAuthenticated" />
      
      <!-- Logger Interface -->
      <LoggerInterface v-else-if="user && supabaseConfigured" :user="user" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import AuthComponent from './components/AuthComponent.vue'
import LoggerInterface from './components/LoggerInterface.vue'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)

// Make isSupabaseConfigured available in template
const supabaseConfigured = isSupabaseConfigured

onMounted(async () => {
  // Only attempt Supabase operations if properly configured
  if (isSupabaseConfigured) {
    try {
      // Check if user is already logged in
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null
      })
    } catch (error) {
      console.error('Supabase initialization error:', error)
    }
  }
})

const handleUserAuthenticated = (authenticatedUser: User) => {
  user.value = authenticatedUser
}

const handleSignOut = async () => {
  await supabase.auth.signOut()
  user.value = null
}
</script>
