import AdapterType from "@jbrowse/core/pluggableElementTypes/AdapterType";
import Plugin from "@jbrowse/core/Plugin";
import { AdapterClass, configSchema } from "./CIVICAdapter";
import { version } from "../package.json";

export default class CIVICPlugin extends Plugin {
  name = "CIVICPlugin";
  version = version;
  install(pluginManager: any) {
    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: "CIVICAdapter",
          configSchema,
          AdapterClass,
        }),
    );
  }
}
