import { useColorSchemePreference } from '../../../hooks/use-dom';
import type { DefaultLayoutProps } from './media-layout';

export function useColorSchemeClass(colorScheme: DefaultLayoutProps['colorScheme']) {
  const systemColorPreference = useColorSchemePreference();
  if (colorScheme === 'default') {
    return null;
  } else if (colorScheme === 'system') {
    return systemColorPreference;
  } else {
    return colorScheme;
  }
}
