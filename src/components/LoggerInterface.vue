<template>
  <div class="space-y-6">
    <!-- Log Entry Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Add New Log Entry</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="key" class="block text-sm font-medium text-gray-700">
              Key
            </label>
            <input
              id="key"
              v-model="newEntry.key"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., temperature, note, measurement"
            />
          </div>
          
          <div>
            <label for="value" class="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              id="value"
              v-model="newEntry.value"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any value (text, number, JSON, etc.)"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 text-sm">
          {{ success }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-6 rounded-md font-medium transition-colors"
        >
          {{ loading ? 'Adding...' : 'Add Entry' }}
        </button>
      </form>
    </div>

    <!-- Log Entries List -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Your Log Entries</h2>
        <button
          @click="refreshEntries"
          :disabled="loadingEntries"
          class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          {{ loadingEntries ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="loadingEntries && entries.length === 0" class="text-center py-8">
        <div class="text-gray-500">Loading your entries...</div>
      </div>

      <div v-else-if="entries.length === 0" class="text-center py-8">
        <div class="text-gray-500">No entries yet. Add your first log entry above!</div>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="entry in entries"
          :key="entry.id"
          class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="font-medium text-gray-900">{{ entry.key }}</span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(entry.created_at) }}
                </span>
              </div>
              <div class="text-gray-700">
                <pre class="whitespace-pre-wrap font-mono text-sm bg-gray-100 p-2 rounded">{{ formatValue(entry.value) }}</pre>
              </div>
            </div>
            <button
              @click="deleteEntry(entry.id)"
              class="text-red-600 hover:text-red-800 text-sm ml-4"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="mt-6 text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { LogEntry, CreateLogRequest } from '../types'

const props = defineProps<{
  user: User
}>()

const newEntry = ref<CreateLogRequest>({
  key: '',
  value: ''
})

const entries = ref<LogEntry[]>([])
const loading = ref(false)
const loadingEntries = ref(false)
const loadingMore = ref(false)
const error = ref('')
const success = ref('')
const hasMore = ref(true)
const pageSize = 20

onMounted(() => {
  loadEntries()
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Try to parse value as JSON, otherwise keep as string
    let parsedValue: any = newEntry.value.value
    try {
      parsedValue = JSON.parse(newEntry.value.value)
    } catch {
      // Keep as string if not valid JSON
    }

    const { data, error: insertError } = await supabase
      .from('log_entries')
      .insert({
        key: newEntry.value.key,
        value: parsedValue
      })
      .select()
      .single()

    if (insertError) throw insertError

    success.value = 'Entry added successfully!'
    newEntry.value = { key: '', value: '' }
    
    // Add new entry to the beginning of the list
    if (data) {
      entries.value.unshift(data)
    }

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = ''
    }, 3000)

  } catch (err: any) {
    error.value = err.message || 'Failed to add entry'
  } finally {
    loading.value = false
  }
}

const loadEntries = async (offset = 0) => {
  if (offset === 0) {
    loadingEntries.value = true
  } else {
    loadingMore.value = true
  }

  try {
    const { data, error: fetchError } = await supabase
      .from('log_entries')
      .select('*')
      .eq('user_id', props.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (fetchError) throw fetchError

    if (offset === 0) {
      entries.value = data || []
    } else {
      entries.value.push(...(data || []))
    }

    hasMore.value = (data?.length || 0) === pageSize

  } catch (err: any) {
    error.value = err.message || 'Failed to load entries'
  } finally {
    loadingEntries.value = false
    loadingMore.value = false
  }
}

const refreshEntries = () => {
  loadEntries()
}

const loadMore = () => {
  loadEntries(entries.value.length)
}

const deleteEntry = async (id: string) => {
  if (!confirm('Are you sure you want to delete this entry?')) return

  try {
    const { error: deleteError } = await supabase
      .from('log_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', props.user.id)

    if (deleteError) throw deleteError

    entries.value = entries.value.filter(entry => entry.id !== id)
  } catch (err: any) {
    error.value = err.message || 'Failed to delete entry'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const formatValue = (value: any) => {
  if (typeof value === 'string') {
    return value
  }
  return JSON.stringify(value, null, 2)
}
</script>
