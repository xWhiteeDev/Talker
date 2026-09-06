import { useCallback, useState } from 'react';
import Searchbar from '../../../../generic/UI/Searchbar/Searchbar';
import { useAPI } from '../../../../../hooks/useAPI';
import type {ISearchResult} from '../../../../../types/components/ISearch';

export default function SearchLayer() {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<ISearchResult[] | undefined>(undefined);
  const { request } = useAPI();
  const findByUserText = useCallback(
    async function findByUserText(text: string) {
      if (!text || text.length === 0 || typeof text !== 'string' || text.trim().length === 0) return;
      const result = await request<ISearchResult[]>(`/api/search/?criteria=${text}`, 'GET');
      if (result && result.success) {
        const receivedData: ISearchResult[] | undefined = result.data;
        setResults(receivedData);
      }
    },
    [request],
  );

  return (
    <Searchbar
      text={inputText}
      onInput={(text) => {
        if (results && results.length !== 0) {
          setResults([]);
        }
        setInputText(text);
      }}
      onSubmit={async (text: string) => {
        await findByUserText(text);
      }}
      results={results}
    />
  );
}
