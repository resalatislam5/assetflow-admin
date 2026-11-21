import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type themeMode = 'light' | 'dark';

interface IThemeState {
  mode: themeMode;
  color_themes: {
    id: string;
    primary: string;
    bg: string;
    accent: string;
    text: string;
    preview: string[];
  };
  fontFamily: {
    id: string;
    label: string;
    value: string;
  };
  fontSize: {
    id: string;
    label: string;
    value: number;
  };
}

const initialState: IThemeState = {
  mode: (localStorage.getItem('theme') as themeMode) || 'light',
  color_themes: {
    id: 'assetflow',
    primary: '#10B981',
    bg: '#ECFDF5',
    accent: '#A7F3D0',
    text: '#172554',
    preview: ['#10B981', '#059669', '#172554'],
  },
  fontFamily: {
    id: 'segoe_ui',
    label: 'Segoe UI',
    value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  fontSize: {
    id: 'md',
    label: 'Medium',
    value: 14,
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme(state, action: PayloadAction<themeMode>) {
      state.mode = action.payload;
    },
    setColorTheme(state, action: PayloadAction<IThemeState['color_themes']>) {
      state.color_themes = action.payload;
    },
    setFontFamily(state, action: PayloadAction<IThemeState['fontFamily']>) {
      state.fontFamily = action.payload;
    },
    setFontSize(state, action: PayloadAction<IThemeState['fontSize']>) {
      state.fontSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action): action is PayloadAction<{ theme?: IThemeState } | undefined> =>
        action.type === 'persist/REHYDRATE',
      (state, action) => {
        const persistedTheme = action.payload?.theme;
        if (
          !persistedTheme ||
          persistedTheme?.color_themes?.primary !== '#10B981'
        ) {
          state.color_themes = initialState.color_themes;
        }
      },
    );
  },
});

export const {
  setTheme,
  toggleTheme,
  setColorTheme,
  setFontFamily,
  setFontSize,
} = themeSlice.actions;
export default themeSlice.reducer;
