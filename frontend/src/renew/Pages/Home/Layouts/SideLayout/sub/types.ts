interface ISuggestedServerUser {
    firstName:string;
    lastName:string;
    mutualFriendsCount:number;
    avatarUrl:string
    id:number
}

export interface ISuggestedPeopleProps {
    users:ISuggestedServerUser[]
}
export interface ISuggestedUserProps {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  mutualFriendsCount: number;
  id: number;
}