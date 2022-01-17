import Link from 'next/link';
import Head from 'next/head';
import ExtLink from 'components/ext-link';
import { useRouter } from 'next/router';
import styles from 'styles/header.module.css';

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
  { label: 'Personal Site', link: 'https://fakhrusy.com' },
  { label: 'Twitter', link: 'https://twitter.com/f_fakhrusy' },
  { label: 'GitHub', link: 'https://github.com/mfakhrusy' },
];

const newOgImageURL = 'https://blog.fakhrusy.com/neuron.jpg';

type Props = {
  titlePrefix?: string;
  imagePreview?: string; // image name that will be used as preview
};

const Header = ({ titlePrefix, imagePreview }: Props) => {
  const { pathname } = useRouter();

  const title = `${titlePrefix ? `${titlePrefix} |` : ''} Fahru's Brain Dumps`;

  const ogImage = imagePreview
    ? `/post-preview/${imagePreview}`
    : newOgImageURL;
  const ogPreviewImageURL = `https://blog.fakhrusy.com/post-preview/${imagePreview}`;
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  console.log(isIframe);

  return (
    <header className={styles.header}>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="My brain dumps about anything that I found share-worthy"
        />
        <meta
          property="og:title"
          content={titlePrefix ?? "Fahru's Brain Dumps"}
        />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:site" content="@f_fakhrusy" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={imagePreview ? ogPreviewImageURL : newOgImageURL}
        />
        <meta
          name="twitter:description"
          content={titlePrefix ?? "Fahru's Brain Dumps"}
        />
      </Head>
      <ul>
        {navItems
          .filter((item) => {
            if (isIframe) {
              if (item.page) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          })
          .map(({ label, page, link }) => (
            <li key={label}>
              {page ? (
                <Link href={page}>
                  <a className={pathname === page ? 'active' : undefined}>
                    {label}
                  </a>
                </Link>
              ) : (
                <ExtLink href={link}>{label}</ExtLink>
              )}
            </li>
          ))}
      </ul>
    </header>
  );
};

export default Header;
