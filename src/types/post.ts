type Properties = {
  title: Array<any>;
  description?: string;
  link?: string;
  language?: Array<any>;
  html?: string;
  size?: Array<string>;
  caption?: Array<string>;
};

export type ContentFormat = {
  block_width: number;
  block_height: number;
  display_source: string;
  block_aspect_ratio: number;
  page_icon?: string;
  bookmark_icon: string;
  bookmark_cover: string;
};

type ValueType =
  | 'page'
  | 'divider'
  | 'post'
  | 'text'
  | 'image'
  | 'video'
  | 'embed'
  | 'header'
  | 'sub_header'
  | 'sub_sub_header'
  | 'bookmark'
  | 'code'
  | 'quote'
  | 'callout'
  | 'tweet'
  | 'equation'
  | 'bulleted_list'
  | 'numbered_list';

type ContentValue = {
  id: string;
  parent_id: string;
  type: ValueType;
  properties: Properties;
  format?: ContentFormat;
  file_ids?: Array<string>;
};

type Content = {
  value: ContentValue;
};

type Post = {
  Page: string;
  Date: Date;
  hasTweet: boolean;
  Slug: string;
  content: Array<Content>;
  image?: string;
};

export default Post;
