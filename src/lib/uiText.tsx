/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react"

import type { Locale } from "@/lib/balatroLocale"

export type UIText = {
  profile: string
  language: string
  importProfile: string
  exportImage: string
  exporting: string

  balatroCareer: string
  wins: string
  losses: string
  winRate: string
  save: string
  deck: string
  stake: string
  bestHand: string
  mostMoney: string

  collection: string
  deckStakes: string
  jokerStickers: string
  challenges: string
  noData: string
  complete: string
  discovered: string
  stakesToGo: string
  stickersLeft: string
  challengesToGo: string

  deckCollection: string
  deckCollectionSub: string
  sortGameOrder: string
  sortMostPlayed: string
  sortMostWins: string
  sortHighestWinRate: string
  sortHighestStake: string
  attempts: string
  best: string
  none: string
  stakeBreakdown: string
  vsFleet: string
  cmpStake: string
  cmpWinRateVs: string
  cmpAttemptsVs: string
  cmpAvg: string

  deckUsage: string
  deckUsageSub: string
  handProfile: string
  mostPlayed: string
  rarestPlayed: string
  totalHands: string
  handsSentence3: string
  handsSentence2: string
  handsSentence1: string
  handsSentenceNone: string

  jokerHall: string
  jokerHallSub: string
  sortMostUsed: string
  sortMostObservedWins: string
  sortHighestObservedWinRate: string
  sortOriginalOrder: string
  usesTemplate: string
  observedWinRate: string
  lowSample: string
  showTop12: string
  showAll: string

  economyTitle: string
  economySub: string
  dollarsEarned: string
  shopDollarsSpent: string
  netRetained: string
  shopRerolls: string
  jokersSold: string
  cardsSold: string
  vouchersBought: string
  tarotBought: string
  planetBought: string
  cardsPlayed: string
  cardsDiscarded: string
  rerollsPerRound: string
  discardRate: string
  cardsPerHand: string

  consumablesTitle: string
  consumablesSub: string
  vouchersTitle: string
  vouchersSub: string

  importTitlePre: string
  importNote: string
  dropCta: string
  dropHint: string

  errInvalidJson: string
  errNotProfile: string
  errRead: string
  errExport: string
}

const en: UIText = {
  profile: "Profile",
  language: "Language",
  importProfile: "Import Profile",
  exportImage: "Export Image",
  exporting: "Exporting…",

  balatroCareer: "Balatro Career",
  wins: "Wins",
  losses: "Losses",
  winRate: "Win Rate",
  save: "Save",
  deck: "Deck",
  stake: "Stake",
  bestHand: "Best Hand",
  mostMoney: "Most Money",

  collection: "Collection",
  deckStakes: "Deck Stakes",
  jokerStickers: "Joker Stickers",
  challenges: "Challenges",
  noData: "No data",
  complete: "Complete",
  discovered: "{v} discovered",
  stakesToGo: "{n} stakes to go",
  stickersLeft: "{n} stickers left",
  challengesToGo: "{n} challenges to go",

  deckCollection: "Deck Collection",
  deckCollectionSub: "{n} decks · attempts and wins computed from per-stake records.",
  sortGameOrder: "Game order",
  sortMostPlayed: "Most played",
  sortMostWins: "Most wins",
  sortHighestWinRate: "Highest win rate",
  sortHighestStake: "Highest stake",
  attempts: "Attempts",
  best: "Best",
  none: "None",
  stakeBreakdown: "Stake Breakdown",
  vsFleet: "Vs. Fleet Average",
  cmpStake: "Highest cleared stake",
  cmpWinRateVs: "Win rate vs fleet",
  cmpAttemptsVs: "Attempts vs fleet",
  cmpAvg: "avg {v}",

  deckUsage: "Deck Usage",
  deckUsageSub: "Ranked by total attempts across all stakes.",
  handProfile: "Hand Profile",
  mostPlayed: "Most Played",
  rarestPlayed: "Rarest Played",
  totalHands: "Total Hands",
  handsSentence3: "{name} most frequently plays {a}, followed by {b} and {c}.",
  handsSentence2: "{name} most frequently plays {a}, followed by {b}.",
  handsSentence1: "{name} most frequently plays {a}.",
  handsSentenceNone: "{name} has not recorded any poker hands yet.",

  jokerHall: "Joker Hall of Fame",
  jokerHallSub:
    "Usage count is how often a Joker appeared, not the number of distinct runs. Observed wins/losses are from per-stake records.",
  sortMostUsed: "Most used",
  sortMostObservedWins: "Most observed wins",
  sortHighestObservedWinRate: "Highest observed win rate",
  sortOriginalOrder: "Original order",
  usesTemplate: "{n} uses",
  observedWinRate: "observed win rate",
  lowSample: "Low sample",
  showTop12: "Show top 12",
  showAll: "Show all {n} jokers",

  economyTitle: "Economy & Playstyle",
  economySub: "Career scoreboard and neutral playstyle signals.",
  dollarsEarned: "Dollars Earned",
  shopDollarsSpent: "Shop Dollars Spent",
  netRetained: "Net Retained",
  shopRerolls: "Shop Rerolls",
  jokersSold: "Jokers Sold",
  cardsSold: "Cards Sold",
  vouchersBought: "Vouchers Bought",
  tarotBought: "Tarot Cards Bought",
  planetBought: "Planet Cards Bought",
  cardsPlayed: "Cards Played",
  cardsDiscarded: "Cards Discarded",
  rerollsPerRound: "rerolls / round",
  discardRate: "discard rate",
  cardsPerHand: "cards / hand",

  consumablesTitle: "Most Used Consumables",
  consumablesSub: "Top 10 by usage count.",
  vouchersTitle: "Most Purchased Vouchers",
  vouchersSub: "Top 10 by purchase count.",

  importTitlePre: "Drop your",
  importNote: "Your save is parsed locally. Nothing is uploaded.",
  dropCta: "Drag & drop, or click to choose",
  dropHint: "profile.jkr or profile.json",

  errInvalidJson:
    "That file is not valid JSON. Export your save as profile.json or upload profile.jkr.",
  errNotProfile:
    "This file does not look like a Balatro profile (missing career_stats / deck_usage).",
  errRead: "This file could not be read as a Balatro profile.",
  errExport: "Image export failed. Please try again.",
}

const zhCN: UIText = {
  profile: "存档",
  language: "语言",
  importProfile: "导入存档",
  exportImage: "导出图片",
  exporting: "导出中…",

  balatroCareer: "小丑牌生涯",
  wins: "胜场",
  losses: "负场",
  winRate: "胜率",
  save: "存档",
  deck: "牌组",
  stake: "赌注",
  bestHand: "最佳手牌",
  mostMoney: "最多金钱",

  collection: "收藏",
  deckStakes: "牌组赌注",
  jokerStickers: "小丑贴纸",
  challenges: "挑战",
  noData: "暂无数据",
  complete: "已完成",
  discovered: "已发现 {v}",
  stakesToGo: "还差 {n} 个赌注",
  stickersLeft: "还差 {n} 张贴纸",
  challengesToGo: "还差 {n} 个挑战",

  deckCollection: "牌组档案",
  deckCollectionSub: "共 {n} 个牌组 · 尝试与胜场按各赌注记录计算。",
  sortGameOrder: "游戏顺序",
  sortMostPlayed: "最常游玩",
  sortMostWins: "胜场最多",
  sortHighestWinRate: "胜率最高",
  sortHighestStake: "最高赌注",
  attempts: "尝试次数",
  best: "最高",
  none: "无",
  stakeBreakdown: "各赌注战绩",
  vsFleet: "对比全部牌组平均",
  cmpStake: "最高通关赌注",
  cmpWinRateVs: "胜率对比平均",
  cmpAttemptsVs: "尝试次数对比平均",
  cmpAvg: "平均 {v}",

  deckUsage: "牌组使用",
  deckUsageSub: "按全部赌注的累计尝试次数排序。",
  handProfile: "牌型画像",
  mostPlayed: "最常打出",
  rarestPlayed: "最少打出",
  totalHands: "牌型总数",
  handsSentence3: "{name} 最常打出 {a}，其次是 {b} 和 {c}。",
  handsSentence2: "{name} 最常打出 {a}，其次是 {b}。",
  handsSentence1: "{name} 最常打出 {a}。",
  handsSentenceNone: "{name} 还没有记录任何牌型。",

  jokerHall: "小丑名人堂",
  jokerHallSub:
    "使用次数表示该小丑出现的频次，而非独立局数。观察胜负来自各赌注记录。",
  sortMostUsed: "使用最多",
  sortMostObservedWins: "观察胜场最多",
  sortHighestObservedWinRate: "观察胜率最高",
  sortOriginalOrder: "原始顺序",
  usesTemplate: "{n} 次使用",
  observedWinRate: "观察胜率",
  lowSample: "样本过少",
  showTop12: "仅显示前 12",
  showAll: "显示全部 {n} 个小丑",

  economyTitle: "经济与玩法",
  economySub: "生涯计分板与中立的玩法信号。",
  dollarsEarned: "赚取金钱",
  shopDollarsSpent: "商店花费",
  netRetained: "净保留",
  shopRerolls: "商店刷新",
  jokersSold: "卖出小丑",
  cardsSold: "卖出卡牌",
  vouchersBought: "购买优惠券",
  tarotBought: "购买塔罗牌",
  planetBought: "购买星球牌",
  cardsPlayed: "出牌数",
  cardsDiscarded: "弃牌数",
  rerollsPerRound: "刷新 / 回合",
  discardRate: "弃牌率",
  cardsPerHand: "卡牌 / 手牌",

  consumablesTitle: "最常用消耗牌",
  consumablesSub: "按使用次数排名前 10。",
  vouchersTitle: "最常购买优惠券",
  vouchersSub: "按购买次数排名前 10。",

  importTitlePre: "拖入你的",
  importNote: "存档将在本地解析，不会上传任何内容。",
  dropCta: "拖放，或点击选择文件",
  dropHint: "profile.jkr、profile.json",

  errInvalidJson:
    "这个文件不是有效的 JSON。请导出 profile.json 或上传 profile.jkr。",
  errNotProfile:
    "这个文件看起来不是 Balatro 存档（缺少 career_stats / deck_usage）。",
  errRead: "无法将该文件解析为 Balatro 存档。",
  errExport: "导出图片失败，请重试。",
}

const zhTW: UIText = {
  ...zhCN,
  profile: "存檔",
  language: "語言",
  importProfile: "匯入存檔",
  exportImage: "匯出圖片",
  exporting: "匯出中…",

  balatroCareer: "小丑牌生涯",
  wins: "勝場",
  losses: "敗場",
  winRate: "勝率",
  save: "存檔",
  deck: "牌組",
  stake: "賭注",
  bestHand: "最佳手牌",
  mostMoney: "最多金錢",

  collection: "收藏",
  deckStakes: "牌組賭注",
  jokerStickers: "小丑貼紙",
  challenges: "挑戰",
  noData: "暫無資料",
  complete: "已完成",
  discovered: "已發現 {v}",
  stakesToGo: "還差 {n} 個賭注",
  stickersLeft: "還差 {n} 張貼紙",
  challengesToGo: "還差 {n} 個挑戰",

  deckCollection: "牌組檔案",
  deckCollectionSub: "共 {n} 個牌組 · 嘗試與勝場依各賭注紀錄計算。",
  sortGameOrder: "遊戲順序",
  sortMostPlayed: "最常遊玩",
  sortMostWins: "勝場最多",
  sortHighestWinRate: "勝率最高",
  sortHighestStake: "最高賭注",
  attempts: "嘗試次數",
  best: "最高",
  none: "無",
  stakeBreakdown: "各賭注戰績",
  vsFleet: "對比全部牌組平均",
  cmpStake: "最高通關賭注",
  cmpWinRateVs: "勝率對比平均",
  cmpAttemptsVs: "嘗試次數對比平均",
  cmpAvg: "平均 {v}",

  deckUsage: "牌組使用",
  deckUsageSub: "依全部賭注的累計嘗試次數排序。",
  handProfile: "牌型畫像",
  mostPlayed: "最常打出",
  rarestPlayed: "最少打出",
  totalHands: "牌型總數",
  handsSentence3: "{name} 最常打出 {a}，其次是 {b} 與 {c}。",
  handsSentence2: "{name} 最常打出 {a}，其次是 {b}。",
  handsSentence1: "{name} 最常打出 {a}。",
  handsSentenceNone: "{name} 還沒有記錄任何牌型。",

  jokerHall: "小丑名人堂",
  jokerHallSub:
    "使用次數表示該小丑出現的頻次，而非獨立局數。觀察勝負來自各賭注紀錄。",
  sortMostUsed: "使用最多",
  sortMostObservedWins: "觀察勝場最多",
  sortHighestObservedWinRate: "觀察勝率最高",
  sortOriginalOrder: "原始順序",
  usesTemplate: "{n} 次使用",
  observedWinRate: "觀察勝率",
  lowSample: "樣本過少",
  showTop12: "僅顯示前 12",
  showAll: "顯示全部 {n} 個小丑",

  economyTitle: "經濟與玩法",
  economySub: "生涯計分板與中立的玩法信號。",
  dollarsEarned: "賺取金錢",
  shopDollarsSpent: "商店花費",
  netRetained: "淨保留",
  shopRerolls: "商店刷新",
  jokersSold: "賣出小丑",
  cardsSold: "賣出卡牌",
  vouchersBought: "購買優惠券",
  tarotBought: "購買塔羅牌",
  planetBought: "購買星球牌",
  cardsPlayed: "出牌數",
  cardsDiscarded: "棄牌數",
  rerollsPerRound: "刷新 / 回合",
  discardRate: "棄牌率",
  cardsPerHand: "卡牌 / 手牌",

  consumablesTitle: "最常用消耗牌",
  consumablesSub: "依使用次數排名前 10。",
  vouchersTitle: "最常購買優惠券",
  vouchersSub: "依購買次數排名前 10。",

  importTitlePre: "拖入你的",
  importNote: "存檔將在本機解析，不會上傳任何內容。",
  dropCta: "拖放，或點擊選擇檔案",
  dropHint: "profile.jkr or profile.json",

  errInvalidJson:
    "這個檔案不是有效的 JSON。請匯出 profile.json 或上傳 profile.jkr。",
  errNotProfile:
    "這個檔案看起來不是 Balatro 存檔（缺少 career_stats / deck_usage）。",
  errRead: "無法將該檔案解析為 Balatro 存檔。",
  errExport: "匯出圖片失敗，請重試。",
}

const ja: UIText = {
  profile: "プロフィール",
  language: "言語",
  importProfile: "セーブを読み込む",
  exportImage: "画像を書き出す",
  exporting: "書き出し中…",

  balatroCareer: "Balatro キャリア",
  wins: "勝利",
  losses: "敗北",
  winRate: "勝率",
  save: "セーブ",
  deck: "デッキ",
  stake: "ステーク",
  bestHand: "最高ハンド",
  mostMoney: "最高所持金",

  collection: "コレクション",
  deckStakes: "デッキステーク",
  jokerStickers: "ジョーカーステッカー",
  challenges: "チャレンジ",
  noData: "データなし",
  complete: "達成",
  discovered: "{v} 発見",
  stakesToGo: "残り {n} ステーク",
  stickersLeft: "残り {n} ステッカー",
  challengesToGo: "残り {n} チャレンジ",

  deckCollection: "デッキコレクション",
  deckCollectionSub: "{n} デッキ · 挑戦数と勝利はステーク別記録から算出。",
  sortGameOrder: "ゲーム順",
  sortMostPlayed: "プレイ数順",
  sortMostWins: "勝利数順",
  sortHighestWinRate: "勝率順",
  sortHighestStake: "最高ステーク順",
  attempts: "挑戦数",
  best: "最高",
  none: "なし",
  stakeBreakdown: "ステーク別成績",
  vsFleet: "全デッキ平均との比較",
  cmpStake: "最高クリアステーク",
  cmpWinRateVs: "勝率（平均比）",
  cmpAttemptsVs: "挑戦数（平均比）",
  cmpAvg: "平均 {v}",

  deckUsage: "デッキ使用率",
  deckUsageSub: "全ステークの累計挑戦数で順位付け。",
  handProfile: "ハンドプロフィール",
  mostPlayed: "最多プレイ",
  rarestPlayed: "最少プレイ",
  totalHands: "ハンド総数",
  handsSentence3: "{name} は {a} を最も多くプレイし、次いで {b}、{c} です。",
  handsSentence2: "{name} は {a} を最も多くプレイし、次いで {b} です。",
  handsSentence1: "{name} は {a} を最も多くプレイします。",
  handsSentenceNone: "{name} はまだハンドを記録していません。",

  jokerHall: "ジョーカー殿堂",
  jokerHallSub:
    "使用回数はジョーカーが登場した頻度で、独立した試行数ではありません。観測勝敗はステーク別記録によります。",
  sortMostUsed: "使用回数順",
  sortMostObservedWins: "観測勝利順",
  sortHighestObservedWinRate: "観測勝率順",
  sortOriginalOrder: "元の順番",
  usesTemplate: "{n} 回使用",
  observedWinRate: "観測勝率",
  lowSample: "サンプル不足",
  showTop12: "上位12のみ",
  showAll: "全 {n} 体を表示",

  economyTitle: "経済とプレイスタイル",
  economySub: "キャリアのスコアボードと中立的なプレイ指標。",
  dollarsEarned: "獲得金額",
  shopDollarsSpent: "ショップ支出",
  netRetained: "純保有",
  shopRerolls: "ショップリロール",
  jokersSold: "売却ジョーカー",
  cardsSold: "売却カード",
  vouchersBought: "購入バウチャー",
  tarotBought: "購入タロット",
  planetBought: "購入プラネット",
  cardsPlayed: "プレイカード",
  cardsDiscarded: "捨てカード",
  rerollsPerRound: "リロール / ラウンド",
  discardRate: "捨て率",
  cardsPerHand: "カード / ハンド",

  consumablesTitle: "最多使用の消耗カード",
  consumablesSub: "使用回数トップ10。",
  vouchersTitle: "最多購入のバウチャー",
  vouchersSub: "購入回数トップ10。",

  importTitlePre: "ここにドロップ",
  importNote: "セーブはローカルで解析され、アップロードされません。",
  dropCta: "ドラッグ＆ドロップ、またはクリックして選択",
  dropHint: "profile.jkr or profile.json",

  errInvalidJson:
    "このファイルは有効な JSON ではありません。profile.json を書き出すか profile.jkr をアップロードしてください。",
  errNotProfile:
    "このファイルは Balatro のプロフィールに見えません（career_stats / deck_usage が不足）。",
  errRead: "このファイルを Balatro プロフィールとして読み込めませんでした。",
  errExport: "画像の書き出しに失敗しました。もう一度お試しください。",
}

const ko: UIText = {
  profile: "프로필",
  language: "언어",
  importProfile: "세이브 불러오기",
  exportImage: "이미지 내보내기",
  exporting: "내보내는 중…",

  balatroCareer: "발라트로 커리어",
  wins: "승리",
  losses: "패배",
  winRate: "승률",
  save: "세이브",
  deck: "덱",
  stake: "스테이크",
  bestHand: "최고 핸드",
  mostMoney: "최고 보유금",

  collection: "컬렉션",
  deckStakes: "덱 스테이크",
  jokerStickers: "조커 스티커",
  challenges: "챌린지",
  noData: "데이터 없음",
  complete: "완료",
  discovered: "{v} 발견",
  stakesToGo: "{n} 스테이크 남음",
  stickersLeft: "{n} 스티커 남음",
  challengesToGo: "{n} 챌린지 남음",

  deckCollection: "덱 컬렉션",
  deckCollectionSub: "{n}개 덱 · 시도와 승리는 스테이크별 기록으로 계산.",
  sortGameOrder: "게임 순서",
  sortMostPlayed: "최다 플레이",
  sortMostWins: "최다 승리",
  sortHighestWinRate: "최고 승률",
  sortHighestStake: "최고 스테이크",
  attempts: "시도",
  best: "최고",
  none: "없음",
  stakeBreakdown: "스테이크별 전적",
  vsFleet: "전체 덱 평균 대비",
  cmpStake: "최고 클리어 스테이크",
  cmpWinRateVs: "승률 (평균 대비)",
  cmpAttemptsVs: "시도 (평균 대비)",
  cmpAvg: "평균 {v}",

  deckUsage: "덱 사용량",
  deckUsageSub: "모든 스테이크의 누적 시도 수로 정렬.",
  handProfile: "핸드 프로필",
  mostPlayed: "최다 플레이",
  rarestPlayed: "최소 플레이",
  totalHands: "핸드 총계",
  handsSentence3: "{name} 님은 {a} 를 가장 자주 플레이하고, 그다음 {b}, {c} 입니다.",
  handsSentence2: "{name} 님은 {a} 를 가장 자주 플레이하고, 그다음 {b} 입니다.",
  handsSentence1: "{name} 님은 {a} 를 가장 자주 플레이합니다.",
  handsSentenceNone: "{name} 님은 아직 기록된 핸드가 없습니다.",

  jokerHall: "조커 명예의 전당",
  jokerHallSub:
    "사용 횟수는 조커가 등장한 빈도이며 개별 런 수가 아닙니다. 관측 승패는 스테이크별 기록입니다.",
  sortMostUsed: "최다 사용",
  sortMostObservedWins: "최다 관측 승리",
  sortHighestObservedWinRate: "최고 관측 승률",
  sortOriginalOrder: "원래 순서",
  usesTemplate: "{n}회 사용",
  observedWinRate: "관측 승률",
  lowSample: "표본 부족",
  showTop12: "상위 12개만",
  showAll: "전체 {n}개 조커 보기",

  economyTitle: "경제 & 플레이스타일",
  economySub: "커리어 스코어보드와 중립적 플레이 지표.",
  dollarsEarned: "획득 금액",
  shopDollarsSpent: "상점 지출",
  netRetained: "순 보유",
  shopRerolls: "상점 리롤",
  jokersSold: "판매한 조커",
  cardsSold: "판매한 카드",
  vouchersBought: "구매한 바우처",
  tarotBought: "구매한 타로",
  planetBought: "구매한 행성 카드",
  cardsPlayed: "플레이한 카드",
  cardsDiscarded: "버린 카드",
  rerollsPerRound: "리롤 / 라운드",
  discardRate: "버림 비율",
  cardsPerHand: "카드 / 핸드",

  consumablesTitle: "최다 사용 소모품",
  consumablesSub: "사용 횟수 상위 10개.",
  vouchersTitle: "최다 구매 바우처",
  vouchersSub: "구매 횟수 상위 10개.",

  importTitlePre: "여기에 드롭",
  importNote: "세이브는 로컬에서 분석되며 업로드되지 않습니다.",
  dropCta: "드래그 앤 드롭 또는 클릭하여 선택",
  dropHint: "profile.jkr or profile.json",

  errInvalidJson:
    "유효한 JSON 파일이 아닙니다. profile.json 을 내보내거나 profile.jkr 을 업로드하세요.",
  errNotProfile:
    "이 파일은 Balatro 프로필이 아닌 것 같습니다 (career_stats / deck_usage 없음).",
  errRead: "이 파일을 Balatro 프로필로 읽을 수 없습니다.",
  errExport: "이미지 내보내기에 실패했습니다. 다시 시도하세요.",
}

export const uiDictionaries: Record<Locale, UIText> = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  en,
  ja,
  ko,
}

export type TFn = (
  key: keyof UIText,
  vars?: Record<string, string | number>
) => string

const TextContext = createContext<TFn>((key) => String(key))

export function UITextProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const dict = uiDictionaries[locale] ?? en
  const t: TFn = (key, vars) => {
    let result = dict[key] ?? en[key] ?? String(key)
    if (vars) {
      for (const name of Object.keys(vars)) {
        result = result.split(`{${name}}`).join(String(vars[name]))
      }
    }
    return result
  }
  return <TextContext.Provider value={t}>{children}</TextContext.Provider>
}

export function useT(): TFn {
  return useContext(TextContext)
}
