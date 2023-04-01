import { ChangeEvent } from 'react';
import { create } from 'zustand';

interface IUseSubject {
  subject: string;
  handleChangeSubject: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface IUseIntroduction {
  introduction: string;
  setIntroduction: (value?: string) => void;
  handleChangeIntroduction: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface IUseMainSubject {
  mainSubject: string;
  setMainSubject: (value?: string) => void;
  handleChangeMainSubjectChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface IUseConclusion {
  conclusion: string;
  setConclusion: (value?: string) => void;
  handleChangeConclusion: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export const useSubject = create<IUseSubject>((set) => ({
  subject: "",
  handleChangeSubject: (event: ChangeEvent<HTMLInputElement>) => set(() => ({ subject: event.target.value})),
}))

export const useIntroduction = create<IUseIntroduction>((set) => ({
  introduction: "",
  setIntroduction: (value?: string) => set(() => ({ introduction: value })),
  handleChangeIntroduction: (event: ChangeEvent<HTMLTextAreaElement>) => set(() => ({ introduction: event.target.value })),
}))

export const useMainSubject = create<IUseMainSubject>((set) => ({
  mainSubject: "",
  setMainSubject: (value?: string) => set(() => ({ mainSubject: value })),
  handleChangeMainSubjectChange: (event: ChangeEvent<HTMLTextAreaElement>) => set(() => ({ mainSubject: event.target.value })),
}))

export const useConclusion = create<IUseConclusion>((set) => ({
  conclusion: "",
  setConclusion: (value?: string) => set(() => ({ conclusion: value })),
  handleChangeConclusion: (event: ChangeEvent<HTMLTextAreaElement>) => set(() => ({ conclusion: event.target.value })),
}))