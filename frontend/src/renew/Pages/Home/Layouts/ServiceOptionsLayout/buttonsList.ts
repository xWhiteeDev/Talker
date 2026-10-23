import type {IButtonProps} from "../../../../Components/Button/types";

export const buttonsList: (IButtonProps & {id: number;})[] = [
    {
        id: 1,
        borderRadius: '50%',
        iconAspectRatio: '1/1',
        iconWidth: '20vw',
        padding: '4%',
        withoutShadow: true,
        icon: 'moon',
        backgroundColor: 'white',
    },
    {
        id: 2,
        borderRadius: '50%',
        iconAspectRatio: '1/1',
        iconWidth: '20vw',
        padding: '4%',
        withoutShadow: true,
        icon: 'help',
        backgroundColor: 'white',
    },
    {
        id: 3,
        borderRadius: '50%',
        iconAspectRatio: '1/1',
        iconWidth: '20vw',
        padding: '4%',
        withoutShadow: true,
        icon: 'logout',
        backgroundColor: 'white',
    },
];