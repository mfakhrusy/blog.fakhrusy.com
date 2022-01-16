import Link from 'next/link';
import Header from 'components/header';

import blogStyles from 'styles/blog.module.css';
import sharedStyles from 'styles/shared.module.css';

import { getBlogLink, postIsPublished } from 'lib/blog-helpers';
import { textBlock } from 'lib/notion/renderers';
import getNotionUsers from 'lib/notion/getNotionUsers';
import getBlogIndex from 'lib/notion/getBlogIndex';
import { PostedDate } from 'components/postedDate';

export async function getStaticProps({ preview }) {
  const postsTable = await getBlogIndex();

  const authorsToGet: Set<string> = new Set();
  const posts: any[] = Object.keys(postsTable)
    .map((slug) => {
      const post = postsTable[slug];
      // remove draft posts in production
      if (process.env.NODE_ENV === 'production') {
        if (!preview && !postIsPublished(post)) {
          return null;
        }
      }
      post.Authors = post.Authors || [];
      for (const author of post.Authors) {
        authorsToGet.add(author);
      }
      return post;
    })
    .filter(Boolean);

  const { users } = await getNotionUsers([...authorsToGet]);

  posts
    .map((post) => {
      post.Authors = post.Authors.map((id) => users[id].full_name);
    })
    .reverse();

  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 10,
  };
}

const Index = ({ posts = [], preview }) => {
  console.log(process.env.NODE_ENV);
  return (
    <>
      <Header titlePrefix="Blog" />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        <h1>Fahru's Brain Dumps</h1>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.map((post) => {
          return (
            <div className={blogStyles.postPreview} key={post.Slug}>
              <h3>
                <span className={blogStyles.titleContainer}>
                  {!postIsPublished(post) && (
                    <span className={blogStyles.draftBadge}>Draft</span>
                  )}
                  <Link href="/[slug]" as={getBlogLink(post.Slug)}>
                    <a>{post.Page}</a>
                  </Link>
                </span>
              </h3>
              <PostedDate date={post.Date} />
              <p>
                {(!post.preview || post.preview.length === 0) &&
                  'No preview available'}
                {(post.preview || []).map((block, idx) =>
                  textBlock(block, true, `${post.Slug}${idx}`)
                )}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Index;
