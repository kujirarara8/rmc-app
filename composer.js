// 日報・月報をポチポチで作る。入力は端末の中だけに保存し、Discordへはコピーして貼る
(function(){
  var D = window.RMC;
  var DOW=["sun","mon","tue","wed","thu","fri","sat"];
  function h(tag,attrs,kids){
    var e=document.createElement(tag);
    for(var k in (attrs||{})){
      if(k==="class")e.className=attrs[k];
      else if(k.indexOf("on")===0)e.addEventListener(k.slice(2),attrs[k]);
      else if(k==="text")e.textContent=attrs[k];
      else e.setAttribute(k,attrs[k]);
    }
    (kids||[]).forEach(function(c){if(c!=null)e.appendChild(typeof c==="string"?document.createTextNode(c):c);});
    return e;
  }
  function load(key,def){try{var v=localStorage.getItem(key);return v?JSON.parse(v):def;}catch(_){return def;}}
  function save(key,v){try{localStorage.setItem(key,JSON.stringify(v));}catch(_){}}
  function num(v){var n=parseFloat(String(v||"").replace(/[,，¥円]/g,""));return isNaN(n)?null:n;}
  function yen(n){return "¥"+Math.round(n).toLocaleString("ja-JP");}
  function copy(text,done){
    function fb(){var t=document.createElement("textarea");t.value=text;document.body.appendChild(t);t.select();try{document.execCommand("copy");}catch(_){}document.body.removeChild(t);done();}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done,fb);else fb();
  }
  function room(id){return "https://discord.com/channels/"+D.guild+"/"+id;}
  function roomId(label){for(var i=0;i<D.rooms.length;i++)if(D.rooms[i].label===label)return D.rooms[i].id;}

  // ---------- 共通の入力部品 ----------
  function textField(label,get,set,opt){
    opt=opt||{};
    var inp=h(opt.area?"textarea":"input",{type:"text",placeholder:opt.ph||""});
    if(opt.numeric){inp.setAttribute("inputmode","decimal");}
    inp.value=get()||"";
    inp.addEventListener("input",function(){set(inp.value);opt.onchange&&opt.onchange();});
    return h("div",{class:"field"},[h("label",{text:label}),inp]);
  }
  function stepField(label,get,set,onchange){
    var inp=h("input",{type:"text",inputmode:"numeric",placeholder:"0"});
    inp.value=get()==null?"":get();
    inp.addEventListener("input",function(){set(inp.value);onchange&&onchange();});
    return h("div",{class:"field"},[h("label",{text:label}),inp]);
  }
  function chipRow(list,onpick,isOn){
    var row=h("div",{class:"chips"});
    list.forEach(function(t){row.appendChild(h("button",{type:"button",class:"chip"+(isOn&&isOn(t)?" on":""),onclick:function(){onpick(t);},text:t}));});
    return row;
  }
  function outputBox(getText,discordLabel){
    var pre=h("pre",{class:"out"});
    var msg=h("p",{class:"note-s"});
    var wrap=h("div",{},[
      h("p",{class:"flabel",text:"できあがり"}),pre,
      h("button",{type:"button",class:"btn",text:"コピーして"+discordLabel+"を開く",onclick:function(){
        copy(getText(),function(){msg.textContent="コピーしました。Discordの入力欄に貼って送ってください";});
        window.open(room(roomId(discordLabel)),"_blank","noopener");
      }}),
      h("button",{type:"button",class:"btn sub",text:"コピーだけする",onclick:function(){copy(getText(),function(){msg.textContent="コピーしました";});}}),
      msg]);
    wrap.refresh=function(){pre.textContent=getText();};
    wrap.refresh();
    return wrap;
  }

  // ============ 日報 ============
  var NS="rmc-nippo-v1";
  var SLOTS=["朝活","am","pm","夜活"];
  var PRESET=["フィード制作","フィード投稿","リール制作","リール投稿","ストーリーズ投稿","撮影","制作","梱包・発送","広告の確認","授業・教材","添削会に参加","資材調査","事務作業"];
  var nip=load(NS,{name:"",day:"today",slot:"am",today:{},tomorrow:{},notes:"",compass:""});
  function nsave(){save(NS,nip);}
  function dateLabel(offset){
    var d=new Date();d.setDate(d.getDate()+offset);
    return (d.getMonth()+1)+" / "+d.getDate()+" （ "+DOW[d.getDay()]+" ）";
  }
  function nippoText(){
    var out=[];
    if(nip.name&&nip.name.trim())out.push(nip.name.trim(),"");
    var SEP="┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈";
    [["today",0],["tomorrow",1]].forEach(function(p){
      var data=nip[p[0]],blocks=[];
      SLOTS.forEach(function(s){
        var items=data[s]||[];
        if(items.length){blocks.push(s);items.forEach(function(it){blocks.push((it.done?"✔︎":"◻︎")+it.t);});}
      });
      if(blocks.length){out.push(dateLabel(p[1]));out=out.concat(blocks);out.push("");}
    });
    var tail=[];
    if(nip.compass&&String(nip.compass).trim())tail.push("2週間コンパス Day"+String(nip.compass).trim());
    if(nip.notes&&nip.notes.trim())tail.push(nip.notes.trim());
    if(tail.length){out.push(SEP);out=out.concat(tail);}
    return out.join("\n").replace(/\n+$/,"");
  }
  function renderNippo(root){
    root.textContent="";
    var box=h("div",{class:"card"});
    box.appendChild(h("div",{class:"chead"},[h("span",{text:"自己紹介（1行）"})]));
    box.appendChild(textField("お名前・ショップ名など（毎回同じなので端末に残ります）",function(){return nip.name;},function(v){nip.name=v;nsave();refresh();},{ph:"例）〇〇のみさきです"}));
    root.appendChild(box);

    var c2=h("div",{class:"card"});
    c2.appendChild(h("div",{class:"chead"},[h("span",{text:"やること・やったこと"})]));
    var seg=h("div",{class:"seg"});
    [["today","今日"],["tomorrow","明日"]].forEach(function(p){
      seg.appendChild(h("button",{type:"button",class:nip.day===p[0]?"on":"",onclick:function(){nip.day=p[0];nsave();renderNippo(root);},text:p[1]}));
    });
    c2.appendChild(seg);
    var sseg=h("div",{class:"seg"});
    SLOTS.forEach(function(s){sseg.appendChild(h("button",{type:"button",class:nip.slot===s?"on":"",onclick:function(){nip.slot=s;nsave();renderNippo(root);},text:s}));});
    c2.appendChild(h("p",{class:"flabel",text:"いつの分？"}));c2.appendChild(sseg);
    c2.appendChild(h("p",{class:"flabel",text:"タップで追加"}));
    c2.appendChild(chipRow(PRESET,function(t){addItem(t);}));
    var custom=h("input",{type:"text",placeholder:"自分の言葉で追加"});
    var addBtn=h("button",{type:"button",class:"chip on",text:"追加",onclick:function(){if(custom.value.trim()){addItem(custom.value.trim());}}});
    c2.appendChild(h("div",{class:"addrow"},[custom,addBtn]));
    function addItem(t){
      var data=nip[nip.day];(data[nip.slot]=data[nip.slot]||[]).push({t:t,done:nip.day==="today"});
      nsave();renderNippo(root);
    }
    // 追加済みの一覧
    var data=nip[nip.day],any=false;
    SLOTS.forEach(function(s){
      var items=data[s]||[];if(!items.length)return;any=true;
      c2.appendChild(h("p",{class:"slotname",text:s}));
      var ul=h("ul",{class:"items"});
      items.forEach(function(it,i){
        ul.appendChild(h("li",{},[
          h("button",{type:"button",class:"mk"+(it.done?" done":""),"aria-label":it.t+"を"+(it.done?"未完了に":"完了に"),onclick:function(){it.done=!it.done;nsave();renderNippo(root);},text:it.done?"✓":""}),
          h("span",{class:"tx",text:it.t}),
          h("button",{type:"button",class:"rm","aria-label":it.t+"を消す",onclick:function(){items.splice(i,1);nsave();renderNippo(root);},text:"×"})]));
      });
      c2.appendChild(ul);
    });
    if(!any)c2.appendChild(h("p",{class:"note-s",text:"上のボタンを押すと、ここに並びます。○を押すと「やった」になります。"}));
    root.appendChild(c2);

    var c3=h("div",{class:"card"});
    c3.appendChild(h("div",{class:"chead"},[h("span",{text:"ひとこと・気づき"})]));
    var ta=textField("",function(){return nip.notes;},function(v){nip.notes=v;nsave();refresh();},{area:true,ph:"今日の気づき、できなかったこと、ひとこと など"});
    c3.appendChild(ta);
    c3.appendChild(chipRow(["【今日の気づき】","【できなかったこと】","【ひとこと】","今日はここまでやれた！"],function(t){
      nip.notes=(nip.notes?nip.notes+"\n":"")+t+(t.charAt(0)==="【"?"\n":"");nsave();renderNippo(root);}));
    c3.appendChild(stepField("2週間コンパス（参加中の人だけ・Day）",function(){return nip.compass;},function(v){nip.compass=v;nsave();refresh();},refresh));
    root.appendChild(c3);

    var c4=h("div",{class:"card"});
    var ob=outputBox(nippoText,"日報タスク部屋");
    c4.appendChild(ob);root.appendChild(c4);
    function refresh(){ob.refresh();}
    root.appendChild(h("button",{type:"button",class:"btn sub",text:"入力を空にする",onclick:function(){if(confirm("今日の入力を空にします。自己紹介は残ります。")){nip.today={};nip.tomorrow={};nip.notes="";nip.compass="";nsave();renderNippo(root);}}}));
  }

  // ============ 月報 ============
  var GS="rmc-geppo-v1";
  var g=load(GS,{name:"",f:{},good:"",bad:"",improve:"",nextDo:"",last:""});
  function gsave(){save(GS,g);}
  function gv(k){return num(g.f[k]);}
  function monthNum(){var m=(D.report.month||"").match(/(\d+)/);return m?+m[1]:new Date().getMonth()+1;}
  function mark(actual,goal){if(actual==null||goal==null)return "";return actual>=goal?"◯":"×";}
  function geppoText(){
    var M=monthNum(),N=M===12?1:M+1,L=[];
    if(g.name.trim())L.push(g.name.trim(),"");
    L.push(M+"月の振り返り","");
    L.push("▸ "+M+"月の目標・結果");
    var gs=gv("goalSales"),sa=gv("sales"),ps=gv("prevSales");
    if(sa!=null||gs!=null){
      var line="売上："+(gs!=null?yen(gs)+" → ":"")+(sa!=null?yen(sa):"");
      if(sa!=null&&gs){var r=Math.round(sa/gs*1000)/10;line+="（達成率"+r+"%・"+(sa>=gs?"達成":"未達")+"）";}
      L.push(line);
      if(sa!=null&&ps){L.push("前月（"+yen(ps)+"）比："+Math.round(sa/ps*1000)/10+"%");}
    }
    var od=gv("orders"),ap=gv("avgPrice");
    if(ap==null&&sa!=null&&od)ap=sa/od;
    if(od!=null)L.push("注文数："+od+"件"+(ap!=null?"　客単価："+yen(ap):""));
    else if(ap!=null)L.push("客単価："+yen(ap));
    var nb=gv("newBuyers"),rb=gv("repeatBuyers");
    if(nb!=null||rb!=null)L.push("新規"+(nb||0)+"人・リピーター"+(rb||0)+"人");
    [["feed","フィード","本"],["reel","リール","本"],["story","ストーリーズ","件"]].forEach(function(a){
      var ac=gv(a[0]),go=gv(a[0]+"Goal");
      if(ac!=null||go!=null)L.push(a[1]+"："+(ac!=null?ac:"")+a[2]+(go!=null?"（目標"+go+a[2]+" "+mark(ac,go)+"）":""));
    });
    var ig=[["followers","新規フォロワー","人"],["reach","リーチ",""],["views","閲覧数",""],["profile","プロフィールアクセス",""],["linkTaps","リンククリック",""]],igl=[];
    ig.forEach(function(a){var v=gv(a[0]);if(v!=null)igl.push(a[1]+"："+v.toLocaleString("ja-JP")+a[2]);});
    if(igl.length){L.push("","▸ Instagram");L=L.concat(igl);}
    if(gv("ad")!=null){L.push("","▸ 広告");L.push("広告費："+yen(gv("ad")));}
    function block(title,txt){if(txt&&txt.trim()){L.push("","▸ "+title);L.push(txt.trim());}}
    block("できたこと・頑張ったこと",g.good);
    block("できなかったこと・その理由",g.bad);
    block("改善したいこと",g.improve);
    var nl=[];
    [["nextSales","売上",null],["nextFeed","フィード","本"],["nextReel","リール","本"],["nextStory","ストーリーズ","件"],["nextAd","広告費",null]].forEach(function(a){
      var v=gv(a[0]);if(v==null)return;nl.push(a[1]+"："+(a[2]?v+a[2]:yen(v)));
    });
    if(nl.length||(g.nextDo&&g.nextDo.trim())){L.push("","▸ "+N+"月の目標");L=L.concat(nl);if(g.nextDo&&g.nextDo.trim()){L.push("","〖 やること 〗",g.nextDo.trim());}}
    if(g.last&&g.last.trim()){L.push("","【最後に】",g.last.trim());}
    return L.join("\n").replace(/\n+$/,"");
  }
  function renderGeppo(root){
    root.textContent="";
    var M=monthNum(),N=M===12?1:M+1;
    var refresh=function(){ob&&ob.refresh();},ob=null;
    function F(k){return {get:function(){return g.f[k];},set:function(v){g.f[k]=v;gsave();}};}
    function step(label,k){var f=F(k);return stepField(label,f.get,f.set,refresh);}
    function money(label,k){var f=F(k);return textField(label,function(){return g.f[k];},f.set,{numeric:true,ph:"0",onchange:refresh});}

    var c1=h("div",{class:"card"});
    c1.appendChild(h("div",{class:"chead"},[h("span",{text:"自己紹介（1行）"})]));
    c1.appendChild(textField("お名前・ショップ名など",function(){return g.name;},function(v){g.name=v;gsave();refresh();},{ph:"例）〇〇のみさきです"}));
    root.appendChild(c1);

    var c2=h("div",{class:"card"});
    c2.appendChild(h("div",{class:"chead"},[h("span",{text:M+"月の売上"})]));
    c2.appendChild(h("div",{class:"grid2"},[money("目標（円）","goalSales"),money("実績（円）","sales")]));
    c2.appendChild(money("前の月の実績（円・あれば）","prevSales"));
    c2.appendChild(h("div",{class:"grid2"},[step("注文数","orders"),money("客単価（空なら自動）","avgPrice")]));
    c2.appendChild(h("div",{class:"grid2"},[step("新規のお客様","newBuyers"),step("リピーター","repeatBuyers")]));
    root.appendChild(c2);

    var c3=h("div",{class:"card"});
    c3.appendChild(h("div",{class:"chead"},[h("span",{text:"投稿の数（目標と実績）"})]));
    [["フィード","feed"],["リール","reel"],["ストーリーズ","story"]].forEach(function(a){
      c3.appendChild(h("div",{class:"grid2"},[step(a[0]+" 目標",a[1]+"Goal"),step(a[0]+" 実績",a[1])]));
    });
    root.appendChild(c3);

    var c4=h("div",{class:"card"});
    c4.appendChild(h("div",{class:"chead"},[h("span",{text:"Instagram・広告（分かるものだけ）"})]));
    c4.appendChild(h("div",{class:"grid2"},[money("新規フォロワー","followers"),money("リーチ","reach")]));
    c4.appendChild(h("div",{class:"grid2"},[money("閲覧数","views"),money("プロフィールアクセス","profile")]));
    c4.appendChild(h("div",{class:"grid2"},[money("リンククリック","linkTaps"),money("広告費（円）","ad")]));
    root.appendChild(c4);

    function reflect(title,key,chips){
      var c=h("div",{class:"card"});
      c.appendChild(h("div",{class:"chead"},[h("span",{text:title})]));
      c.appendChild(chipRow(chips,function(t){g[key]=(g[key]?g[key]+"\n":"")+t;gsave();renderGeppo(root);}));
      c.appendChild(textField("",function(){return g[key];},function(v){g[key]=v;gsave();refresh();},{area:true,ph:"ボタンで下書き→自分の言葉に直してください"}));
      root.appendChild(c);
    }
    reflect("できたこと・頑張ったこと","good",["目標の売上を達成できた","投稿の本数が目標を超えた","販売会を予定どおり開けた","過去最高の数字が出た","新しいことに挑戦できた","スケジュールどおりに動けた"]);
    reflect("できなかったこと・その理由","bad",["売上が目標に届かなかった。理由は","投稿の本数が足りなかった。理由は","準備の時間が足りなかった","在庫・制作が追いつかなかった","新規のお客様が少なかった","投稿が止まってしまった"]);
    reflect("改善したいこと","improve",["1ヶ月のスケジュールを先に立てる","発信の角度を増やす","広告の出し方を見直す","制作と発信の時間を分ける","振り返りを毎週やる"]);

    var c8=h("div",{class:"card"});
    c8.appendChild(h("div",{class:"chead"},[h("span",{text:N+"月の目標"})]));
    c8.appendChild(h("div",{class:"grid2"},[money("売上（円）","nextSales"),money("広告費（円）","nextAd")]));
    c8.appendChild(h("div",{class:"grid2"},[step("フィード","nextFeed"),step("リール","nextReel")]));
    c8.appendChild(step("ストーリーズ","nextStory"));
    c8.appendChild(chipRow(["販売会を◯回開く","広告用のリールを作る","毎日ストーリーズを出す","1ヶ月シートを作る","新作を出す"],function(t){g.nextDo=(g.nextDo?g.nextDo+"\n":"")+"・"+t;gsave();renderGeppo(root);}));
    c8.appendChild(textField("やること",function(){return g.nextDo;},function(v){g.nextDo=v;gsave();refresh();},{area:true}));
    c8.appendChild(textField("最後にひとこと",function(){return g.last;},function(v){g.last=v;gsave();refresh();},{area:true,ph:"意気込みなど"}));
    root.appendChild(c8);

    var c9=h("div",{class:"card"});
    ob=outputBox(geppoText,"月報報告部屋");c9.appendChild(ob);root.appendChild(c9);
    root.appendChild(h("button",{type:"button",class:"btn sub",text:"入力を空にする",onclick:function(){if(confirm("月報の入力を空にします。自己紹介は残ります。")){var nm=g.name;g={name:nm,f:{},good:"",bad:"",improve:"",nextDo:"",last:""};gsave();renderGeppo(root);}}}));
  }

  window.RMCComposer={renderNippo:renderNippo,renderGeppo:renderGeppo};
})();
