// Discordでログイン：RMCサーバーに入っている人だけ表示する。
// ブラウザの中だけで完結する方式（秘密の鍵は持たない）。
(function(){
  var D=window.RMC, A=D.auth||{}, KEY="rmc-session-v1", DAY=86400000;
  var gate=document.getElementById("gate");
  function show(html){gate.hidden=false;document.body.classList.add("locked");gate.textContent="";gate.appendChild(html);}
  function unlock(sess){
    gate.hidden=true;document.body.classList.remove("locked");
    window.RMCUser=sess||null;
    var g=document.getElementById("hello");
    if(g&&sess&&sess.name){g.textContent="こんにちは、"+sess.name+"さん";}
    document.dispatchEvent(new Event("rmc-auth"));
  }
  function h(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
  function panel(title,msg,btnText,onclick,asLink){
    var w=h("div","gate-box");
    w.appendChild(h("p","brand","REBEL MUSES CRAFT"));
    w.appendChild(h("h1",null,title));
    w.appendChild(h("p","meta-l",msg));
    if(btnText&&asLink){var a=h("a","btn",btnText);a.href=authUrl();w.appendChild(a);}  // リンクにしておくと、スマホでDiscordアプリが入っていればアプリで開ける
    else if(btnText){var b=h("button","btn",btnText);b.type="button";b.addEventListener("click",onclick);w.appendChild(b);}
    return w;
  }
  function redirectUri(){return location.origin+location.pathname;}
  function authUrl(){
    return "https://discord.com/oauth2/authorize?client_id="+encodeURIComponent(A.clientId)+
      "&response_type=token&scope="+encodeURIComponent("identify guilds.members.read")+
      "&redirect_uri="+encodeURIComponent(redirectUri())+"&prompt=none";
  }
  function login(){location.href=authUrl();}
  function loadSess(){try{var s=JSON.parse(localStorage.getItem(KEY)||"null");return s&&s.exp>Date.now()?s:null;}catch(_){return null;}}
  function saveSess(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(_){}}
  function logout(){try{localStorage.removeItem(KEY);}catch(_){} location.href=location.pathname;}
  window.RMCLogout=logout;

  // 開発中（clientIdが空）：ログインなしでそのまま見える
  if(!A.clientId){unlock(null);return;}

  // Discordから戻ってきた直後
  var hash=location.hash.slice(1);
  if(hash.indexOf("access_token=")>=0){
    var p=new URLSearchParams(hash), token=p.get("access_token");
    history.replaceState(null,"",location.pathname+location.search);
    show(panel("確認しています…","RMCのメンバーかどうかを確かめています"));
    fetch("https://discord.com/api/v10/users/@me/guilds/"+D.guild+"/member",{headers:{Authorization:"Bearer "+token}})
      .then(function(r){if(r.status===200)return r.json();throw new Error(String(r.status));})
      .then(function(m){
        var need=A.requiredRoleIds||[];
        var ok=!need.length||need.some(function(id){return (m.roles||[]).indexOf(id)>=0;});
        if(!ok){show(panel("メンバー用のページです","RMCのメンバーとして確認できませんでした。入会・退会に変更があった場合は、公式LINEからお知らせください。","やり直す",login,true));return;}
        var name=m.nick||(m.user&&(m.user.global_name||m.user.username))||"";
        var s={name:name,roles:m.roles||[],exp:Date.now()+(A.recheckDays||3)*DAY};
        saveSess(s);location.replace(location.pathname);
      })
      .catch(function(){show(panel("メンバー用のページです","RMCのDiscordサーバーに入っている人だけが使えます。確認できませんでした。","やり直す",login,true));});
    return;
  }
  var s=loadSess();
  if(s){unlock(s);return;}
  // ホーム画面のアプリとして開いている時：iPhoneでは、Discordの確認から元のアプリに戻れない（保存場所が別になる）ため、ログインなしで表示する
  var standalone=(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches)||window.navigator.standalone===true;
  if(standalone){unlock(null);return;}
  show(panel("RMCアプリ","Discordでログインすると、予定・日報・月報が使えます。RMCのメンバー専用です。","Discordでログイン",login,true));
})();
