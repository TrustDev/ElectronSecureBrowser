/* global HTMLElement, ResizeObserver, CustomEvent, customElements */

class BrowserViewElement extends HTMLElement {
  static EVENTS () {
    return [
      'did-finish-load',
      'did-fail-load',
      'did-fail-provisional-load',
      'did-frame-finish-load',
      'did-start-loading',
      'did-stop-loading',
      'dom-ready',
      'page-title-updated',
      'page-favicon-updated',
      'new-window',
      'will-navigate',
      'did-start-navigation',
      'will-redirect',
      'did-redirect-navigation',
      'did-navigate',
      'did-frame-navigate',
      'did-navigate-in-page',
      'will-prevent-unload',
      'crashed',
      'unresponsive',
      'responsive',
      'plugin-crashed',
      'destroyed',
      'before-input-event',
      'enter-html-full-screen',
      'leave-html-full-screen',
      'zoom-changed',
      'devtools-opened',
      'devtools-closed',
      'devtools-focused',
      'certificate-error',
      'select-client-certificate',
      'login',
      'found-in-page',
      'media-started-playing',
      'media-paused',
      'did-change-theme-color',
      'update-target-url',
      'cursor-changed',
      'context-menu',
      'select-bluetooth-device',
      'devtools-reload-page',
      'will-attach-webview',
      'did-attach-webview',
      'console-message',
      'preload-error'
    ]
  }

  static METHODS () {
    return [
      'loadURL',
      'loadFile',
      'downloadURL',
      'getURL',
      'getTitle',
      'isDestroyed',
      'focus',
      'isFocused',
      'isLoading',
      'isLoadingMainFrame',
      'isWaitingForResponse',
      'stop',
      'reload',
      'reloadIgnoringCache',
      'canGoBack',
      'canGoForward',
      'canGoToOffset',
      'clearHistory',
      'goBack',
      'goForward',
      'goToIndex',
      'goToOffset',
      'isCrashed',
      'setUserAgent',
      'getUserAgent',
      'insertCSS',
      'removeInsertedCSS',
      'executeJavaScript',
      'executeJavaScriptInIsolatedWorld',
      'setIgnoreMenuShortcuts',
      'setAudioMuted',
      'isAudioMuted',
      'isCurrentlyAudible',
      'setZoomFactor',
      'getZoomFactor',
      'setZoomLevel',
      'getZoomLevel',
      'setVisualZoomLevelLimits',
      'undo',
      'redo',
      'cut',
      'copy',
      'copyImageAt',
      'paste',
      'pasteAndMatchStyle',
      'delete',
      'selectAll',
      'unselect',
      'replace',
      'replaceMisspelling',
      'insertText',
      'findInPage',
      'stopFindInPage',
      'capturePage',
      'isBeingCaptured',
      'incrementCapturerCount',
      'decrementCapturerCount',
      'getPrinters',
      'print',
      'printToPDF',
      'addWorkSpace',
      'removeWorkSpace',
      'setDevToolsWebContents',
      'openDevTools',
      'closeDevTools',
      'isDevToolsOpened',
      'isDevToolsFocused',
      'toggleDevTools',
      'inspectElement',
      'inspectSharedWorker',
      'inspectSharedWorkerById',
      'getAllSharedWorkers',
      'inspectServiceWorker',
      'send',
      'sendToFrame',
      'enableDeviceEmulation',
      'disableDeviceEmulation',
      'sendInputEvent',
      'beginFrameSubscription',
      'endFrameSubscription',
      'startDrag',
      'savePage',
      'showDefinitionForSelection',
      'isOffscreen',
      'startPainting',
      'stopPainting',
      'isPainting',
      'setFrameRate',
      'getFrameRate',
      'invalidate',
      'getWebRTCIPHandlingPolicy',
      'setWebRTCIPHandlingPolicy',
      'getOSProcessId',
      'getProcessId',
      'takeHeapSnapshot',
      'setBackgroundThrottling',
      'getType'
    ]
  }

  constructor () {
    super()

    this.view = null
    this.views = {};

    this.observer = new ResizeObserver(() => this.resizeView())

    for (const name of BrowserViewElement.METHODS()) {
      this[name] = (...args) => this.view.webContents[name](...args)
    }

    this.addEventListener('focus', () => {
      if (this.view) this.view.webContents.focus()
    })

    window.addEventListener('beforeunload', () => {
      if (this.view) this.view.destroy()
    })
    
    const { remote } = require('electron')
    remote.ipcMain.on('newtab', (event, msg) => {
      const src = this.getAttribute('src')
      this.addNewView(src, msg.tabId);
    })
    remote.ipcMain.on('switchtab', (event, msg) => {
      this.switchView(msg.tabId);
    })
    remote.ipcMain.on('closetab', (event, msg) => {
      this.closeView(msg.tabId);
    })
  }

  connectedCallback () {
    this.observer.observe(this)

    //const src = this.getAttribute('src')
    //this.addNewView(src);
  }

  closeView (id) {
    delete this.views[id];
  }

  switchView (id) {
    const {ipcRenderer} = window.nodeRequire != undefined ? nodeRequire('electron').ipcRenderer : require('electron').ipcRenderer;
    const remote = window.nodeRequire != undefined ? nodeRequire('electron').remote : require('electron').remote
    const currentWindow = remote.getCurrentWindow()
    if (id == -1) {
      this.view = null;
    }
    else
      this.view = this.views[id];
    currentWindow.setBrowserView(this.view);    
    this.dispatchEvent(new CustomEvent('switchView'))
  }

  addNewView (newSrc, tabId) {    

    const remote = window.nodeRequire != undefined ? nodeRequire('electron').remote : require('electron').remote
    const { pageContextMenu } = window.nodeRequire != undefined ? nodeRequire('./context-menus'): require('./context-menus')
    const currentWindow = remote.getCurrentWindow()
    const { BrowserView } = remote
    this.view = new BrowserView({
      webPreferences: {
        nodeIntegration: true,
        sandbox: false,
        safeDialogs: true,
        navigateOnDragDrop: true,
        enableRemoteModule: true,
        partition: this.getAttribute('partition')
      }
    })
    currentWindow.addBrowserView(this.view) 
    this.view.webContents.on('context-menu', pageContextMenu.bind(this.view))

    this.views[tabId] = this.view;

    this.resizeView()

    for (const event of BrowserViewElement.EVENTS()) {
      this.view.webContents.on(event, (...detail) => {
        this.dispatchEvent(new CustomEvent(event, { detail }))
      })
    }

    if (newSrc) this.loadURL(newSrc)
  }

  disconnectedCallback () {
    this.observer.unobserve(this)
    this.view.destroy()
    this.view = null
  }

  static get observedAttributes () {
    return ['src']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!this.view) return
    this.loadURL(newValue)
  }

  resizeView () {
    if (!this.view) return

    const { x, y, width, height } = this.getBoundingClientRect()

    const rect = {
      x: Math.trunc(x),
      y: Math.trunc(y),
      width: Math.trunc(width),
      height: Math.trunc(height)
    }
    for (const id in this.views) {
      const childView = this.views[id];
      childView.setBounds(rect)
    }
  }

  get src () { return this.getAttribute('src') }
  set src (url) { this.setAttribute('src', url) }

  get audioMuted () { return this.view.webContents.audioMuted }
  set audioMuted (audioMuted) { this.view.webContents.audioMuted = audioMuted }

  get userAgent () { return this.view.webContents.userAgent }
  set userAgent (userAgent) { this.view.webContents.userAgent = userAgent }

  get zoomLevel () { return this.view.webContents.zoomLevel }
  set zoomLevel (zoomLevel) { this.view.webContents.zoomLevel = zoomLevel }

  get zoomFactor () { return this.view.webContents.zoomFactor }
  set zoomFactor (zoomFactor) { this.view.webContents.zoomFactor = zoomFactor }

  get frameRate () { return this.view.webContents.frameRate }
  set frameRate (frameRate) { this.view.webContents.frameRate = frameRate }

  get id () { return this.view.webContents.id }

  get session () { return this.view.webContents.session }

  get hostWebContents () { return this.view.webContents.hostWebContents }

  get devToolsWebContents () { return this.view.webContents.devToolsWebContents }

  get debugger () { return this.view.webContents.debugger }
}

customElements.define('browser-view', BrowserViewElement)
