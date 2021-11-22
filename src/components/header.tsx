import Link from 'next/link';
import Head from 'next/head';
import ExtLink from 'components/ext-link';
import { useRouter } from 'next/router';
import styles from 'styles/header.module.css';

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Home', page: '/' },
];

const newOgImageURL = 'https://blog.fakhrusy.com/neuron.jpg';

type Props = {
  titlePrefix?: string;
  imagePreview?: string; // image name that will be used as preview
};

const Header = ({ titlePrefix, imagePreview }: Props) => {
  const { pathname } = useRouter();

  let title = `${titlePrefix ? `${titlePrefix} |` : ''} Fahru's Brain Dumps`;

  let ogImage = imagePreview ? `/post-preview/${imagePreview}` : newOgImageURL;

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
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <ul>
        {navItems.map(({ label, page, link }) => (
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
