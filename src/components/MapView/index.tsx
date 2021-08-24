import React, { Component } from "react";
import * as modelData from "../../data/AF-mini.json";
import VectorMap from "../VectorMap";
import ModelInfo, { ModelInfoSetting } from "../ModelInfo";
import ModelFeatureCollection from "../../interfaces/ModelFeatureCollection";
import "./index.css";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  FeatureCollection,
  Geometries,
  Properties,
  Feature
} from "@turf/helpers";
import { ThrottleValve, Calibration } from "../ResultsProvider";
import ReactGA from "react-ga";

// TODO: Clean up and remove the requirement for settings and check for null
const setting: ModelInfoSetting = {
  modeName: "Test Model",
  currentTimestep: 0,
  timesteps: [
    "2018-01-31T00:00:00",
    "2018-01-31T00:15:00",
    "2018-01-31T00:30:00",
    "2018-01-31T00:45:00",
    "2018-01-31T01:00:00",
    "2018-01-31T01:15:00",
    "2018-01-31T01:30:00",
    "2018-01-31T01:38:00",
    "2018-01-31T01:45:00",
    "2018-01-31T02:00:00",
    "2018-01-31T02:15:00",
    "2018-01-31T02:30:00",
    "2018-01-31T02:45:00",
    "2018-01-31T03:00:00",
    "2018-01-31T03:15:00",
    "2018-01-31T03:30:00",
    "2018-01-31T03:45:00",
    "2018-01-31T04:00:00",
    "2018-01-31T04:15:00",
    "2018-01-31T04:30:00",
    "2018-01-31T04:45:00",
    "2018-01-31T05:00:00",
    "2018-01-31T05:15:00",
    "2018-01-31T05:30:00",
    "2018-01-31T05:45:00",
    "2018-01-31T06:00:00",
    "2018-01-31T06:15:00",
    "2018-01-31T06:30:00",
    "2018-01-31T06:45:00",
    "2018-01-31T06:57:00",
    "2018-01-31T07:00:00",
    "2018-01-31T07:15:00",
    "2018-01-31T07:30:00",
    "2018-01-31T07:45:00",
    "2018-01-31T07:58:00",
    "2018-01-31T08:00:00",
    "2018-01-31T08:09:00",
    "2018-01-31T08:14:00",
    "2018-01-31T08:15:00",
    "2018-01-31T08:17:00",
    "2018-01-31T08:18:00",
    "2018-01-31T08:19:00",
    "2018-01-31T08:30:00",
    "2018-01-31T08:45:00",
    "2018-01-31T09:00:00",
    "2018-01-31T09:15:00",
    "2018-01-31T09:30:00",
    "2018-01-31T09:45:00",
    "2018-01-31T10:00:00",
    "2018-01-31T10:15:00",
    "2018-01-31T10:30:00",
    "2018-01-31T10:45:00",
    "2018-01-31T11:00:00",
    "2018-01-31T11:15:00",
    "2018-01-31T11:30:00",
    "2018-01-31T11:45:00",
    "2018-01-31T12:00:00",
    "2018-01-31T12:15:00",
    "2018-01-31T12:30:00",
    "2018-01-31T12:45:00",
    "2018-01-31T13:00:00",
    "2018-01-31T13:15:00",
    "2018-01-31T13:30:00",
    "2018-01-31T13:45:00",
    "2018-01-31T14:00:00",
    "2018-01-31T14:15:00",
    "2018-01-31T14:30:00",
    "2018-01-31T14:45:00",
    "2018-01-31T15:00:00",
    "2018-01-31T15:15:00",
    "2018-01-31T15:30:00",
    "2018-01-31T15:45:00",
    "2018-01-31T16:00:00",
    "2018-01-31T16:15:00",
    "2018-01-31T16:30:00",
    "2018-01-31T16:45:00",
    "2018-01-31T17:00:00",
    "2018-01-31T17:15:00",
    "2018-01-31T17:30:00",
    "2018-01-31T17:45:00",
    "2018-01-31T18:00:00",
    "2018-01-31T18:15:00",
    "2018-01-31T18:30:00",
    "2018-01-31T18:45:00",
    "2018-01-31T19:00:00",
    "2018-01-31T19:15:00",
    "2018-01-31T19:30:00",
    "2018-01-31T19:45:00",
    "2018-01-31T20:00:00",
    "2018-01-31T20:15:00",
    "2018-01-31T20:30:00",
    "2018-01-31T20:45:00",
    "2018-01-31T21:00:00",
    "2018-01-31T21:15:00",
    "2018-01-31T21:30:00",
    "2018-01-31T21:45:00",
    "2018-01-31T22:00:00",
    "2018-01-31T22:15:00",
    "2018-01-31T22:30:00",
    "2018-01-31T22:45:00",
    "2018-01-31T23:00:00",
    "2018-01-31T23:15:00",
    "2018-01-31T23:30:00",
    "2018-01-31T23:45:00"
  ].map(t => new Date(t)),
  selectedFeature: null
};

type Props = {
  addCalibration: (
    actions: ThrottleValve[],
    type: string,
    isMulti: boolean
  ) => void;
  calibrationActions: Calibration[];
  modelGeoJson: ModelFeatureCollection;
  selectedMainIds: string[];
};

interface MapViewState {
  isLoading: boolean;
  isFileLoaded: boolean;
  projectionString: string;
  setting: ModelInfoSetting;
}

class MapView extends Component<Props, MapViewState> {
  state: Readonly<MapViewState> = {
    isLoading: true,
    isFileLoaded: true,
    projectionString:
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +datum=OSGB36 +units=m +no_defs",
    setting
  };

  _updateSettings = (value: string) => {
    this.setState(prevState => ({
      setting: {
        ...prevState.setting,
        currentTimestep: parseInt(value)
      }
    }));
  };

  _updateSelectedFeature = (value: Feature) => {
    if (
      value.properties !== null &&
      value.properties.table === "wn_valve" &&
      value.properties.mode === "PRV"
    ) {
      ReactGA.event({
        category: "Create Calibration",
        action: "PRV Setting"
      });

      const pressure = isNaN(parseFloat(value.properties.pressure))
        ? 100
        : parseFloat(value.properties.pressure);
      const action = [{ id: value.properties.id, action: { pressure } }];
      this.props.addCalibration(action, "PRV", false);
      const selectedFeature: { [name: string]: any } = value.properties;
      this.setState(prevState => ({
        setting: {
          ...prevState.setting,
          selectedFeature
        }
      }));
    } else if (
      value.properties !== null &&
      value.properties.table === "wn_valve"
    ) {
      ReactGA.event({
        category: "Create Calibration",
        action: "THV Setting"
      });
      const opening = isNaN(parseFloat(value.properties.opening))
        ? 100
        : parseFloat(value.properties.opening);
      const action = [{ id: value.properties.id, action: { opening } }];
      this.props.addCalibration(action, "THV", false);
      const selectedFeature: { [name: string]: any } = value.properties;
      this.setState(prevState => ({
        setting: {
          ...prevState.setting,
          selectedFeature
        }
      }));
    }
  };

  _clearSelectedFeature = () => {
    this.setState(prevState => ({
      setting: {
        ...prevState.setting,
        selectedFeature: null
      }
    }));
  };

  _updateProjectionString = (projectionString: string) => {
    this.setState(prevState => ({ projectionString, isLoading: true }));
  };

  render() {
    const { isLoading, isFileLoaded, setting, projectionString } = this.state;

    return (
      <>
        <VectorMap
          calibrationActions={this.props.calibrationActions}
          projectionString={projectionString}
          onSelectFeature={this._updateSelectedFeature}
          modelGeoJson={this.props.modelGeoJson}
          selectedMainIds={this.props.selectedMainIds}
        />
        {
          //<ModelInfo settings={setting} onChange={this._updateSettings} onClearSelected={this._clearSelectedFeature} />
        }
      </>
    );
  }
}

export default MapView;
