import { ComponentWithAs, IconProps } from "@chakra-ui/react";

import {
  ArticleIcon,
  BadgeIcon,
  BookmarkIcon,
  ChannelsIcon,
  DirectMessagesIcon,
  EmojiPacksIcon,
  GoalIcon,
  ListsIcon,
  LiveStreamIcon,
  MapIcon,
  MediaIcon,
  MuteIcon,
  NotesIcon,
  NotificationsIcon,
  SearchIcon,
  TorrentIcon,
  TrackIcon,
  VideoIcon,
  WikiIcon,
} from "../icons";
import ShieldOff from "../icons/shield-off";
import MessageQuestionSquare from "../icons/message-question-square";
import UploadCloud01 from "../icons/upload-cloud-01";
import Edit04 from "../icons/edit-04";
import Users03 from "../icons/users-03";
import FileAttachment01 from "../icons/file-attachment-01";
import Rocket02 from "../icons/rocket-02";
import PuzzlePiece01 from "../icons/puzzle-piece-01";
import Users02 from "../icons/users-02";
import Wallet02 from "../icons/wallet-02";

export type App = {
  icon?: ComponentWithAs<"svg", IconProps>;
  image?: string;
  title: string;
  description: string;
  id: string;
  isExternal?: boolean;
  to: string;
};

export const internalApps: App[] = [
  { title: "笔记", description: "来自你朋友的短文本帖子", icon: NotesIcon, id: "notes", to: "/notes" },
  { title: "启动", description: "账户快速概览", icon: Rocket02, id: "launchpad", to: "/launchpad" },
  { title: "发现", description: "发现新资讯源", icon: PuzzlePiece01, id: "discover", to: "/discovery" },
  {
    title: "通知",
    description: "通知消息",
    icon: NotificationsIcon,
    id: "notifications",
    to: "/notifications",
  },
  {
    title: "消息",
    description: "私信",
    icon: DirectMessagesIcon,
    id: "messages",
    to: "/messages",
  },
  { title: "搜索", description: "搜索用户和笔记", icon: SearchIcon, id: "search", to: "/search" },
  {
    title: "串流",
    description: "观看直播",
    icon: LiveStreamIcon,
    id: "streams",
    to: "/streams",
  },
  {
    title: "群组",
    description: "基于中继的简单群组",
    icon: Users02,
    id: "groups",
    to: "/groups",
  },
  {
    title: "媒体",
    description: "浏览包含媒体的帖子",
    icon: MediaIcon,
    id: "pictures",
    to: "/pictures",
  },
  // { title: "Podcasts", description: "Social podcasts", icon: Podcast, id: "podcasts", to: "/podcasts" },
  { title: "百科", description: "浏览百科页面", icon: WikiIcon, id: "wiki", to: "/wiki" },
  {
    title: "频道",
    description: "在频道中浏览和交流",
    icon: ChannelsIcon,
    id: "channels",
    to: "/channels",
  },
  { title: "徽章", description: "创建和管理徽章", icon: BadgeIcon, id: "badges", to: "/badges" },
  { title: "募集", description: "管理和创建募集", icon: GoalIcon, id: "goals", to: "/goals" },
  { title: "Torrent", description: "浏览 Nostr 网络上的 Torrent", icon: TorrentIcon, id: "torrents", to: "/torrents" },
  { title: "表情包", description: "创建自定义表情包", icon: EmojiPacksIcon, id: "emojis", to: "/emojis" },
  { title: "书签", description: "管理你的书签", icon: BookmarkIcon, id: "bookmarks", to: "/bookmarks" },
  { title: "列表", description: "浏览和创建列表", icon: ListsIcon, id: "lists", to: "/lists" },
  { title: "曲目", description: "浏览 Stemstr 曲目", icon: TrackIcon, id: "tracks", to: "/tracks" },
  { title: "视频", description: "浏览视频", icon: VideoIcon, id: "videos", to: "/videos" },
  { title: "文章", description: "浏览文章", icon: ArticleIcon, id: "articles", to: "/articles" },
  { title: "文件", description: "浏览文件", icon: FileAttachment01, id: "files", to: "/files" },
  { title: "钱包", description: "接收和发送 Cashu 代币", icon: Wallet02, id: "wallet", to: "/wallet" },
];

export const internalTools: App[] = [
  {
    title: "事件控制台",
    description: "基于过滤器查找 Nostr 事件",
    icon: SearchIcon,
    id: "console",
    to: "/tools/console",
  },
  {
    title: "事件发布器",
    description: "编写和发布事件",
    icon: UploadCloud01,
    id: "publisher",
    to: "/tools/publisher",
  },
  {
    title: "未知事件",
    description: "包含未知事件的时间线",
    icon: MessageQuestionSquare,
    id: "unknown",
    to: "/tools/unknown",
  },
  { title: "地图", description: "探索 Geohash", icon: MapIcon, id: "map", to: "/map" },
  {
    title: "串流管理",
    description: "一个管理串流直播的面板",
    icon: LiveStreamIcon,
    id: "stream-moderation",
    to: "/streams/moderation",
  },
  {
    title: "静音图谱",
    description: "查看你的联系人中哪些人已将彼此静音",
    icon: MuteIcon,
    id: "network-mute-graph",
    to: "/tools/network-mute-graph",
  },
  {
    title: "私信图谱",
    description: "查看你的联系人中哪些人正在交流",
    icon: DirectMessagesIcon,
    id: "network-dm-graph",
    to: "/tools/network-dm-graph",
  },
  {
    title: "私信时间线",
    description: "所有人的私信时间线",
    icon: ShieldOff,
    id: "dm-timeline",
    to: "/tools/dm-timeline",
  },
  {
    title: "已订正事件",
    description: "一个展示帖子修改历史的时间线",
    icon: Edit04,
    id: "corrections",
    to: "/tools/corrections ",
  },
  {
    title: "noStrudel 用户",
    description: "发现其他使用 noStrudel 的用户",
    icon: Users03,
    id: "nostrudel-users",
    to: "/tools/nostrudel-users",
  },
];

export const externalTools: App[] = [
  {
    id: "nak",
    title: "Nostr Army Knife",
    description: "通用 NIP-19 工具",
    to: "https://nak.nostr.com/",
    image: "https://nak.nostr.com/favicon.ico",
    isExternal: true,
  },
  {
    id: "nostrdebug.co",
    title: "Nostr Debug",
    description: "调试 Nostr 中继和事件签名",
    to: "https://nostrdebug.com/",
    image: "https://nostrdebug.com/favicon.ico",
    isExternal: true,
  },
  {
    id: "dtan.xyz",
    title: "DTAN",
    description: "基于 Nostr 的 Torrent 索引",
    to: "https://dtan.xyz/",
    image: "https://dtan.xyz/logo_256.jpg",
    isExternal: true,
  },
  {
    id: "nostrapps.com",
    title: "Nostr Apps",
    description: "精选的 Nostr 应用目录",
    image: "https://uploads-ssl.webflow.com/641d0d46d5c124ac928a6027/64b1dd06d59d8f1e530d2926_32x32.png",
    to: "https://www.nostrapps.com/",
    isExternal: true,
  },
  {
    id: "metadata.nostr.com",
    title: "Nostr Profile Manager",
    description: "备份和管理你的 Nostr 资料",
    to: "https://metadata.nostr.com/",
    image: "https://metadata.nostr.com/img/git.png",
    isExternal: true,
  },
  {
    id: "nostr-delete.vercel.app",
    title: "Nostr Event Deletion",
    description: "高级事件删除",
    to: "https://nostr-delete.vercel.app/",
    image: "https://nostr-delete.vercel.app/favicon.png",
    isExternal: true,
  },
  {
    title: "Satellite CDN",
    description: "为 Nostr 生态设计的可扩展媒体托管",
    image: "https://satellite.earth/image.png",
    id: "satellite-cdn",
    to: "https://satellite.earth/cdn",
    isExternal: true,
  },
  {
    id: "w3.do",
    title: "URL Shortener",
    description: "在 Nostr 上生成和保存短链接",
    to: "https://w3.do/",
    image: "https://w3.do/favicon.ico",
    isExternal: true,
  },
  {
    id: "nosbin.com",
    title: "nosbin",
    description: "上传代码和片段到 Nostr",
    to: "https://nosbin.com/",
    image: "https://nosbin.com/logo.png",
    isExternal: true,
  },
  {
    id: "blossom.hzrd149.com",
    title: "Blossom Drive",
    description: "上传和管理 blob",
    to: "https://blossom.hzrd149.com/",
    image: "https://blossom.hzrd149.com/pwa-192x192.png",
    isExternal: true,
  },
  {
    id: "bouquet.slidestr.net",
    title: "Bouquet",
    description: "在多个服务器中管理你的  blob",
    to: "https://bouquet.slidestr.net/",
    image: "https://bouquet.slidestr.net/bouquet.png",
    isExternal: true,
  },
];

export const defaultAnonFavoriteApps = ["notes", "discover", "search", "articles", "streams"];
export const defaultUserFavoriteApps = ["launchpad", "notes", "discover", "notifications", "messages", "search"];

export const allApps = [...internalApps, ...internalTools, ...externalTools];
