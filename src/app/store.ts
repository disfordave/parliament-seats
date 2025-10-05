import { configureStore } from '@reduxjs/toolkit'
import i18nReducer from '../i18n/i18n'

export default configureStore({
  reducer: {
    i18n: i18nReducer
  },
})