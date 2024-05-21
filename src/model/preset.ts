import { IPresetModel } from 'utils/interfaces/template-interfaces/Model.interface';

export default class Preset {
  _id: string;
  name: string;
  settings: any;

  constructor(object: IPresetModel) {
    this._id = object._id;
    this.name = object.name;
    this.settings = object.settings;
  }
}
