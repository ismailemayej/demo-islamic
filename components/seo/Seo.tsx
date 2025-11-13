"use client";

import { ArticleJsonLd } from "next-seo";

interface ArticleSeoProps {
  headline: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: Array<{ "@type"?: string; name: string; url?: string } | string>;
  image: string[];
  publisher: { "@type": string; name: string; logo: string };
}

const ArticleSeo: React.FC<ArticleSeoProps> = ({
  headline,
  url,
  datePublished,
  dateModified,
  author,
  image,
  publisher,
}) => {
  return (
    <ArticleJsonLd
      type="NewsArticle"
      headline={headline}
      url={url}
      datePublished={datePublished}
      dateModified={dateModified}
      author={author}
      image={image}
      publisher={publisher}
      isAccessibleForFree={true}
    />
  );
};
export default ArticleSeo;
