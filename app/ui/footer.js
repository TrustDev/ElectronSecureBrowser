/* global HTMLElement, CustomEvent, customElements */

const {
  isAuthenticated,
  verifyOtp,
  requestOtp,
  getUser,
  getIdToken,
  getTokenSilently,
  logout
} = require('../auth')

class Footer extends HTMLElement {
  constructor () {
    super()
    this.firstLoad = true
    this.step = 'email';
    this.email = '';
    this.code = '';

    const { remote } = require('electron')

    this.history = remote.require('./history')
    this.lastSearch = 0
    remote.ipcMain.on('signout', (event,enable)=>{
      this.setSignedOut();
      this.step = 'email';
      this.email = '';
      this.code = '';
    });
  }

  connectedCallback () {
    this.setSignedOut();
  }

  show () {
    this.classList.toggle('hidden', false)
    this.dispatchEvent(new CustomEvent('footer-show'))
  }

  hide () {
    this.classList.toggle('hidden', true)
    this.dispatchEvent(new CustomEvent('footer-hide'))
  }

  setSignedOut() {
    this.innerHTML = `
    <div class="footer row">
        <div class="col-sm-9">
            <form class="signin-form form-inline">
                <div class="form-group">
                  <label for="otpw">Sign in start earning</label>
                  <input type="email" class="form-control" name="otpwemail" id="otpw-email" placeholder="yours@example.com">
                  <input type="text" class="form-control" name="otpwcode" id="otpw-code" placeholder="your code">
                  <button type="submit" class="btn btn-default" id="btn-signin">Sign In/Up</button>
                </div>
            </form>
            <div class="text-policy">
                By continuing to use you are agreeing to the Privacy Policy and Terms.
            </div>
        </div>
        <div class="col-sm-3">
            <p id="alert-earning">You are missing out on $1.005 in earnings.</p>
        </div>
    </div>
    `
    this.form = this.$('.signin-form')
    this.signinButton = this.$('#btn-signin')
    this.otpwEmail = this.$('#otpw-email')
    this.otpwCode = this.$("#otpw-code")    
    this.otpwCode.classList.toggle('hidden', true)

    this.form.addEventListener('submit', async (e) => {
      e.preventDefault(true)
      const email = this.otpwEmail.value;
      const code = this.otpwCode.value;
      console.log("Email", email);
      console.log("Code", code);
      if (this.step == "email") {
        this.email = email;
        requestOtp(email).then(res => {
          if (res == true) {
            this.step = "code";
            this.otpwEmail.classList.toggle('hidden', true)
            this.otpwCode.classList.toggle('hidden', false)
          } else {
            console.log("Email Input error");
          }
        })
      } else if (this.step =="code") {
        try {
          await verifyOtp(this.email, code);
          if (await isAuthenticated() == true)
          {
            this.setLeadSignedIn();
            this.step="signed";
          } else {
            console.log("Code Input Error");
          }
        } catch(e) {
          alert("Wrong Code.");
        }
      }
    })

  }

  setLeadSignedIn() {
    this.innerHTML = `
      <div class="footer row">
          <div class="col-sm-5">
              <div>Subscribe now and earn 2X more.</div>
          </div>
          <div class="col-sm-4">
            <p id="alert-earning">You are missing out on $1.005 in earnings.</p>
          </div>
          <div class="col-sm-3">        
            <button type="button" class="btn btn-success" style="width: 100%;">Subscribe now</button>
          </div>
      </div>
    `
  }

  setUserPastDue() {
    this.innerHTML = `
      <div class="footer row">
          <div class="col-sm-5">
              <div>We haven't received this month's payment, you won't earn until you do.</div>
          </div>
          <div class="col-sm-4">
            <p id="alert-earning">You are missing out on $1.005 in earnings.</p>
          </div>
      </div>
    `
  }

  setNetPromoterScore() {
    this.innerHTML = `
      <div class="footer">
        <div class="col-sm-4">
            <div>How likely would you recommend us to your friend?</div>
        </div>
        <div class="col-sm-8 user-score">
          <a href="#" class="round-button">1</a>
          <a href="#" class="round-button">2</a>
          <a href="#" class="round-button">3</a>
          <a href="#" class="round-button">4</a>
          <a href="#" class="round-button">5</a>
          <a href="#" class="round-button">6</a>
          <a href="#" class="round-button">7</a>
          <a href="#" class="round-button">8</a>
          <a href="#" class="round-button">9</a>
          <a href="#" class="round-button">10</a>
        </div>
      </div>
    `
  }

  $ (query) {
    return this.querySelector(query)
  }
}

customElements.define('nav-footer', Footer)
