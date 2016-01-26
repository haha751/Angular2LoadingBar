/**
 * Created by valentin.gushan on 26.01.2016.
 */
import {ConnectionBackend, Connection, Request, Response, ReadyState, XHRConnection, BrowserXhr, ResponseOptions, XHRBackend} from 'angular2/http';
import {Injectable, provide, Provider, Component} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'loading-bar',
    template: `<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>`,
    styles: [`/* Make clicks pass-through */
#loading-bar,
#loading-bar-spinner {
  pointer-events: none;
  -webkit-pointer-events: none;
  -webkit-transition: 350ms linear all;
  -moz-transition: 350ms linear all;
  -o-transition: 350ms linear all;
  transition: 350ms linear all;
}

#loading-bar.ng-enter,
#loading-bar.ng-leave.ng-leave-active,
#loading-bar-spinner.ng-enter,
#loading-bar-spinner.ng-leave.ng-leave-active {
  opacity: 0;
}

#loading-bar.ng-enter.ng-enter-active,
#loading-bar.ng-leave,
#loading-bar-spinner.ng-enter.ng-enter-active,
#loading-bar-spinner.ng-leave {
  opacity: 1;
}

#loading-bar .bar {
  -webkit-transition: width 350ms;
  -moz-transition: width 350ms;
  -o-transition: width 350ms;
  transition: width 350ms;

  background: #29d;
  position: fixed;
  z-index: 10002;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  border-bottom-right-radius: 1px;
  border-top-right-radius: 1px;
}

/* Fancy blur effect */
#loading-bar .peg {
  position: absolute;
  width: 70px;
  right: 0;
  top: 0;
  height: 2px;
  opacity: .45;
  -moz-box-shadow: #29d 1px 0 6px 1px;
  -ms-box-shadow: #29d 1px 0 6px 1px;
  -webkit-box-shadow: #29d 1px 0 6px 1px;
  box-shadow: #29d 1px 0 6px 1px;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  border-radius: 100%;
}

#loading-bar-spinner {
  display: block;
  position: fixed;
  z-index: 10002;
  top: 10px;
  left: 10px;
}

#loading-bar-spinner .spinner-icon {
  width: 14px;
  height: 14px;

  border:  solid 2px transparent;
  border-top-color:  #29d;
  border-left-color: #29d;
  border-radius: 50%;

  -webkit-animation: loading-bar-spinner 400ms linear infinite;
  -moz-animation:    loading-bar-spinner 400ms linear infinite;
  -ms-animation:     loading-bar-spinner 400ms linear infinite;
  -o-animation:      loading-bar-spinner 400ms linear infinite;
  animation:         loading-bar-spinner 400ms linear infinite;
}

@-webkit-keyframes loading-bar-spinner {
  0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
}
@-moz-keyframes loading-bar-spinner {
  0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
}
@-o-keyframes loading-bar-spinner {
  0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
}
@-ms-keyframes loading-bar-spinner {
  0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
}
@keyframes loading-bar-spinner {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`]
})
export class LoadingBar {
    public static get provider(): Provider {
        LoadingBarConnection.pending.subscribe((progressStart) => {
            console.log('progressStar: ', progressStart)
        });

        return provide(XHRBackend, { useClass: LoadingBarBackend });
    }
}

@Injectable()
export class LoadingBarBackend implements ConnectionBackend {
    constructor(private _browserXHR: BrowserXhr, private _baseResponseOptions: ResponseOptions) { }
    public createConnection(request: Request): LoadingBarConnection {
        return new LoadingBarConnection(request, this._browserXHR, this._baseResponseOptions);
    }
}

export class LoadingBarConnection implements Connection {
    private baseConnection: XHRConnection;
    private static _pendingRequests: number = 0;
    private static _observer: Observable<Response>;
    public static pending: Observable<boolean> = new Observable(observer => LoadingBarConnection._observer = observer);

    constructor(req: Request, browserXHR: BrowserXhr, baseResponseOptions?: ResponseOptions) {
        this.baseConnection = new XHRConnection(req, browserXHR, baseResponseOptions);
        LoadingBarConnection.requestStarted();
        this.response.subscribe(() => {
            LoadingBarConnection.requestEnded();
        });
    }

    private static requestStarted() {
        if (LoadingBarConnection._pendingRequests == 0) {
            LoadingBarConnection._observer.next(true);
        }
        LoadingBarConnection._pendingRequests++;
    }

    private static requestEnded() {
        if (LoadingBarConnection._pendingRequests == 1) {
            LoadingBarConnection._observer.next(false);
        }
        LoadingBarConnection._pendingRequests--;
    }

    get readyState(): ReadyState {
        return this.baseConnection.readyState;
    }
    get request(): Request {
        return this.baseConnection.request;
    }
    get response(): Observable<Response> {
        return this.baseConnection.response;
    }
}