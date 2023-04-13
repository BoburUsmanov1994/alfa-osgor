import create from 'zustand'
import {devtools, persist} from "zustand/middleware";
import config from "../config";
import storage from "../services/storage";


let store = (set) => ({
    user: null,
    isAuthenticated: false,
    breadcrumbs: [],
    setUser: (user) => set(state => ({...state, user})),
    setAuth: (isAuthenticated) => set(state => ({...state, isAuthenticated})),
    setBreadcrumbs: (breadcrumbs) => set(state => ({...state, breadcrumbs}))
})

let settingsStore = (set) => ({
    token: null,
    translateToken: null,
    darkMode: false,
    isMenuOpen: true,
    lang: storage.get('lang') || config.DEFAULT_APP_LANG,
    agreement: {},
    setToken: (token) => set(state => ({...state, token})),
    setTranslateToken: (translateToken) => set(state => ({...state, translateToken})),
    setLang: (lang) => set(state => ({...state, lang})),
    setMode: () => set(state => ({...state, darkMode: !state.darkMode})),
    setOpenMenu: () => set(state => ({...state, isMenuOpen: !state.isMenuOpen})),
    setAgreement: (attr) => set(state => ({agreement: {...state.agreement, ...attr}})),
    resetAgreement: () => set(state => ({...state, agreement: {}})),
})


store = devtools(store);
settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, {name: 'settings'});

export const useStore = create(store)
export const useSettingsStore = create(settingsStore)

