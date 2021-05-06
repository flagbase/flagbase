export type Identity = {
  identifier: string;
  traits: {
    [key: string]: string | number;
  };
};

export const DEFAULT_IDENTITY: Identity = {
  identifier: '',
  traits: {}
}
