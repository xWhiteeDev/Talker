export interface PostCreator {
    stateControllerFuction: (state: boolean) => void;
    onInput(text: string): void;
    onAdd(): void;
    onVisibilityChange?(value:string): void;

}