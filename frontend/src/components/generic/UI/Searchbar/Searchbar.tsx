import { useNavigate } from 'react-router-dom';
import style from './Searchbar.module.css';
import type { ISearchResult } from '../../../../types/components/ISearch';
import { useContext, useEffect, useState } from 'react';
import { fetchImage } from '../../../../services/fetchImageService';
import { AuthContext } from '../../../../context/authContext';

interface SearchbarProps {
  onSubmit(text: string): void;
  onInput(text: string): void;
  onUserClick():void
  text: string;
  results: ISearchResult[] | undefined;
}
interface SearchResultProps {
  name: string;
  avatarUrl: string;
  onClick(): void;
  moreImportantInfo?: string;
}
export default function Searchbar({ text, onInput, onSubmit, onUserClick,results }: SearchbarProps) {
  const [defaultImage, setDefaultImage] = useState<string>();
  useEffect(() => {
    (async () => {
      const img = await fetchImage('unk_person.png');
      setDefaultImage(img);
      console.log(img);
    })();
  }, []);
  const nav = useNavigate();
  const authContext = useContext(AuthContext);
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
                avatarUrl={v.avatar ?? defaultImage}
                moreImportantInfo={v.moreSpecifiedInfo}
                onClick={() => {
                  if (authContext?.user && +authContext.user?.id === v.id) {
                    nav(`/profile/me`);
                  } else {
                    nav(`/profile/${v.id}`);
                  }
                  onUserClick()
                }}
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
      <div className={style.avatar} style={{ backgroundImage: `url(${avatarUrl})` }}></div>
      <div className={style.result}>
        <div className={style.name}>{name}</div>
        {moreImportantInfo && <div className={style.importantinfo}>{moreImportantInfo}</div>}
      </div>
    </div>
  );
};
