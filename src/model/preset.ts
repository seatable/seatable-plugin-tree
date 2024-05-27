import { IPresetModel } from '@/utils/template-utils/interfaces/Model.interface';
import { PresetSettings } from '@/utils/template-utils/interfaces/PluginPresets/Presets.interface';

export default class Preset {
  _id: string;
  name: string;
  settings: PresetSettings;

  constructor(object: IPresetModel) {
    this._id = object._id;
    this.name = object.name;
    this.settings = object.settings;
  }
}
