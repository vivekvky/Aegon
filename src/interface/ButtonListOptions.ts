export default interface IButtonListOptions {
  options: string[];
  handleChoice: (e: string) => void;
  selected: string | null;
}
