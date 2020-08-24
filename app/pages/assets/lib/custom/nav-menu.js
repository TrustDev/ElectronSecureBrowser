
(function(){  
  const { remote } = nodeRequire('electron')
  const auth = remote.require('./auth')
  const {ipcRenderer} = nodeRequire('electron');
  ipcRenderer.on('ping', () => {
    ipcRenderer.sendToHost('pong')
  })
  function startIntro(){
    
    if (!window.Tooltip) return;

    var tooltip1 = Tooltip.create(
    document.getElementById('browser-hint'),
      {
        'orientation': 'bottom',
        'text': 'Browse',
        'showOn': 'manual'
      }
    );          
    tooltip1.show();
    var tooltip2 = Tooltip.create(
      document.getElementById('earn-hint'),
      {
        'orientation': 'top',
        'showOn': 'manual',
        'text': 'See your earnings now',
      }
    );
    tooltip2.show();
  }

  async function signout() {
    ipcRenderer.send('signout', true);
    const isSigned = await auth.isAuthenticated();
    if (isSigned)
    {
      await auth.logout();      
      ipcRenderer.send('signout', true);
    }
  }

  $(document).ready(function() {
    $(".circle-nav-menu").html(
      `<div class="dropdown nav-menu">
        <button type="button" class="btn btn-danger btn-circle btn-md  dropdown-toggle"  id="menu1" data-toggle="dropdown"><i class="fa fa-question"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-left" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" id="btn-stepper">Show me how</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Browsing History</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Tutorial</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Chat With Us</a></li>      
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">hello@example.com(mailto link)</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Discord</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Linktree</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Website</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Dark Mode/Light Mode</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Toggle unsplash random background</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;">Your Account(redirects to web application)</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:;" id="btn-signout">Sign Out</a></li>
        </ul>
      </div>
      `
    )
    $("#btn-stepper").click(() => startIntro());
    $("#btn-signout").click(() => signout());
  })
})();