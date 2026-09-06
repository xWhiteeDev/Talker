import { useNavigate } from 'react-router-dom';
import style from './Searchbar.module.css';
import type { ISearchResult } from '../../../../types/components/ISearch';

interface SearchbarProps {
  onSubmit(text: string): void;
  onInput(text: string): void;
  text: string;
  results: ISearchResult[] | undefined;
}
interface SearchResultProps {
  name: string;
  avatarUrl: string;
  onClick(): void;
  moreImportantInfo?: string;
}
export default function Searchbar({ text, onInput, onSubmit, results }: SearchbarProps) {
  const nav = useNavigate();
  return (
    <div className={style.container}>
      <div className={style.searchbar}>
        <input
          type="text"
          placeholder="Search..."
          onInput={(event) => onInput(event.currentTarget.value)}
          value={text}
          className={style.oneLineSearchInput}
          required
          onKeyDown={(keyEvent) => {
            if (keyEvent.key === 'Enter') {
              if (text.length == 0) {
                return;
              }
              onSubmit(text);
            }
          }}
          max={100}
          min={0}
        />
      </div>
      {results && results.length > 0 && (
        <div className={style.results}>
          {results &&
            results.map((v, i) => (
              <SearchResult
                key={v.fullName + i + v.avatar}
                name={v.fullName}
                avatarUrl={v.avatar}
                moreImportantInfo={v.moreSpecifiedInfo}
                onClick={() => nav(`/profile/${v.id}`)}
              />
            ))}
        </div>
      )}
    </div>
  );
}

const SearchResult = ({ name, moreImportantInfo, avatarUrl, onClick }: SearchResultProps) => {
  return (
    <div className={style.exampleresult} onClick={onClick}>
      <div className={style.avatar} style={{ backgroundImage: avatarUrl }}></div>
      <div className={style.result}>
        <div className={style.name}>{name}</div>
        {moreImportantInfo && <div className={style.importantinfo}>{moreImportantInfo}</div>}
      </div>
    </div>
  );
};
