import { memo } from "react";
import { Helmet } from "react-helmet-async";

export type HeadSeoProps = {
  title: string;
  content?: string;
};

function HeadSeo({ title, content }: HeadSeoProps) {
  content = content || "Description " + title;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={content} />
    </Helmet>
  );
}

export default memo(HeadSeo);
