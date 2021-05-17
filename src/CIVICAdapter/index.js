import {
  ConfigurationSchema,
  readConfObject,
} from "@jbrowse/core/configuration";
import { ObservableCreate } from "@jbrowse/core/util/rxjs";
import { BaseFeatureDataAdapter } from "@jbrowse/core/data_adapters/BaseAdapter";
import SimpleFeature from "@jbrowse/core/util/simpleFeature";

export const configSchema = ConfigurationSchema(
  "CIVICAdapter",
  {
    base: {
      type: "string",
      description: "URL for the CIVIC API",
      defaultValue: "https://civicdb.org/api/variants?count=9999999&page=1",
    },
    track: {
      type: "string",
      description: "the track to select data from",
      defaultValue: "",
    },
  },
  { explicitlyTyped: true },
);

export class AdapterClass extends BaseFeatureDataAdapter {
  async fetchFeatures() {
    const str = readConfObject(this.config, "base");
    const result = await fetch(str);
    if (!result.ok) {
      throw new Error(`Failed to fetch ${result.status} ${result.statusText}`);
    }
    return result.json();
  }

  setup() {
    if (!this.setupP) {
      this.setupP = this.fetchFeatures();
    }
    return this.setupP;
  }

  formatFeature(data) {
    const { coordinates, id, description, ...rest } = data;
    const { start, stop, chromosome } = coordinates;

    return new SimpleFeature({
      ...rest,
      coordinates,
      id,
      start: start - 1,
      end: stop,
      refName: chromosome,
      uniqueId: id,
      ...(description && { description }),
    });
  }

  getFeatures(region) {
    return ObservableCreate(async observer => {
      try {
        const data = await this.setup();
        data.records.forEach(r => {
          const f = this.formatFeature(r);
          if (
            f.get("refName") === region.refName &&
            f.get("end") >= region.start &&
            f.get("start") <= region.end
          ) {
            observer.next(f);
          }
        });
        observer.complete();
      } catch (e) {
        observer.error(e);
      }
    });
  }

  async getRefNames() {
    const arr = [];
    for (let i = 0; i < 23; i++) {
      arr.push(`${i}`);
    }
    return arr;
  }

  freeResources() {}
}
