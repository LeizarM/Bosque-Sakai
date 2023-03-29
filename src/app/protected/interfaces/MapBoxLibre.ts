 export interface MapBoxLibre {
  type:     string;
  licence:  string;
  features: Feature[];
}

export interface Feature {
  type:       FeatureType;
  properties: Properties;
  bbox:       number[];
  geometry:   Geometry;
}

export interface Geometry {
  type:        GeometryType;
  coordinates: Array<Array<number[] | number> | number>;
}

export enum GeometryType {
  LineString = "LineString",
  Point = "Point",
  Polygon = "Polygon",
}

export interface Properties {
  place_id:     number;
  osm_type:     OsmType;
  osm_id:       number;
  display_name: string;
  place_rank:   number;
  category:     string;
  type:         string;
  importance:   number;
  icon?:        string;
  address:      Address;
}

export interface Address {
  suburb?:           string;
  city_district?:    string;
  city?:             string;
  state?:            string;
  "ISO3166-2-lvl4"?: string;
  postcode?:         string;
  country:           string;
  province?:         string;
  country_code:      string;
  neighbourhood?:    string;
  hamlet?:           string;
  town?:             string;
  county?:           string;
  locality?:         string;
  municipality?:     string;
  state_district?:   string;
  road?:             string;
  residential?:      string;
  region?:           string;
  "ISO3166-2-lvl3"?: string;
  shop?:             string;
}

export enum OsmType {
  Node = "node",
  Relation = "relation",
  Way = "way",
}

export enum FeatureType {
  Feature = "Feature",
}


