// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import i18nReducer from '../i18n/i18n'

export const store = configureStore({
  reducer: {
    i18n: i18nReducer,
  },
})

// ✅ Optional but very helpful in TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store