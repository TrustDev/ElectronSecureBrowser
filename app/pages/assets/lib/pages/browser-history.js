
(function(){  
    const {ipcRenderer} = nodeRequire('electron')

    function isInDate(arg, base) {
        let startDate = new Date(Date.UTC(base.getFullYear(), base.getUTCMonth(), base.getUTCDate()));        
        let endDate = new Date(Date.UTC(base.getFullYear(), base.getUTCMonth(), base.getUTCDate() + 1));
        //console.log(startDate, base,  endDate);
        if (arg >= startDate && arg < endDate)
            return true;
        return false;
    }
    function formatDate(date,displaytime) {
        date=(date===undefined)?"":date;
        displaytime=(displaytime===undefined)?false:displaytime;
      if (date == '' || date == null){
            date = new Date();
        } else {
            date = new Date(date);	
        }
      if (isInDate(date, new Date(Date.now())))
        return "Today";
        
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
      var weekNames = [
          "Sunday", "Moneday", "Tuesday",
          "Wednesday", "Thursday", "Friday",
          "Saturday"
      ];
    
      var dd = date.getDate().toString();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDay();
      
      var hh = date.getHours().toString();
      var mm = date.getMinutes().toString();
      var ss = date.getSeconds().toString();
      
      var ddChars = dd.split('');
      var hhChars = hh.split('');
      var mmChars = mm.split('');
      var ssChars = ss.split('');
      if (displaytime==false){
        return weekNames[day] + ", " + monthNames[monthIndex] + ' ' + (ddChars[1]?dd:"0"+ddChars[0]) + ', ' + year;		
      }
      return monthNames[monthIndex] + ' ' + (ddChars[1]?dd:"0"+ ddChars[0]) + ', ' + year+ ' '+(hhChars[1]?hh:"0"+hhChars[0])+':'+(mmChars[1]?mm:"0"+mmChars[0])+':'+(ssChars[1]?ss:"0"+ssChars[0]);
    }

    console.log(formatDate(new Date()));
    function showHistoryPage (data) {
        let i;
        let history = data.history;
        let favicons = data.favicons;
        let groupDate =  null; //new Date(Date.now());
        let strPage = ''
        for( i = 0; i < history.length; i ++) {
            let item = history[i];
            let url = item.url.replace(/\/$/, '');
            let iconUrl = favicons[url] ? favicons[url] : 'https://app.lagatos.com/favicon.ico';
            let timestamp = new Date(item.timestamp);
            if (groupDate == null || !isInDate(timestamp, groupDate))
            {
                if (strPage)
                    strPage += '</ul>';
                strPage += `<h5>${formatDate(timestamp)}</h5>`;
                strPage += '<ul class="list-group">';
                groupDate = timestamp;
            }
            strPage += `<li class="list-group-item"><img src="${iconUrl}"/><Label>${item.title}</Label>${item.host || item.pathname.replace(/^\/\//, "")}</li>`;
        }
        strPage += '</ul>';
        $(".history-page").append(strPage);
    }
    $(document).ready(() => {
        ipcRenderer.send('getbrowserhistory',true);
        ipcRenderer.on('browserhistory', (event, data) => {
            showHistoryPage(data);
        })
    })
  })();