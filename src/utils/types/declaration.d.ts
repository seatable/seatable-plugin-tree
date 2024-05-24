declare module '*.scss';
declare module 'dtable-sdk';
declare module '*.png' {
  const value: any;
  export default value;
}

declare enum LINK_TYPE {
  Link = 'link',
  Formula = 'link-formula',
  Formula2nd = 'link-formula-2nd',
}
