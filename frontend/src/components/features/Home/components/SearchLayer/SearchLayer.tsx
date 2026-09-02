import { useCallback, useState } from 'react';
import Searchbar from '../../../../generic/UI/Searchbar/Searchbar';
import { useAPI } from '../../../../../hooks/useAPI';

interface IResult {
  fullName: string;
  avatar: string;
  moreSpecifiedInfo?: string;
}

export default function SearchLayer() {
  const [inputText, setInputText] = useState<string>('');
  const [results, setResults] = useState<IResult[] | undefined>(undefined);
  const { request } = useAPI();
  const findByUserText = useCallback(
    async function findByUserText(text: string) {
      if (!text || text.length === 0 || typeof text !== 'string' || text.trim().length === 0) return;
      const result = await request<IResult[]>(`/api/search/?criteria=${text}`, 'GET');
      if (result && result.success) {
        const receivedData: IResult[] | undefined = result.data;
     
        setResults(receivedData);
      }
    },
    [request],
  );

  return (
    <Searchbar
      text={inputText}
      onInput={(text)=> {
        setInputText(text);
        if (text.trim().length === 0) {
          setResults([])
        }
      }}
      onSubmit={async (text: string) => {
        await findByUserText(text);
      }}
      results={results ?? []}
    />
  );
}
