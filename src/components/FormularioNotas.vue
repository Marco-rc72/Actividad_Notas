<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div class="space-y-4">
      <!-- Campos de título y descripción -->
      <input 
        id="title"
        v-model="form.title"
        type="text"
        placeholder="Título de la Nota"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        required
      />

      <input  
        id="description"
        v-model="form.description"
        type="text" 
        placeholder="Descripción de la Nota" 
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        required
      />

      <!-- Selector de estado -->
      <select 
        id="status"
        v-model="form.status"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      >
        <option value="Iniciada">Iniciada</option>
        <option value="En progreso">En progreso</option>
        <option value="Completada">Completada</option>
      </select>

      <!-- Selector de etiquetas -->
      <div>
        <label for="tags" class="block text-sm font-medium text-gray-700">Etiquetas:</label>
        <select 
          id="tags"
          v-model="selectedTags"
          multiple
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        >
          <option value="Trabajo">Trabajo</option>
          <option value="Personal">Personal</option>
          <option value="Urgente">Urgente</option>
          <option value="Otra">Otra...</option>
        </select>
      </div>

      <!-- Input para etiqueta personalizada -->
      <div v-if="showCustomTagInput">
        <label for="customTag" class="block text-sm font-medium text-gray-700">Etiqueta personalizada:</label>
        <input 
          id="customTag"
          v-model="customTag"
          type="text"
          placeholder="Escribe tu etiqueta personalizada"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          @click="resetForm" 
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          Limpiar
        </button>
        <button 
          type="submit" 
          :disabled="!isFormValid"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {{ notaAEditar ? 'Actualizar Nota' : 'Agregar Nota' }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import type { Notas } from '@/interfaces/Types'

const props = defineProps<{
  notaAEditar: Notas | null
}>()

const emit = defineEmits(['submit', 'reset-edicion'])

// Estado del formulario
const initialForm = {
  title: '',
  description: '',
  status: 'Iniciada' as const,
  tags: [] as string[], // Cambia a un array de strings
  dueDate: new Date(), 
  completed: false,
  createdAt: new Date(),
}

const form = reactive({ ...initialForm })

// Lógica para manejar etiquetas
const selectedTags = ref<string[]>([]) // Etiquetas seleccionadas en el <select>
const customTag = ref('') // Etiqueta personalizada
const showCustomTagInput = ref(false) // Mostrar/ocultar el input personalizado

// Actualizar el formulario cuando cambia la nota a editar
watch(() => props.notaAEditar, (nota) => {
  if (nota) {
    Object.assign(form, { ...nota })
    selectedTags.value = nota.tags
    showCustomTagInput.value = nota.tags.some(tag => !['Trabajo', 'Personal', 'Urgente'].includes(tag))
  } else {
    resetForm()
  }
})

// Manejar cambios en las etiquetas seleccionadas
watch(selectedTags, (newTags) => {
  if (newTags.includes('Otra')) {
    showCustomTagInput.value = true
  } else {
    showCustomTagInput.value = false
  }
})

// Validación del formulario
const isFormValid = computed(() => {
  return form.title.trim() !== '' && form.description.trim() !== ''
})

const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  // Si se seleccionó "Otra" y se escribió una etiqueta personalizada
  if (selectedTags.value.includes('Otra') && customTag.value.trim() !== '') {
    form.tags = [...selectedTags.value.filter(tag => tag !== 'Otra'), customTag.value]
  } else {
    form.tags = selectedTags.value
  }

  // Emitir el evento "submit" con los datos del formulario
  emit('submit', { ...form })

  // Reiniciar el formulario
  resetForm()
}

const resetForm = () => {
  Object.assign(form, initialForm)
  selectedTags.value = []
  customTag.value = ''
  showCustomTagInput.value = false
  emit('reset-edicion')
}
</script>