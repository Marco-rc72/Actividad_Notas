<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <header class="mb-12 text-left">
        <h1 class="text-5xl font-bold text-gray-900 mb-2">Gestor de Tareas</h1>
        <p class="text-lg text-gray-600">Organiza y gestiona tus tareas de manera eficiente.</p>
      </header>

      <!-- Contenedor de dos columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        <!-- Columna izquierda: Formulario -->
        <div class="w-full max-w-md">
          <!-- Selector de etiquetas para filtrar -->
          <div class="flex flex-col space-y-4">
            <div>
              <label for="filtroEtiqueta" class="block text-sm font-medium text-gray-700">Filtrar por etiqueta:</label>
              <select 
                id="filtroEtiqueta"
                v-model="etiquetaFiltro"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Todas</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>

            <!-- Selector de estado para filtrar -->
            <div>
              <label for="filtroEstado" class="block text-sm font-medium text-gray-700">Filtrar por estado:</label>
              <select 
                id="filtroEstado"
                v-model="estadoFiltro"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              >
                <option value="">Todos</option>
                <option value="Iniciada">Iniciada</option>
                <option value="En progreso">En progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
          </div>

          <!-- Botón para eliminar todas las notas -->
          <div class="mt-6">
            <button 
              @click="clearAllNotes" 
              class="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
            >
              <font-awesome-icon :icon="['fas', 'trash-alt']" class="button-icon" />
              Eliminar todas las notas
            </button>
          </div>

          <!-- Botón para eliminar notas por etiqueta -->
          <div class="mt-6" v-if="etiquetaFiltro">
            <button 
              @click="clearNotesByTag(etiquetaFiltro)" 
              class="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              <font-awesome-icon :icon="['fas', 'tag']" class="button-icon" />
              Eliminar notas de "{{ etiquetaFiltro }}"
            </button>
          </div>

          <!-- Estadísticas -->
          <div class="mt-6">
            <p class="text-lg font-semibold text-gray-900">Total de notas: {{ totalNotas }}</p>
            <div class="mt-4">
              <h3 class="text-lg font-semibold text-gray-900">Notas por etiqueta:</h3>
              <ul>
                <li v-for="(count, tag) in totalNotasPorEtiqueta" :key="tag" class="text-gray-600">
                  {{ tag }}: {{ count }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Formulario para agregar notas -->
          <FormularioNotas 
            @submit="handleSubmit" 
            :notaAEditar="notaAEditar" 
            @reset-edicion="resetNotaAEditar"
            class="mt-6"
          />
        </div>

        <!-- Columna derecha: Notas -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Tus Notas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div 
              v-for="nota in notasFiltradas" 
              :key="nota.id" 
              class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="p-6">
                <!-- Etiquetas -->
                <div class="flex flex-wrap gap-2 mb-2">
                  <span 
                    v-for="tag in nota.tags"
                    :key="tag"
                    :class="{
                      'bg-blue-100 text-blue-800': tag === 'Trabajo',
                      'bg-green-100 text-green-800': tag === 'Personal',
                      'bg-red-100 text-red-800': tag === 'Urgente',
                      'bg-gray-100 text-gray-800': !['Trabajo', 'Personal', 'Urgente'].includes(tag)
                    }" 
                    class="inline-block px-3 py-1 text-sm font-semibold rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Estado -->
                <span 
                  :class="{
                    'bg-blue-100 text-blue-800': nota.status === 'Iniciada',
                    'bg-yellow-100 text-yellow-800': nota.status === 'En progreso',
                    'bg-green-100 text-green-800': nota.status === 'Completada'
                  }" 
                  class="inline-block px-3 py-1 text-sm font-semibold rounded-full"
                >
                  {{ nota.status }}
                </span>

                <!-- Título y descripción -->
                <h3 class="mt-4 text-xl font-bold text-gray-900">{{ nota.title }}</h3>
                <p class="mt-2 text-gray-600">{{ nota.description }}</p>

                <!-- Botones de editar y eliminar -->
                <div class="flex justify-end mt-4 space-x-2">
                  <button 
                    @click="editarNota(nota)" 
                    class="p-2 text-blue-500 hover:text-blue-600 transition duration-200"
                  >
                    ✏️
                  </button>
                  <button 
                    @click="eliminarNota(nota.id)" 
                    class="p-2 text-red-500 hover:text-red-600 transition duration-200"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotasStore } from '@/stores/notas'
import FormularioNotas from '@/components/FormularioNotas.vue'
import type { Notas } from '@/interfaces/Types'

// Accede al store
const notasStore = useNotasStore()
const { notas, NotasOrdenadas, totalNotas, totalNotasPorEtiqueta } = storeToRefs(notasStore)

// Nota seleccionada para editar
const notaAEditar = ref<Notas | null>(null)

// Etiqueta seleccionada para filtrar
const etiquetaFiltro = ref('')

// Estado seleccionado para filtrar
const estadoFiltro = ref('')

// Notas filtradas por etiqueta y estado
const notasFiltradas = computed(() => {
  let notasFiltradas = NotasOrdenadas.value; // Usar NotasOrdenadas

  // Filtrar por etiqueta
  if (etiquetaFiltro.value) {
    notasFiltradas = notasStore.FiltrarNotasPorEtiqueta(etiquetaFiltro.value)
  }

  // Filtrar por estado
  if (estadoFiltro.value) {
    notasFiltradas = notasStore.FiltrarNotasPorEstado(estadoFiltro.value)
  }

  return notasFiltradas
})

// Manejar el evento submit del formulario
const handleSubmit = (nota: Notas) => {
  if (notaAEditar.value) {
    // Si hay una nota en edición, actualízala
    notasStore.editarNota(nota)
  } else {
    // Si no, agrega una nueva nota
    notasStore.AñadirNota(nota)
  }
  resetNotaAEditar()
}

// Función para editar una nota
const editarNota = (nota: Notas) => {
  notaAEditar.value = nota
}

// Función para resetear la nota en edición
const resetNotaAEditar = () => {
  notaAEditar.value = null
}

const eliminarNota = (id: string) => {
  notasStore.eliminarNota(id)
}

const clearAllNotes = () => {
  if (confirm('¿Estás seguro de que deseas eliminar todas las notas?')) {
    notasStore.LimpiarTodasLasNotas()
  }
}

const clearNotesByTag = (tag: string) => {
  if (confirm(`¿Estás seguro de que deseas eliminar todas las notas de "${tag}"?`)) {
    notasStore.LimpiarNotasPorEtiqueta(tag)
    etiquetaFiltro.value = ''
  }
}
</script>