import TagManager from "react-gtm-module";
import { IAnalyticsEvents, IDataLayer } from "./vg-analytics-types";
import { environment } from "../../environments/environment";
/**
 * ensure just calling AnalyticsTagmanager for first time,
 * so that initialisation gets done
 * eg AnalyticsTagManger
 */
export class AnalyticsTagManager {
  private static readonly thresholdCount: number = 100;
  private static _dataLayer: IDataLayer = {}; // Initialize the _dataLayer to an empty object

  /**
   * similar to constructor block which triggers when this class is accessed
   */
  static {
    TagManager.initialize({
      gtmId: environment.gtagId,
    });
    this.consoles();
    this.unHandledExceptions();
    this.destory();
  }

  /**
   * only data sending for some duration
   * it is not for events , only  for data
   * @param data
   */
  static sendData(data: IDataLayer) {
    Object.assign(this._dataLayer, data);
    if (Object.keys(this._dataLayer).length >= this.thresholdCount) {
      this.triggerAnalytics();
      // Reset dataLayer
      this._dataLayer = {};
    }
  }

  /**
   * getting data layer to check the number of events stored etc
   *
   * @static
   * @readonly
   * @type {IDataLayer}
   */
  static get dataLayer(): IDataLayer {
    return this._dataLayer;
  }

  /**
   * trigger the data layer after some duration (not events)
   */
  public static triggerAnalytics() {
    TagManager.dataLayer({
      dataLayer: { ...this._dataLayer, timeStamp: performance.now() },
    });
  }

  /**
   * send events realtime
   * @param data
   */
  public static sendEvents(data: IAnalyticsEvents) {
    //0 => starting event or two events parallel occured(camera)
    const analyticData = { ...data, timeStamp: performance.now() };
    //send the data;
    TagManager.dataLayer({
      dataLayer: analyticData,
    });
    //reset the event time to current time;
  }

  /**
   * sending console warning and handled errors
   */
  private static consoles() {
    // const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Wrap the console.log method
    // console.log = (...args: any[]) => {
    //     sendEvents('log', args);
    //     originalLog.apply(console, args);
    // };

    // Wrap the console.error method
    console.error = (...args: any[]) => {
      this.sendEvents({
        event: EAnalyticsCommonErrors[EAnalyticsCommonErrors.HANDLED_ERRORS],
        data: JSON.stringify(args),
      });
      originalError.apply(console, args);
    };

    // Wrap the console.warn method
    console.warn = (...args: any[]) => {
      this.sendEvents({
        event: EAnalyticsCommonErrors[EAnalyticsCommonErrors.WARNINGS],
        data: JSON.stringify(args),
      });
      originalWarn.apply(console, args);
    };
  }

  /**
   * sending async and synchronus unhandled exceptions
   * using event listeners
   */
  private static unHandledExceptions() {
    //synchoronous erros
    window.addEventListener("error", this.unhandledSyncRejections);
    //asynchronous errors
    window.addEventListener(
      "unhandledrejection",
      this.unhandledAsyncRejections,
    );
  }

  /**
   * unhandledasynrejection event listener callback
   * @param event
   */
  private static unhandledAsyncRejections(event: PromiseRejectionEvent) {
    this.sendEvents({
      event:
        EAnalyticsCommonErrors[
          EAnalyticsCommonErrors.UNHANDLED_ASYNCHRONOUS_ERRORS
        ],
      data: JSON.stringify(event.reason),
    });
  }

  /**
   * error event callback
   * @param param0
   * @returns
   */
  private static unhandledSyncRejections({
    message,
    filename,
    lineno,
    colno,
    error,
  }: ErrorEvent) {
    this.sendEvents({
      event:
        EAnalyticsCommonErrors[
          EAnalyticsCommonErrors.UNHANDLED_SYNCHRONOUS_ERRORS
        ],
      data: JSON.stringify([message, filename, lineno, colno, error]),
    });
    // Optionally re-throw the error if you want the default behavior to continue
    return false; // Returning true prevents the default handling (optional)
  }

  /**
   * destory the events
   */
  private static destory() {
    const removeEventListeners = () => {
      window.removeEventListener(
        "unhandledrejection",
        this.unhandledAsyncRejections,
      );
      window.removeEventListener("error", this.unhandledSyncRejections);
    };
    window.addEventListener("beforeunload", removeEventListeners);

    // Optionally, use unload for more aggressive cleanup
    window.addEventListener("unload", removeEventListeners);
  }
}

/**
 * common errors like console errors warnings and
 * unhanlded errors
 */
enum EAnalyticsCommonErrors {
  UNHANDLED_SYNCHRONOUS_ERRORS,
  UNHANDLED_ASYNCHRONOUS_ERRORS,
  HANDLED_ERRORS,
  WARNINGS,
}
