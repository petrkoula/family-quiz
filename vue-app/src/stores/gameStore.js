import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { quizData } from '@/data/quizData';
import { getQuizDataForPack } from '@/data/quizPacks';
import { usePackLibraryStore } from '@/stores/packLibraryStore';

export const useGameStore = defineStore('game', () => {
  // State
  const currentPhotoIndex = ref(0);
  const currentQuestionIndex = ref(0);
  const questionsVisible = ref(false);
  const answersRevealed = ref(false);
  const localQuizData = ref([]);
  const isInitialized = ref(false);
  const currentPackId = ref(null);
  const quizSettings = ref(null);

  // Getters
  const currentQuiz = computed(() => localQuizData.value[currentPhotoIndex.value]);
  const currentQuestion = computed(() => {
    if (!currentQuiz.value) return null;
    return currentQuiz.value.questions[currentQuestionIndex.value];
  });
  const totalPhotos = computed(() => localQuizData.value.length);
  const totalQuestions = computed(() => {
    if (!currentQuiz.value) return 0;
    return currentQuiz.value.questions.length;
  });

  // Actions
  function initializeQuizData() {
    // Local-first: Load quiz data immediately from bundled data
    localQuizData.value = quizData;
    isInitialized.value = true;
    console.log('Quiz data initialized locally:', localQuizData.value.length, 'photos');
  }

  function nextPhoto() {
    if (questionsVisible.value) return; // Block navigation when questions visible
    if (currentPhotoIndex.value < totalPhotos.value - 1) {
      currentPhotoIndex.value++;
      currentQuestionIndex.value = 0;
      questionsVisible.value = false;
      answersRevealed.value = false;
    }
  }

  function previousPhoto() {
    if (questionsVisible.value) return; // Block navigation when questions visible
    if (currentPhotoIndex.value > 0) {
      currentPhotoIndex.value--;
      currentQuestionIndex.value = 0;
      questionsVisible.value = false;
      answersRevealed.value = false;
    }
  }

  function nextQuestion() {
    if (!questionsVisible.value) return;
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value++;
      answersRevealed.value = false;
    }
  }

  function previousQuestion() {
    if (!questionsVisible.value) return;
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
      answersRevealed.value = false;
    }
  }

  function toggleQuestions() {
    questionsVisible.value = !questionsVisible.value;
    if (!questionsVisible.value) {
      answersRevealed.value = false;
    }
  }

  function revealAnswer() {
    if (questionsVisible.value) {
      answersRevealed.value = true;
    }
  }

  function hideQuestions() {
    questionsVisible.value = false;
    answersRevealed.value = false;
  }

  function selectQuizPack(packId, settings = null) {
    currentPackId.value = packId;
    quizSettings.value = settings;

    // Load quiz data from the (possibly reloaded) pack library, falling back to
    // the static pack data when the library has no entry for this pack.
    const library = usePackLibraryStore();
    const pack = library.getPack(packId);
    let quizData = pack
      ? pack.photos.map(photo => ({ image: photo.image, questions: photo.questions }))
      : getQuizDataForPack(packId);

    // Apply settings if provided
    if (settings) {
      quizData = applyQuizSettings(quizData, settings);
    }

    localQuizData.value = quizData;
    isInitialized.value = true;

    // Reset navigation state
    currentPhotoIndex.value = 0;
    currentQuestionIndex.value = 0;
    questionsVisible.value = false;
    answersRevealed.value = false;

    console.log(`Quiz pack "${packId}" loaded:`, localQuizData.value.length, 'photos');
  }

  function applyQuizSettings(quizData, settings) {
    let data = JSON.parse(JSON.stringify(quizData)); // Deep clone

    // Randomize photos if enabled
    if (settings.randomizePhotos) {
      data = shuffleArray(data);
    }

    // Process each photo
    data = data.map(photo => {
      let questions = [...photo.questions];

      // Randomize questions if enabled
      if (settings.randomizeQuestions) {
        questions = shuffleArray(questions);
      }

      // Limit questions per photo
      if (settings.questionsPerPhoto < questions.length) {
        questions = questions.slice(0, settings.questionsPerPhoto);
      }

      return {
        ...photo,
        questions,
      };
    });

    return data;
  }

  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  return {
    // State
    currentPhotoIndex,
    currentQuestionIndex,
    questionsVisible,
    answersRevealed,
    localQuizData,
    isInitialized,
    currentPackId,
    quizSettings,

    // Getters
    currentQuiz,
    currentQuestion,
    totalPhotos,
    totalQuestions,

    // Actions
    initializeQuizData,
    selectQuizPack,
    nextPhoto,
    previousPhoto,
    nextQuestion,
    previousQuestion,
    toggleQuestions,
    revealAnswer,
    hideQuestions,
  };
});
