<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Welcome to UDL</h2>
      <p class="text-gray-600 mt-2">Sign in to start logging your data</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your password"
        />
      </div>

      <div v-if="error" class="text-red-600 text-sm">
        {{ error }}
      </div>

      <div class="flex space-x-4">
        <button
          type="submit"
          :disabled="loading"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {{ loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
        </button>
      </div>

      <div class="text-center">
        <button
          type="button"
          @click="toggleMode"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >
          {{ isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

const emit = defineEmits<{
  userAuthenticated: [user: User]
}>()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const isSignUp = ref(false)

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    if (isSignUp.value) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (signUpError) throw signUpError

      if (data.user) {
        emit('userAuthenticated', data.user)
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (signInError) throw signInError

      if (data.user) {
        emit('userAuthenticated', data.user)
      }
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
