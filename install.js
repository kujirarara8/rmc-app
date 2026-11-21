// 「ホーム画面に追加」の案内。アプリとして開いている時は出さない
(function(){
  var box=document.getElementById("install-card"); if(!box) return;
  var KEY="rmc-install-hide";
  function standalone(){return (window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches)||window.navigator.standalone===true;}
  var q=new URLSearchParams(location.search).get("install");  // ?install=ios / android で見た目の確認ができる
  var ua=navigator.userAgent||"";
  var isIOS=q==="ios"||(/iPhone|iPad|iPod/.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1));
  var isAndroid=q==="android"||/Android/.test(ua);
  var inApp=q==="inapp"||/Discord|Line\/|Instagram|FBAN|FBAV|Twitter/i.test(ua);
  if(q==="inapp") isIOS=true;
  if(!q&&(standalone())) return;
  if(!q&&!isIOS&&!isAndroid) return;
  try{var t=+localStorage.getItem(KEY)||0; if(!q&&Date.now()-t<7*86400000) return;}catch(_){}

  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  var NS="http://www.w3.org/2000/svg";
  function svg(d){var s=document.createElementNS(NS,"svg");s.setAttribute("viewBox","0 0 24 24");s.setAttribute("aria-hidden","true");var p=document.createElementNS(NS,"path");p.setAttribute("d",d);s.appendChild(p);return s;}
  var deferred=null;
  window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;if(btn&&isAndroid)btn.textContent="ホーム画面に追加する";});

  var card=el("div","card install");
  var head=el("div","chead"); head.appendChild(el("span",null,"ホーム画面に追加すると、アプリのように使えます"));
  var close=el("button","x","×"); close.type="button"; close.setAttribute("aria-label","閉じる");
  close.addEventListener("click",function(){try{localStorage.setItem(KEY,String(Date.now()));}catch(_){} box.textContent="";});
  head.appendChild(close); card.appendChild(head);
  card.appendChild(el("p","meta-l","タップするだけで開けます。下のリンクの帯も出なくなります。"));
  var btn=el("button","go",isAndroid?"ホーム画面に追加する":"追加の方法を見る"); btn.type="button"; card.appendChild(btn);
  var steps=el("ol","isteps");
  function step(n,text,icon){
    var li=el("li"); li.appendChild(el("b",null,n)); var s=el("span"); s.appendChild(document.createTextNode(text));
    if(icon){var i=el("i","sico"); i.appendChild(svg(icon)); s.appendChild(i);} li.appendChild(s); return li;
  }
  if(inApp&&isIOS){
    steps.appendChild(step("1","いま開いている画面の右上（または下）のメニューから「Safariで開く」を選びます"));
    steps.appendChild(step("2","Safariで開いたら、共有ボタンを押します ","M12 3v12M8 7l4-4 4 4M5 12v8h14v-8"));
  } else if(isIOS){
    steps.appendChild(step("1","画面の下の共有ボタンを押します（見つからない時は「…」の中） ","M12 3v12M8 7l4-4 4 4M5 12v8h14v-8"));
  } else {
    steps.appendChild(step("1","ブラウザ右上の「⋮」を押します"));
  }
  steps.appendChild(step("2","「ホーム画面に追加」を選びます ","M4 4h16v16H4zM12 8v8M8 12h8"));
  steps.appendChild(step("3","右上の「追加」を押します。ホーム画面に緑の「RMC」ができます"));
  steps.appendChild(step("4","これからは、そのアイコンから開いてください"));
  card.appendChild(steps);
  btn.addEventListener("click",function(){
    if(isAndroid&&deferred){deferred.prompt();deferred.userChoice.then(function(){deferred=null;});return;}
    steps.hidden=!steps.hidden; btn.textContent=steps.hidden?(isAndroid?"ホーム画面に追加する":"追加の方法を見る"):"手順をとじる";
  });
  steps.hidden=true;
  box.appendChild(card);
})();
