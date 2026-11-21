// 毎月ここだけ書き換えれば画面が変わる。表示に使う言葉は「授業」「添削会」「月報会」「作業会」。
window.RMC = {
  month: "2026年11月",
  // 確定：10/18の講師MT。時間が null のものは終日扱い
  events: [
    // zoom: "https://..." を足すと、予定のカードに「Zoomに入る」が出る。zoomRoles: ["役割ID"] を足すと、その役割の人にだけ出る（ログイン設定後）
    { date: "2026-11-22", time: "10:00", title: "全体の添削会", who: "しほ", kind: "添削会" },
    { date: "2026-11-24", time: "22:00", title: "売上別添削会（10〜30万円）", who: "おとよ", kind: "添削会", note: "最後の15分は録画なしのアフタートーク" },
    { date: "2026-11-25", time: "22:00", title: "売上別添削会（30万円以上）", who: "はな", kind: "添削会", note: "最後の15分は録画なしのアフタートーク" },
    { date: "2026-11-26", time: "22:00", title: "月報会（10〜30万円）", who: "おとよ", kind: "月報会" },
    { date: "2026-11-28", time: "13:00", end: "17:00", title: "大阪オフ会", who: "全員", kind: "オフ会", note: "勉強会13:00〜・食事交流15:00〜／リストランテ クロノス" },
    { date: "2026-11-29", time: "22:00", title: "月報会（0〜10万円）", who: "しほ", kind: "月報会" },
    { date: "2026-11-30", time: "22:00", title: "月報会（30万円以上）", who: "はな", kind: "月報会" }
  ],
  countdown: { date: "2026-11-28", title: "大阪オフ会" },
  report: { month: "11月分", start: "2026-11-25", deadline: "2026-12-05" },
  notices: [
    "11/28（土）大阪オフ会｜13:00〜17:00｜リストランテ クロノス（北区堂島）｜参加費0円",
    "12月の授業・添削会は、確定したらここに載せます"
  ],
  // URLが空のものは「準備中」と表示される。URLが決まったらここに入れる
  links: [
    { label: "スタンプカード", url: "https://rmc-stampcard.netlify.app", note: "授業の最後のQRでスタンプがたまる" },
    { label: "動画教材", url: "https://utage-system.com/members/yHt4Gm9Qmskm/login", note: "授業の録画・ノウハウ動画" }
  ],
  // 掲示板（運営が書き換える）
  posts: [
    { tag: "イベント", title: "11/28（土）大阪オフ会", body: "13:00〜15:00 勉強会／15:00〜17:00 食事交流（17:00終了）\n会場：リストランテ クロノス（大阪市北区堂島2-1-31 京阪堂島ビル1階）\n参加費は勉強会・食事交流とも0円です。個別相談（10分）は、当日じゃんけんで決めます。" },
    { tag: "月報", title: "11月分の月報は11/25スタート", body: "締切は12/5です。月報会でその場で書いて出せます。" },
    { tag: "募集", title: "10万円達成した先輩に聞いてみたいこと", body: "1つ上の売上帯の人に聞きたいことを募集しています。" }
  ],
  // 最新のアーカイブ（新しい順）。date＝授業の日、posted＝Discordに出した日。Discordのアーカイブ部屋と同じものを入れる
  archivesRoom: "1400788451900526702",
  archives: [
    { date: "2026-11-19", posted: "2026-11-20", title: "おとよ ストーリーズ添削会", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/3JrVuvRfDNQi/lesson/oVFSaVlbA1Pe" },
    { date: "2026-11-17", posted: "2026-11-17", title: "おとよ授業「AIで仕事を減らす」", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/oD0BVKOUNDfc/lesson/8SLdX8j7IHeE" },
    { date: "2026-11-11", posted: "2026-11-12", title: "はな 添削会", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/3JrVuvRfDNQi/lesson/enfRCVqVpPQp" },
    { date: "2026-11-10", posted: "2026-11-12", title: "ふみや 特別授業【カメラ授業】", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/zwBYntmgUROM/lesson/q8IpFiGATrEc" },
    { date: "2026-11-04", posted: "2026-11-07", title: "はな 全体授業「その場で1ヶ月シートを作る会」", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/3JrVuvRfDNQi/lesson/yQBoADrEcqBM" },
    { date: "2026-11-03", posted: "2026-11-05", title: "しほ 授業「繁忙期の前にこれだけは直して」", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/0IcwNX4Sq9j6/lesson/XE5M9APXZfvN" },
    { date: "2026-10-27", posted: "2026-10-28", title: "jiaiみこ 特別授業「行動できない時に考えてみてほしいこと」", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/zwBYntmgUROM/lesson/ZiEOpup40KIv" },
    { date: "2026-10-15", posted: "2026-10-15", title: "はな 添削会", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/3JrVuvRfDNQi/lesson/JEkZmQGgHAkq" },
    { date: "2026-10-13", posted: "2026-10-14", title: "おとよ 添削会", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/3JrVuvRfDNQi/lesson/Vn6uIqn161BT" },
    { date: "2026-10-12", posted: "2026-10-14", title: "あやの 特別授業", url: "https://utage-system.com/members/yHt4Gm9Qmskm/course/zwBYntmgUROM/lesson/E81owZbz2uSI" }
  ],
  // 作業会・朝夜活のいま（Discordの部屋の様子。人数だけで名前は出さない）
  workNow: {
    asOf: "2026-11-22",
    lines: [
      "朝・夜活の部屋：11/21は4人、11/20は6人が「やります」と宣言しました",
      "いちばん最近の夜の作業会（メタ）：11/18（水）23:00〜 30万円以上の回",
      "次の作業会：決まり次第ここに載せます"
    ]
  },
  roomIds: { work: "1523546883828748369", morning: "1488417247331618816" },
  rooms: [
    { label: "日報タスク部屋", note: "毎日の日報はここ", id: "1400791174687490078" },
    { label: "月報報告部屋", note: "月に1回の振り返り", id: "1408439269042950297" },
    { label: "雑談・質問部屋", note: "気軽にどうぞ", id: "1400790398556831816" },
    { label: "アウトプット部屋", note: "学んだことをアウトプット", id: "1434221478802362460" },
    { label: "朝and夜活部屋", note: "一緒に作業しよう", id: "1488417247331618816" },
    { label: "作業会部屋", note: "作業会の案内", id: "1523546883828748369" }
  ],
  guild: "1400630282964701254",
  // Discordでログイン。clientIdが空のあいだは、ログインなしで表示される（開発中）
  auth: { clientId: "", requiredRoleIds: [], recheckDays: 3 },
  community: [
    { kind: "discord", label: "Discord", url: "https://discord.com/channels/1400630282964701254", note: "質問・雑談・月報の提出はこちら", button: "Discordを開く" },
    { kind: "meta", label: "作業場（メタ作業会）", url: "https://metalife-space.onrender.com/", note: "黙々と作業しても、おしゃべりしながらでもOK。夜23:00から、1回30人まで。日程は決まり次第ここに載せます", button: "メタ空間に入る" }
  ]
};
