export {};

declare global {
  interface Window {
    dtableSDK: any;
    app: any;
    dtable: any;
    dtablePluginConfig: any;
    dtableWebAPI: any;
  }
}

export type SettingsOption = 'table' | 'view';
