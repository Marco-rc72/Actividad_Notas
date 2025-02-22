import type { Notas } from '@/interfaces/Types'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'


export const useNotasStore = defineStore('notas', () => {
  const notas = ref<Notas[]>(JSON.parse(localStorage.getItem('notas')|| '[]'))
  const cargando = ref(false)

  const NotaCompletada = computed(() => notas.value.filter((notas)=> notas.completed))
  const NotaPendiente = computed(() => notas.value.filter((notas)=> !notas.completed) )


  async function fetchNotas() {
    cargando.value = true
    try {
      // Simulación de llamada API
      // const response = await fetch('/api/tasks')
      //tasks.value = await response.json()
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      cargando.value = false
    }
  }

  function AñadirNota(nota: Omit<Notas, 'id'| 'createdAt'>){
    const NuevaNota: Notas = {
      ...nota,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    notas.value.push(NuevaNota)
  }

  function eliminarNota(id: string) {
    notas.value = notas.value.filter(nota => nota.id !== id)
  }

  function editarNota(notaActualizada: Notas) {
    const index = notas.value.findIndex(nota => nota.id === notaActualizada.id)
    if (index !== -1) {
      notas.value[index] = notaActualizada
    }
  }

  const NotesTotal = 

  watch(
    notas,
    (nuevaNota) => {
      localStorage.setItem('notas', JSON.stringify(nuevaNota))
    },
    {deep: true},
  )


//Filtrado por fecha
const NotasOrdenadas = computed(() => {
  return [...notas.value].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })
})


//Filtro de Notas por etiqueta
const FiltrarNotasPorEtiqueta = (tag:string) => {
  if (!tag) return NotasOrdenadas.value;
  return NotasOrdenadas.value.filter((notas) => notas.tag.includes(tag));
}

//Filtrar Notas por el estado
const FiltrarNotasPorEstado = (status: string) => {
  if(!status) return NotasOrdenadas.value;
  return NotasOrdenadas.value.filter((notas) => notas.status === status);
};

//Limpirar todas las notas
const LimpiarTodasLasNotas = () =>{
  notas.value = [];
  GuardarNotas();  
};


//Limpiar notas por etiqueta
const LimpiarNotasPorEtiqueta = (tag:string) => {
  notas.value = notas.value.filter((notas) => !notas.tag.includes(tag));
  GuardarNotas();

}


  // Guardar notas en localStorage
  const GuardarNotas = () => {
    localStorage.setItem('notas', JSON.stringify(notas.value));
  };



  return{
    notas,
    cargando,
    NotaCompletada,
    NotaPendiente,
    AñadirNota,
    eliminarNota,
    editarNota,
    fetchNotas,
    NotasOrdenadas,
    FiltrarNotasPorEtiqueta,
    FiltrarNotasPorEstado,
    GuardarNotas,
    LimpiarTodasLasNotas,
    LimpiarNotasPorEtiqueta,
  } 
})