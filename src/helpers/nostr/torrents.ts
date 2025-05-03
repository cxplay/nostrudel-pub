import { NostrEvent } from "nostr-tools";

export const TORRENT_KIND = 2003;
export const TORRENT_COMMENT_KIND = 2004;

export const Trackers = [
  "udp://tracker.coppersurfer.tk:6969/announce",
  "udp://tracker.openbittorrent.com:6969/announce",
  "udp://open.stealth.si:80/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://tracker.opentrackr.org:1337",
  "udp://tracker.leechers-paradise.org:6969",
  "udp://tracker.coppersurfer.tk:6969",
  "udp://tracker.opentrackr.org:1337",
  "udp://explodie.org:6969",
  "udp://tracker.empire-js.us:1337",
];

export function getTorrentTitle(torrent: NostrEvent) {
  const title = torrent.tags.find((t) => t[0] === "title")?.[1];
  if (!title) throw new Error("缺少标题");
  return title;
}
export function getTorrentBtih(torrent: NostrEvent) {
  const btih = torrent.tags.find((a) => a[0] === "btih" || a[0] === "x")?.[1];
  if (!btih) throw new Error("缺少 btih");
  return btih;
}
export function getTorrentFiles(torrent: NostrEvent) {
  return torrent.tags
    .filter((t) => t[0] === "file")
    .map((t) => {
      const name = t[1] as string;
      const size = t[2] ? parseInt(t[2]) : undefined;
      return { name, size };
    });
}
export function getTorrentSize(torrent: NostrEvent) {
  return getTorrentFiles(torrent).reduce((acc, f) => (f.size ? (acc += f.size) : acc), 0);
}

export function getTorrentMagnetLink(torrent: NostrEvent) {
  const btih = getTorrentBtih(torrent);
  const magnet = {
    xt: `urn:btih:${btih}`,
    dn: name,
    tr: Trackers,
  };
  const params = Object.entries(magnet)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v.map((a) => `${k}=${encodeURIComponent(a)}`).join("&");
      } else {
        return `${k}=${v as string}`;
      }
    })
    .flat()
    .join("&");
  return `magnet:?${params}`;
}

export function validateTorrent(torrent: NostrEvent) {
  try {
    getTorrentTitle(torrent);
    getTorrentBtih(torrent);
    return true;
  } catch (e) {
    return false;
  }
}

export type Category = {
  name: string;
  tag: string;
  sub_category?: Category[];
};

export const torrentCatagories: Category[] = [
  {
    name: "视频",
    tag: "video",
    sub_category: [
      {
        name: "电影",
        tag: "movie",
        sub_category: [
          { name: "DVDR 电影", tag: "dvdr" },
          { name: "HD 电影", tag: "hd" },
          { name: "4k 电影", tag: "4k" },
        ],
      },
      {
        name: "电视剧",
        tag: "tv",
        sub_category: [
          { name: "HD 电视剧", tag: "hd" },
          { name: "4k 电视剧", tag: "4k" },
        ],
      },
    ],
  },
  {
    name: "音频",
    tag: "audio",
    sub_category: [
      {
        name: "音乐",
        tag: "music",
        sub_category: [{ name: "FLAC", tag: "flac" }],
      },
      { name: "有声书", tag: "audio-book" },
    ],
  },
  {
    name: "应用",
    tag: "application",
    sub_category: [
      { name: "Windows", tag: "windows" },
      { name: "macOS", tag: "mac" },
      { name: "UNIX", tag: "unix" },
      { name: "iOS", tag: "ios" },
      { name: "Android", tag: "android" },
    ],
  },
  {
    name: "游戏",
    tag: "game",
    sub_category: [
      { name: "PC", tag: "pc" },
      { name: "macOS", tag: "mac" },
      { name: "PlayStation", tag: "psx" },
      { name: "Xbox", tag: "xbox" },
      { name: "Wii", tag: "wii" },
      { name: "iOS", tag: "ios" },
      { name: "Android", tag: "android" },
    ],
  },
  {
    name: "色情",
    tag: "porn",
    sub_category: [
      {
        name: "电影",
        tag: "movie",
        sub_category: [
          { name: "DVDR 电影", tag: "dvdr" },
          { name: "HD 电影", tag: "hd" },
          { name: "4k 电影", tag: "4k" },
        ],
      },
      { name: "图片", tag: "picture" },
      { name: "游戏", tag: "game" },
    ],
  },
  {
    name: "其他",
    tag: "other",
    sub_category: [
      { name: "档案", tag: "archive" },
      { name: "电子书", tag: "e-book" },
      { name: "漫画", tag: "comic" },
      { name: "图片", tag: "picture" },
    ],
  },
];
