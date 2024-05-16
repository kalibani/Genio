import { blobToFormData } from '@/lib/utils';
import { create } from 'zustand';

interface questionState {
  videoUrl?: Blob | null;
  question: string;
  timeRead?: number;
  timeAnswered?: number;
  title: string;
}
interface RecorderState {
  title: string;
  durationTimeRead: number;
  durationTimeAnswered: number;
  questionRetake?: number;
  introVideoUrl?: Blob | null;
  farewellVideoUrl?: Blob | null;
  questionVideoUrl?: Blob | null;
  farewellTitle?: string;
  farewellDescription?: string;
  questions: questionState[];
  isLoading: boolean;
  setTitle: (title: string, type: 'title' | 'farewell' | 'desc') => void;
  setFormFirst: (data: {
    title: string;
    durationTimeRead?: number;
    durationTimeAnswered?: number;
    questionRetake?: number;
  }) => void;
  setVideoUrl: (url: Blob | null, type: 'intro' | 'question') => void;
  setQuestion: (data: questionState) => void;
  removeQuestion: (index: number) => void;
  setIsLoading: (data: boolean) => void;
}

export const useRecorderStore = create<RecorderState>((set) => ({
  title: '',
  durationTimeRead: 0,
  durationTimeAnswered: 0,
  questionRetake: 0,
  introVideoUrl: null,
  farewellVideoUrl: null,
  questionVideoUrl: null,
  farewellDescription: '',
  farewellTitle: '',
  isLoading: false,
  questions: [],
  urlAny: new FormData(),

  setTitle: (title, type) => {
    if (type === 'title') {
      set({ title });
    } else if (type === 'farewell') {
      set({ farewellTitle: title });
    } else if (type === 'desc') {
      set({ farewellDescription: title });
    }
  },
  setFormFirst: (data) => {
    const { durationTimeAnswered, durationTimeRead, questionRetake, title } =
      data;
    set({
      title,
      durationTimeAnswered,
      durationTimeRead,
      questionRetake,
    });
  },
  setVideoUrl: (url, type) => {
    if (type === 'intro') {
      set({ introVideoUrl: url });
    } else {
      set({ questionVideoUrl: url });
    }
  },
  setQuestion: (data) =>
    set((state) => ({ questions: [...state.questions, data] })),
  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),

  setIsLoading: (data) => set({ isLoading: data }),
}));
