import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { quizData } from '@/data/quizData'

export const useGameStore = defineStore('game', () => {
  // State
  const currentPhotoIndex = ref(0)
  const currentQuestionIndex = ref(0)
  const questionsVisible = ref(false)
  const answersRevealed = ref(false)
  const localQuizData = ref([])
  const isInitialized = ref(false)

  // Getters
  const currentQuiz = computed(() => localQuizData.value[currentPhotoIndex.value])
  const currentQuestion = computed(() => {
    if (!currentQuiz.value) return null
    return currentQuiz.value.questions[currentQuestionIndex.value]
  })
  const totalPhotos = computed(() => localQuizData.value.length)
  const totalQuestions = computed(() => {
    if (!currentQuiz.value) return 0
    return currentQuiz.value.questions.length
  })

  // Actions
  function initializeQuizData() {
    // Local-first: Load quiz data immediately from bundled data
    localQuizData.value = quizData
    isInitialized.value = true
    console.log('Quiz data initialized locally:', localQuizData.value.length, 'photos')
  }

  function nextPhoto() {
    if (questionsVisible.value) return // Block navigation when questions visible
    if (currentPhotoIndex.value < totalPhotos.value - 1) {
      currentPhotoIndex.value++
      currentQuestionIndex.value = 0
      questionsVisible.value = false
      answersRevealed.value = false
    }
  }

  function previousPhoto() {
    if (questionsVisible.value) return // Block navigation when questions visible
    if (currentPhotoIndex.value > 0) {
      currentPhotoIndex.value--
      currentQuestionIndex.value = 0
      questionsVisible.value = false
      answersRevealed.value = false
    }
  }

  function nextQuestion() {
    if (!questionsVisible.value) return
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++
      answersRevealed.value = false
    }
  }

  function previousQuestion() {
    if (!questionsVisible.value) return
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
      answersRevealed.value = false
    }
  }

  function toggleQuestions() {
    questionsVisible.value = !questionsVisible.value
    if (!questionsVisible.value) {
      answersRevealed.value = false
    }
  }

  function revealAnswer() {
    if (questionsVisible.value) {
      answersRevealed.value = true
    }
  }

  function hideQuestions() {
    questionsVisible.value = false
    answersRevealed.value = false
  }

  return {
    // State
    currentPhotoIndex,
    currentQuestionIndex,
    questionsVisible,
    answersRevealed,
    localQuizData,
    isInitialized,

    // Getters
    currentQuiz,
    currentQuestion,
    totalPhotos,
    totalQuestions,

    // Actions
    initializeQuizData,
    nextPhoto,
    previousPhoto,
    nextQuestion,
    previousQuestion,
    toggleQuestions,
    revealAnswer,
    hideQuestions
  }
})
