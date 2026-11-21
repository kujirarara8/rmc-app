(function(){
  var D=window.RMC, DOW=["日","月","火","水","木","金","土"];
  function ymd(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
  var now=new Date(), today=ymd(now);
  function parse(e){var p=e.date.split("-"),h=e.time?e.time.split(":"):[23,59];return new Date(+p[0],p[1]-1,+p[2],+h[0],+h[1]);}
  function endOf(e){var s=parse(e);if(e.end){var q=e.end.split(":");return new Date(s.getFullYear(),s.getMonth(),s.getDate(),+q[0],+q[1]);}return e.time?new Date(s.getTime()+90*60000):s;}
  function label(date){var p=date.split("-"),d=new Date(+p[0],p[1]-1,+p[2]);return {md:(+p[1])+"/"+(+p[2]),w:DOW[d.getDay()]};}
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  function link(cls,text,url){var a=el("a",cls,text);a.href=url;a.target="_blank";a.rel="noopener";return a;}
  function roomUrl(id){return "https://discord.com/channels/"+D.guild+"/"+id;}

  // Zoom：zoomが入っている予定にだけ出す。zoomRolesがあれば、その役割の人だけ
  function zoomFor(e){
    if(!e.zoom) return null;
    if(e.zoomRoles&&e.zoomRoles.length){
      var roles=(window.RMCUser&&window.RMCUser.roles)||[];
      if(!e.zoomRoles.some(function(r){return roles.indexOf(r)>=0;})) return null;
    }
    return e.zoom;
  }
  var events=D.events.slice().sort(function(a,b){return parse(a)-parse(b);});

  // 次の予定
  var nc=document.getElementById("next-card"), next=events.filter(function(e){return endOf(e)>=now;})[0];
  nc.appendChild(el("p","lab","次の予定"));
  if(next){
    var l=label(next.date);
    nc.appendChild(el("p","tt",next.title));
    nc.appendChild(el("p","dt",l.md+"（"+l.w+"）"+(next.time?" "+next.time+(next.end?"〜"+next.end:""):"")+"　担当："+next.who));
    if(next.note) nc.appendChild(el("p","nt",next.note));
    var z=zoomFor(next);
    nc.appendChild(z?link("zoom","Zoomで参加する",z):el("span","zoom off","Zoomのリンクは、各部屋の案内で"));
  } else {
    nc.appendChild(el("p","tt","いまの予定はすべて終わりました"));
    nc.appendChild(el("p","nt","次の月の予定が決まったら載せます"));
  }

  // 最新のアーカイブ
  function md(date){var p=date.split("-");return (+p[1])+"/"+(+p[2]);}
  function isNew(a){return (now-new Date(a.posted+"T00:00:00"))/86400000<=7;}
  function archiveRow(a){
    var li=el("li"), k=link("",""  ,a.url);
    var d=el("span","hash",md(a.date)); d.style.fontSize="12px"; k.appendChild(d);
    var box=el("span"); var b=el("b",null,a.title); box.appendChild(b);
    if(isNew(a)) box.appendChild(el("small",null,"新着　"+md(a.posted)+"に届きました")); else box.appendChild(el("small",null,"録画を見る"));
    k.appendChild(box); li.appendChild(k); return li;
  }
  var ac=document.getElementById("archive-card"), ah=el("div","chead"); ah.appendChild(el("span",null,"最新のアーカイブ"));
  var seeAll=el("a","when","すべて ›"); seeAll.href="#board"; seeAll.addEventListener("click",function(e){e.preventDefault();go("board");}); ah.appendChild(seeAll);
  ac.appendChild(ah);
  var aul=el("ul","rows"); D.archives.slice(0,3).forEach(function(a){aul.appendChild(archiveRow(a));}); ac.appendChild(aul);
  var aall=document.getElementById("archive-all"); D.archives.forEach(function(a){aall.appendChild(archiveRow(a));});
  var more=el("li"); more.appendChild(link("","Discordのアーカイブ部屋を開く",roomUrl(D.archivesRoom))); aall.appendChild(more);

  // 作業会・朝夜活のいま
  var wc=document.getElementById("worknow-card"), wh=el("div","chead"); wh.appendChild(el("span",null,"作業会のいま")); wh.appendChild(el("span","when",md(D.workNow.asOf)+"時点")); wc.appendChild(wh);
  D.workNow.lines.forEach(function(t){wc.appendChild(el("p","meta-l",t));});
  var wr=el("div","chips"); 
  var w1=link("chip","メタ空間に入る",D.community[1].url||"#"); var w2=link("chip","朝・夜活の部屋",roomUrl(D.roomIds.morning)); var w3=link("chip","作業会の部屋",roomUrl(D.roomIds.work));
  [w1,w2,w3].forEach(function(x){x.style.textDecoration="none";wr.appendChild(x);}); wc.appendChild(wr);

  // 4つのボタン（日報・月報・予定・メタ・動画教材・Discord）
  var tiles=document.getElementById("tiles");
  function tile(text,onclick,main){var b=el("button","tile"+(main?" main":""),text);b.type="button";b.addEventListener("click",onclick);tiles.appendChild(b);}
  function tileLink(text,url){if(url)tiles.appendChild(link("tile",text,url));else tiles.appendChild(el("span","tile off",text+"（準備中）"));}
  tiles.appendChild(link("tile main","日報を書く",roomUrl(D.rooms[0].id)));
  tile("月報を出す",function(){go("geppo");},true);
  tile("今月のスケジュール",function(){go("schedule");});
  tile("メタ作業会に入る",function(){go("meta");});
  var vid=D.links.filter(function(x){return x.label==="動画教材";})[0];
  tileLink("動画教材を探す",vid&&vid.url);
  tileLink("Discordを開く",D.community[0]&&D.community[0].url);

  // お知らせ
  var nu=document.getElementById("notices"); D.notices.forEach(function(t){nu.appendChild(el("li",null,t));});

  // チャット（Discordの部屋）
  var rl=document.getElementById("rooms");
  function drawRooms(q){
    rl.textContent="";
    D.rooms.filter(function(r){return !q||r.label.indexOf(q)>=0||r.note.indexOf(q)>=0;}).forEach(function(r){
      var li=el("li"), a=link("","",roomUrl(r.id));
      a.appendChild(el("span","hash","#"));
      var box=el("span"); box.appendChild(el("b",null,r.label)); box.appendChild(el("small",null,r.note)); a.appendChild(box);
      li.appendChild(a); rl.appendChild(li);
    });
  }
  drawRooms("");
  document.getElementById("room-q").addEventListener("input",function(e){drawRooms(e.target.value.trim());});

  // 掲示板
  var pb=document.getElementById("posts");
  D.posts.forEach(function(p){var a=el("article","post");a.appendChild(el("span","tag",p.tag));a.appendChild(el("h3",null,p.title));a.appendChild(el("p",null,p.body));pb.appendChild(a);});

  // 予定
  document.getElementById("month-title").textContent=D.month+"の授業・添削会・月報会";
  var ev=document.getElementById("events");
  events.forEach(function(e){
    var l=label(e.date), li=el("li", endOf(e)<now?"past":(e.date===today?"today":""));
    var d=el("div","d",l.md); d.appendChild(el("span",null,l.w+"曜日"+(e.time?"　"+e.time+(e.end?"〜"+e.end:""):"")));
    var b=el("div"); b.appendChild(el("div","t",e.title)); b.appendChild(el("div","s","担当："+e.who+(e.note?"　"+e.note:"")));
    li.appendChild(d); li.appendChild(b);
    var z=zoomFor(e); if(z) li.appendChild(link("zl","Zoom",z));
    ev.appendChild(li);
  });

  // メタ空間
  var mc=document.getElementById("meta-card"), m=D.community[1], card=el("div","card");
  var mh=el("div","chead"); mh.appendChild(el("span",null,"売上別メタ作業会")); card.appendChild(mh);
  card.appendChild(el("p","meta-l",m.note));
  card.appendChild(m.url?link("go",m.button,m.url):el("div","go off","準備中"));
  mc.appendChild(card);

  // 画面の切り替え
  var titles={home:"ホーム",chat:"チャット",board:"掲示板",schedule:"スケジュール",meta:"メタ空間",geppo:"月報を出す"};
  var TABS=["home","chat","board","schedule","meta"], ALL=TABS.concat(["geppo"]), from="home";
  function go(id){
    ALL.forEach(function(k){document.getElementById(k).hidden=(k!==id);});
    var tabId=TABS.indexOf(id)>=0?id:from;
    document.querySelectorAll(".tabs button").forEach(function(b){b.classList.toggle("on",b.dataset.go===tabId);});
    document.getElementById("screen-title").textContent=titles[id];
    if(TABS.indexOf(id)>=0) from=id;
    if(id==="geppo") window.RMCComposer.renderGeppo(document.getElementById("geppo-root"));
    window.scrollTo(0,0);
    try{history.replaceState(null,"","#"+id);}catch(_){}
  }
  document.querySelectorAll("[data-go]").forEach(function(b){b.addEventListener("click",function(){go(b.dataset.go);});});
  document.querySelectorAll("[data-back]").forEach(function(b){b.addEventListener("click",function(){go(from);});});
  var h=(location.hash||"").slice(1); if(titles[h]) go(h);
})();
