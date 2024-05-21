# SeaTable Plugin Template

## What is a SeaTable Plugin?

SeaTable, the world-leading no-code app-building platform, supports plugins. Plugins provide additional visualization or interaction possibilities within a SeaTable base. Examples of SeaTable Plugins include the Gallery, the Map Plugin, or the Kanban board. You can find a list of all publicly available plugins at the SeaTable Marketplace.

In general, a Plugin needs to be installed by the system admin on the SeaTable server and can then be activated in any base by the user. More information about plugins in general can be found in the user documentation at SeaTable Docs.

SeaTable - the world leading no-code app building platform supports plugins. Plugins provide additional visualization or interaction possibilities with a SeaTable base. Examples of SeaTable Plugins are the Gallery, The Map Plugin or the Kanban board. You can find a list of all public available plugins at https://market.seatable.io.

In general a Plugin has to be installed by the system admin on the seatable server and then can be activated in any base by the user.
You can read more about plugins in general at the user documentation at https://docs.seatable.io.

## Purpose of this Repository: Develop Your Own Plugin

This GitHub repository provides everything you need to develop your own plugin. It includes:

- A local development area to test your plugins before building and compiling them into a zip file.
- Necessary libraries to interact with the content of a SeaTable base.
- A framework with basic functions to immediately start visualizing your data.

This repository handles all the heavy lifting for you. We will guide you through the process of building your own plugin step by step. If you know how to code in TypeScript/JavaScript, there is no reason why you shouldn't try to build your own plugin.

Let's get started.

## Installing Your Local Development Environment

As previously mentioned, you'll be developing your SeaTable Plugin in a local development environment. In this setup, you simply instruct the code on which SeaTable Server and base the plugin should connect to. When you later package and install the plugin on a SeaTable server and activate it within a base, the plugin disregards these development settings and connects directly to the base and its data.

You can image it like this:

- During Development, the plugin is initialized by `index.js`, which reads its configuration from `setting.local.js` and passes everything to the plugin defined in `app.tsx`.

- In Production, the plugin is initialized by `entry.tsx`, enabling it to directly connect to `app.tsx` and interact with the base.

### 0. Requirements

You need to install node 17 or 18. (?? needs to be clarified) You will required a good understanding of how to develop react or javascript apps.

### 1. clone project

Clone this repository to your local system.

```bash
git clone https://github.com/seatable/seatable-plugin-template-base
```

You should see a lot of folders like this:

```bash
build -------------------------- folder after project compilation
config ------------------------- project compilation configuration folder
plugin-zip --------------------- project zip folder after zip packaging ()
public ------------------------- project local development static files folder
scripts ------------------------ project packaging scripts
src ---------------------------- project source folder
  locale ----------------------- project internationalization support folder
    lang ----------------------- language folder
    index.ts ------------------- internationalization language support entry file
  app.tsx ---------------------- project main code
  entry.tsx -------------------- The entry file of the plugin in production environment
  index.js --------------------- The entry file of the plugin in development environment
  setting.local.dist.js -------- Local sample configuration file in development environment
  setting.local.js ------------- Local configuration file (You should create it by copying from setting.local.dist.js)
  setting.ts ------------------- Configuration file in development environment
```

It is important that you only hve to work in the `/src` folder.

### 2. Give your plugin a unique name

There is a central configuration file at `src/plugin-config/info.js`. In this file you give your plugin a unique name and add a short description. Also you can upload a custom icon.png (128x128px) or a card_image.png (560x240px) that is used in the system admin area of SeaTable.

```js
  "name": "plugin-template",
  "version": "0.9.0",
  "display_type": "overlay",
  "display_name": "Plugin template",
  "description": "Design your own SeaTable plugin."
```

There is no need to add other configuration parameters here. You should not change the name because this value is used to store data about this plugin in SeaTable.

### 3. Tell the plugin to which base the plugin should connect

Make a copy and of the sample file `setting.local.dist.js` and name it `setting.local.js`. Add all the necessary values that the Plugin can connect to this SeaTable Server and base. This setting is ignored as soon as the plugin is installed in a SeaTable Server.

Important: make sure that you don't add setting.local.js to version control or upload it anywhere. The APIToken is a secret and should be protected like any credentials.

```js
  server: '<url of your SeaTable Server like https://cloud.seatable.io>',
  dtableName: '<name of your base like Projects>',
  APIToken: '<API token of the base>',
  workspaceID: '<workspace id - get from the URL if you open the base in the browser>',
  lang: 'en',
  loadVerbose: true,
```

### 4. Load the npm packages and start your server

Now only two more commands are necessary to start your local plugin development

```bash
npm install
npm run start
```

The first command installs all the required nodejs packages to the `/node_modules` folder. The second command starts the local development server, opens a new browser tab and loads `http://127.0.0.1:3000`.

You should see the following:

SCREENSHOT

### 5. Make some changes

Now you can start developing your own plugin. Just try to change ... and hit save.
Your browser tab should reload automatically and should show you your change.

## Publish your plugin

As soon as you feel ready to publish your plugin, you have to compile and package it. This repository provides the necessary script to do so.

```bash
npm run build-plugin
```

This generates a new zip file in the folder `/plugin-zip`. You can take this zip file and upload it to any SeaTable Server where you have admin rights.

SCREENSHOT

After installing the plugin to System Admin Area, you can load this plugin in any base.

SCREENSHOT

---

Additional topics:

## Plugin Package

The plugin package is a file in zip format. The directory structure after decompression is as follows

```
/plugin
  /main.js              // compiled js file
  /info.json            // plugin info file
  /media                // plugin static files folder
  /media/main.css       // compiled css file
  /media/icon.png       // icon image of the plugin
  /media/card_image.png // background image for plugin icon
```

## Plugin Development Library

Plug-in development can use the following two libraries:

UPDATE - Link to developer manual !!!!

1. dtable-sdk, which provides an API for reading and writing the current dtable data (https://docs.seatable.io/published/dtable-sdk/home.md)
2. (Optional) dtable-ui-component, which provides a reusable UI component library (to be improved)

> A table in the SeaTable system is called dtable (database table)

## Add internationalization support

### There are two cases of plugin internationalization

1. Plugin display name internationalization
2. Internationalization of the internal content of the plugin: The translation strings should be placed in js files and packaged with the plugin's other js source files into a final js file.

#### Plugin display name internationalization

The name displayed by the plug-in can also provide an international display. If you need to provide internationalization for the display name of the plug-in, you can modify the display_name parameter in the plug-in configuration information file `info.json`, the modification type is as follows:

```
display_name: {
  'en': '',
  'fr': '',
  'de': '',
  'zh-cn': '',
  ...
}
```

If you do not need to provide internationalization for the display name of the plug-in, you can directly assign the display_name parameter in the plug-in configuration information file `info.json`

```
display_name: ''
```

#### Internationalization of the internal content of the plugin

We recommend to use [react-intl-universal](https://github.com/alibaba/react-intl-universal) for plugin internationalization.

This library support internationalization for the following contents:

1. Number
2. Currency
3. Date
4. Times
5. Message（Default Message、Message With Variables、HTML Message)

Steps:

1. Add supported language files in `src/locale/lang` \*\*. Js
2. Add the corresponding international key and value key-value pairs in the file
3. Import translation components in components that need to add internationalized content `import intl from 'react-intl-universal`
4. Call the intl interface function to complete the corresponding international call work, please use the documentation to move ➡️[react-intl-universal](https://github.com/alibaba/react-intl-universal)
