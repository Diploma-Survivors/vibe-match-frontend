import { selectWorkspace } from '@/store/slides/workspace-slice';
import { useSelector } from 'react-redux';

export function useLanguage() {
  const { languages } = useSelector(selectWorkspace);

  const getLanguageName = (id: number) => {
    const language = languages.find((l) => l.id === id);
    return language ? language.name : `Language ${id}`;
  };

  return { getLanguageName };
}
