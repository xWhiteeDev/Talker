import { HashLoader } from 'react-spinners';
import style from './LoadingPage.module.css';
import CustomText from '../../CustomText/CustomText';
import Logo from '../../../../components/generic/UI/Logo/Logo';

export function LoadingPage() {
  return (
    <div className={style.loadingContainer}>
      <Logo
        additionalStyle={{
          width: '6vw',
          aspectRatio: '1/1',
        }}
      />
      <div className={style.text}>
        <CustomText text="Content loading" fontSize="2rem" color="black" fontWeight="600" />
        <CustomText text="(Loading depends from your connection)" fontSize="0.7rem" color="black" fontWeight="600" />
      </div>
      <HashLoader loading color="#070707" size={20} aria-label="Loading Spinner" />
    </div>
  );
}
