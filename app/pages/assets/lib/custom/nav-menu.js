
(function(){  
  const { remote } = nodeRequire('electron')
  const auth = remote.require('./auth')
  const {ipcRenderer} = nodeRequire('electron');
  ipcRenderer.on('ping', () => {
    ipcRenderer.sendToHost('pong')
  })
  function startIntro(){
    var intro = introJs();
      intro.setOptions({
        steps: [
          { 
            intro: "Welcome to our browser."
          },
          {
            element: '#browser-hint',
            intro: "Browse"
          },
          {
            element: '#alert-earning',
            intro: "See your earnings grow.",
            position: 'right'
          },
        ]
      });

      intro.start();
  }

  async function signout() {
    ipcRenderer.send('signout', true);
    const isSigned = await auth.isAuthenticated();
    if (isSigned)
    {
      await auth.logout();      
      ipcRenderer.send('signout', true);
    }
    var token = await auth.getIdToken();
    var user= await auth.getUser();
    console.log(islogin, token, user);
  }

  $(document).ready(function() {
    $(".circle-nav-menu").html(
      `<div class="dropdown nav-menu">
        <button type="button" class="btn btn-danger btn-circle btn-md  dropdown-toggle"  id="menu1" data-toggle="dropdown"><i class="fa fa-question"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-left" role="menu" aria-labelledby="menu1">
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" id="btn-stepper">Show me how</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Browsing History</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Tutorial</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Chat With Us</a></li>      
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">hello@example.com(mailto link)</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Discord</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Linktree</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Website</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Dark Mode/Light Mode</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Toggle unsplash random background</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);">Your Account(redirects to web application)</a></li>
          <li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" id="btn-signout">Sign Out</a></li>
        </ul>
      </div>
      `
    )
    $("#btn-stepper").click(() => startIntro());
    $("#btn-signout").click(() => signout());
  })
})();