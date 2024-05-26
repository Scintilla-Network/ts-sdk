import {IModuleBlockHeaderOptions} from "./IModuleBlockHeaderOptions.js";
import {IModuleBlockPayloadOptions} from "./IModuleBlockPayloadOptions.js";

export interface IModuleBlockOptions {
    header?: IModuleBlockHeaderOptions;
    payload?: IModuleBlockPayloadOptions;
    signature?: string;
}
