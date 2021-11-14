import blogStyles from '../styles/blog.module.css'

type Props = {
  link: string
  title: any[]
  description: string
  icon: string
  cover: string
}

export function Bookmark({ link, title, description, icon, cover }: Props) {
  return (
    <div className={blogStyles.bookmark}>
      <div>
        <div style={{ display: 'flex' }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={blogStyles.bookmarkContentsWrapper}
            href={link}
          >
            <div role="button" className={blogStyles.bookmarkContents}>
              <div className={blogStyles.bookmarkInfo}>
                <div className={blogStyles.bookmarkTitle}>{title}</div>
                <div className={blogStyles.bookmarkDescription}>
                  {description}
                </div>
                <div className={blogStyles.bookmarkLinkWrapper}>
                  <img src={icon} className={blogStyles.bookmarkLinkIcon} />
                  <div className={blogStyles.bookmarkLink}>{link}</div>
                </div>
              </div>
              <div className={blogStyles.bookmarkCoverWrapper1}>
                <div className={blogStyles.bookmarkCoverWrapper2}>
                  <div className={blogStyles.bookmarkCoverWrapper3}>
                    <img src={cover} className={blogStyles.bookmarkCover} />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
