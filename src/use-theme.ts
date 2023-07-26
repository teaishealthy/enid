import { useContext } from 'react';
import { IThemeContext, ThemeContext } from './theme-context';

export const useTheme = () => useContext<IThemeContext>(ThemeContext);
