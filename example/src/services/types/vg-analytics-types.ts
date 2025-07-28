import { EAnalyticsData } from "../../utils/constants";

type TAnalyticsData = {
  [key in keyof typeof EAnalyticsData]?: string;
};
/**
 * for data sending or non-realtime events
 * that triggers only after some duration or collection
 *
 */
export interface IDataLayer extends TAnalyticsData {
  // [key:string]:string | undefined,
}

/**
 * realtime events type , one can have the placeholders
 * like event data or can use their own interest key value pairs
 */
export interface IAnalyticsEvents {
  event: string;
  data?: string;
  [key: string]: string | undefined;
}
