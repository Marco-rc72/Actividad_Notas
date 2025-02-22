<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
    <div class="space-y-4">
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

      <select 
        id="status"
        v-model="form.status"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      >
        <option value="Iniciada">Iniciada</option>
        <option value="En progreso">En progreso</option>
        <option value="Completada">Completada</option>
      </select>

      <!-- Select para etiquetas predeterminadas -->
      <select 
        v-model="selectedTag"
        @change="handleTagChange"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      >
        <option value="Personal">Personal</option>
        <option value="Urgente">Urgente</option>
        <option value="Trabajo">Trabajo</option>
        <option value="Otra">Otra...</option>
        
      </select>

      <!-- Input para etiqueta personalizada -->
      <input 
        v-if="showCustomTagInput"
        v-model="customTag"
        type="text"
        placeholder="Escribe tu etiqueta personalizada"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
      />

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

// Define las props y emits
const props = defineProps<{
  notaAEditar: Notas | null
}>()

const emit = defineEmits(['submit', 'reset-edicion'])

// Estado del formulario
const initialForm = {
  title: '',
  description: '',
  status: 'Iniciada' as const,
  tag: 'Trabajo' as const, // Campo de etiqueta
  dueDate: new Date(), 
  completed: false,
  createdAt: new Date(),
}

const form = reactive({ ...initialForm })

// Lógica para manejar etiquetas
const selectedTag = ref('Trabajo') // Etiqueta seleccionada en el <select>
const customTag = ref('') // Etiqueta personalizada
const showCustomTagInput = ref(false) // Mostrar/ocultar el input personalizado

// Actualizar el formulario cuando cambia la nota a editar
watch(() => props.notaAEditar, (nota) => {
  if (nota) {
    Object.assign(form, { ...nota })
    if (['Trabajo', 'Personal', 'Urgente'].includes(nota.tag)) {
      selectedTag.value = nota.tag
      showCustomTagInput.value = false
    } else {
      selectedTag.value = 'Otra'
      customTag.value = nota.tag
      showCustomTagInput.value = true
    }
  } else {
    resetForm()
  }
})

const handleTagChange = () => {
  if (selectedTag.value === 'Otra') {
    showCustomTagInput.value = true
    form.tag = '' // Reiniciar la etiqueta del formulario
  } else {
    showCustomTagInput.value = false
    form.tag = selectedTag.value // Usar la etiqueta seleccionada
  }
}

// Validación del formulario
const isFormValid = computed(() => {
  return form.title.trim() !== '' && form.description.trim() !== ''
})

const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  // Si se seleccionó "Otra..." y se escribió una etiqueta personalizada
  if (selectedTag.value === 'Otra' && customTag.value.trim() !== '') {
    form.tag = customTag.value
  }

  // Emitir el evento "submit" con los datos del formulario
  emit('submit', { ...form })

  // Reiniciar el formulario
  resetForm()
}

const resetForm = () => {
  Object.assign(form, initialForm)
  selectedTag.value = 'Trabajo'
  customTag.value = ''
  showCustomTagInput.value = false
  emit('reset-edicion')
}
</script>