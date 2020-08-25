
(function(){  
    const { remote } = nodeRequire('electron')
    const auth = remote.require('./auth')
    const {ipcRenderer} = nodeRequire('electron');
    ipcRenderer.on('signin', () => {
        showSignedInAlert();
    })
    function showSignedInAlert() {
        var alertTag = `
        <div class="signin-alert">
          <div class="alert alert-success alert-dismissible">
            <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            <div>Thank you for joining. You can now earn money. <br>
               Your personal invite link: <strong>lagatos.com/daio839q3743q87</strong></div>
            <div>Complete these steps, at app.lagatos.com</div>
            - Create your digital wallet<br>
            - Create your username<br>
            - Opt in to WhatsApps messages<br>
            - Opt in to SMS
          </div>
        </div>`;
        $(alertTag).insertAfter($("#earn-hint"));
    }
    $(document).ready(function() {
    })
  })();