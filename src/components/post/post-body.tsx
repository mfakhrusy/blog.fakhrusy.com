import { createElement, CSSProperties } from 'react';
import ReactJSXParser from '@zeit/react-jsx-parser';
import { PostedDate } from 'components/postedDate';
import components from 'components/dynamic';
import Heading from 'components/heading';
import blogStyles from 'styles/blog.module.css';
import { textBlock } from 'lib/notion/renderers';
import Post, { ContentFormat } from 'types/post';
import { Bookmark } from './bookmark';
import { ClickableImage } from './clickable-image';

const listTypes = new Set(['bulleted_list', 'numbered_list']);

type ListMap = {
  [id: string]: {
    key: string;
    isNested?: boolean;
    nested: Array<string>;
    children: React.ReactFragment;
  };
};

type Props = {
  post: Post;
};

export function PostBody({ post }: Props) {
  let listTagName: string | null = null;
  let listLastId: string | null = null;
  let listMap: ListMap = {};

  return (
    <div className={blogStyles.post}>
      <h1>{post.Page || ''}</h1>
      <PostedDate date={post.Date} />

      <hr />

      {(!post.content || post.content.length === 0) && (
        <p>This post has no content</p>
      )}

      {(post.content || []).map((block, blockIdx) => {
        const { value } = block;
        const { type, properties, id, parent_id } = value;
        const isLast = blockIdx === post.content.length - 1;
        const isList = listTypes.has(type);
        let toRender = [];

        if (isList) {
          listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol'];
          listLastId = `list${id}`;

          listMap[id] = {
            key: id,
            nested: [],
            children: textBlock(properties.title, true, id),
          };

          if (listMap[parent_id]) {
            listMap[id].isNested = true;
            listMap[parent_id].nested.push(id);
          }
        }

        if (listTagName && (isLast || !isList)) {
          toRender.push(
            createElement(
              listTagName,
              { key: listLastId! },
              Object.keys(listMap).map((itemId) => {
                if (listMap[itemId].isNested) return null;

                const createEl = (item) =>
                  createElement(
                    components.li || 'ul',
                    { key: item.key },
                    item.children,
                    item.nested.length > 0
                      ? createElement(
                          components.ul || 'ul',
                          { key: item + 'sub-list' },
                          item.nested.map((nestedId) =>
                            createEl(listMap[nestedId])
                          )
                        )
                      : null
                  );
                return createEl(listMap[itemId]);
              })
            )
          );
          listMap = {};
          listLastId = null;
          listTagName = null;
        }

        const renderHeading = (Type: string | React.ComponentType) => {
          toRender.push(
            <Heading key={id}>
              <Type key={id}>{textBlock(properties.title, true, id)}</Type>
            </Heading>
          );
        };

        const renderBookmark = ({
          link,
          title,
          description,
          format,
        }: {
          link: string;
          title: any[];
          description: string;
          format: ContentFormat;
        }) => {
          const { bookmark_icon: icon, bookmark_cover: cover } = format;
          toRender.push(
            <Bookmark
              link={link}
              title={title}
              description={description}
              icon={icon}
              cover={cover}
            />
          );
        };

        switch (type) {
          case 'text':
            if (properties) {
              toRender.push(textBlock(properties.title, false, id));
            }
            break;
          case 'embed': {
            const { format = {} as ContentFormat } = value;
            // may be buggy, see block_aspect_ration in format object to debug
            // (since I removed the check on embed type), look up the image/video type
            const { block_width, block_height, display_source } = format;
            const baseBlockWidth = 768;
            const roundFactor = Math.pow(10, 2);
            const width = `${
              Math.round((block_width / baseBlockWidth) * 100 * roundFactor) /
              roundFactor
            }%`;

            const childStyle: CSSProperties = {
              width,
              border: 'none',
              height: block_height,
              display: 'block',
              maxWidth: '100%',
            };

            let child = (
              <iframe
                style={childStyle}
                src={display_source}
                key={id}
                className="asset-wrapper"
              />
            );

            toRender.push(child);
            break;
          }
          case 'image': {
            const { format = {} as ContentFormat } = value;
            const { block_width, block_height, display_source } = format;
            const baseBlockWidth = 768;
            const roundFactor = Math.pow(10, 2);
            // calculate percentages
            const width = block_width
              ? `${
                  Math.round(
                    (block_width / baseBlockWidth) * 100 * roundFactor
                  ) / roundFactor
                }%`
              : block_height || '100%';

            const childStyle: CSSProperties = {
              width,
              border: 'none',
              height: undefined,
              display: 'block',
              maxWidth: '100%',
            };

            let src = `/api/asset?assetUrl=${encodeURIComponent(
              display_source
            )}&blockId=${id}`;

            let imgAlt = properties.caption?.[0] ?? 'An image from notion';

            toRender.push(
              <ClickableImage
                key={id}
                src={src}
                alt={imgAlt}
                style={childStyle}
              />
            );
            break;
          }
          case 'video': {
            const { format = {} as ContentFormat } = value;
            const {
              block_width,
              block_height,
              display_source,
              block_aspect_ratio,
            } = format;
            const baseBlockWidth = 256;
            const roundFactor = Math.pow(10, 2);
            // calculate percentages
            const width = block_width
              ? `${
                  Math.round(
                    (block_width / baseBlockWidth) * 100 * roundFactor
                  ) / roundFactor
                }%`
              : block_height || '100%';

            const useWrapper = block_aspect_ratio && !block_height;
            const childStyle: CSSProperties = useWrapper
              ? {
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  position: 'absolute',
                  top: 0,
                }
              : {
                  width,
                  border: 'none',
                  height: block_height,
                  display: 'block',
                  maxWidth: '100%',
                };

            let src = `/api/asset?assetUrl=${encodeURIComponent(
              display_source
            )}&blockId=${id}`;

            let child = (
              <video
                key={useWrapper ? undefined : id}
                src={src}
                controls
                loop
                muted
                autoPlay
                style={childStyle}
              />
            );

            toRender.push(
              useWrapper ? (
                <div
                  style={{
                    paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
                    position: 'relative',
                  }}
                  className="asset-wrapper"
                  key={id}
                >
                  {child}
                </div>
              ) : (
                child
              )
            );
            break;
          }
          case 'header':
            renderHeading('h1');
            break;
          case 'sub_header':
            renderHeading('h2');
            break;
          case 'sub_sub_header':
            renderHeading('h3');
            break;
          case 'bookmark':
            const { link, title, description } = properties;
            const { format = {} as ContentFormat } = value;
            renderBookmark({ link, title, description, format });
            break;
          case 'code': {
            if (properties.title) {
              const content = properties.title[0][0];
              const language = properties.language[0][0];

              if (language === 'LiveScript') {
                // this requires the DOM for now
                toRender.push(
                  <ReactJSXParser
                    key={id}
                    jsx={content}
                    components={components}
                    componentsOnly={false}
                    renderInpost={false}
                    allowUnknownElements={true}
                    blacklistedTags={['script', 'style']}
                  />
                );
              } else {
                toRender.push(
                  <components.Code key={id} language={language || ''}>
                    {content}
                  </components.Code>
                );
              }
            }
            break;
          }
          case 'quote': {
            if (properties.title) {
              toRender.push(
                createElement(
                  components.blockquote,
                  { key: id },
                  properties.title
                )
              );
            }
            break;
          }
          case 'callout': {
            toRender.push(
              <div className="callout" key={id}>
                {value.format?.page_icon && (
                  <div>{value.format?.page_icon}</div>
                )}
                <div className="text">
                  {textBlock(properties.title, true, id)}
                </div>
              </div>
            );
            break;
          }
          case 'tweet': {
            if (properties.html) {
              toRender.push(
                <div
                  dangerouslySetInnerHTML={{ __html: properties.html }}
                  key={id}
                />
              );
            }
            break;
          }
          case 'equation': {
            if (properties && properties.title) {
              const content = properties.title[0][0];
              toRender.push(
                <components.Equation key={id} displayMode={true}>
                  {content}
                </components.Equation>
              );
            }
            break;
          }
          case 'page':
          case 'divider':
          case 'bulleted_list':
          case 'numbered_list':
            // do nothing
            break;
          default:
            if (process.env.NODE_ENV !== 'production') {
              console.log('unknown type', type);
            }
            break;
        }

        return toRender;
      })}
    </div>
  );
}
