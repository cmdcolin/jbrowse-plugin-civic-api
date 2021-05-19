import AdapterType from "@jbrowse/core/pluggableElementTypes/AdapterType";
import Plugin from "@jbrowse/core/Plugin";
import { AdapterClass, configSchema } from "./CIVICAdapter";
import { autorun } from "mobx";
import { version } from "../package.json";
import PluginManager from "@jbrowse/core/PluginManager";

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

  configure(pm: PluginManager) {
    autorun(() => {
      if (pm.rootModel?.session)
        //@ts-ignore remove me once this is in abstract session model
        pm.rootModel.session.addTrackConf({
          type: "FeatureTrack",
          trackId: "civic_hg19",
          name: "CIVIC cancer variants hg19",
          category: ["Annotation"],
          assemblyNames: ["hg19"],
          adapter: {
            type: "CIVICAdapter",
          },
        });
    });
  }
}
